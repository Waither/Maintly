<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use App\Entity\AuditLog;
use App\Entity\User;
use DateTimeImmutable;
use DateTimeInterface;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;
use ReflectionClass;
use ReflectionNamedType;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Automatically logs entity changes to audit_logs table.
 * Listens to Doctrine lifecycle events for tracked entities.
 */
#[AsDoctrineListener(event: Events::postPersist)]
#[AsDoctrineListener(event: Events::preUpdate)]
#[AsDoctrineListener(event: Events::postUpdate)]
#[AsDoctrineListener(event: Events::postRemove)]
class DoctrineAuditSubscriber {
    /**
     * Entities to track for audit logging.
     */
    private const TRACKED_ENTITIES = [
        'App\Entity\WorkOrder',
        'App\Entity\Equipment',
        'App\Entity\User',
        'App\Entity\Tag',
        'App\Entity\Report',
    ];

    /**
     * Fields to exclude from change tracking (sensitive or auto-updated data).
     */
    private const EXCLUDED_FIELDS = [
        'password',
        'token',
        'apiToken',
        'salt',
        'plainPassword',
        'lastLoginAt',  // Auto-updated on every login, not interesting for audit
    ];

    /**
     * Store changes before flush for updates.
     *
     * @var array<string, array<string, mixed>>
     */
    private array $pendingChanges = [];

    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly RequestStack $requestStack,
        private readonly Connection $connection,
    ) {}

    public function postPersist(PostPersistEventArgs $args): void {
        $entity = $args->getObject();

        if (!$this->shouldTrack($entity)) {
            return;
        }

        $this->logAction(
            entityManager: $args->getObjectManager(),
            action: 'created',
            entity: $entity,
            changes: $this->getEntityData($entity),
        );
    }

    public function preUpdate(PreUpdateEventArgs $args): void {
        $entity = $args->getObject();

        if (!$this->shouldTrack($entity)) {
            return;
        }

        // Store changes before they are applied
        $entityId = spl_object_hash($entity);
        $changes = [];

        foreach ($args->getEntityChangeSet() as $field => $values) {
            if (in_array($field, self::EXCLUDED_FIELDS, true)) {
                continue;
            }

            $valuesArray = is_array($values) ? $values : $values->toArray();
            [$oldValue, $newValue] = $valuesArray;
            $changes[$field] = [
                'from' => $this->serializeValue($oldValue),
                'to' => $this->serializeValue($newValue),
            ];
        }

        if (!empty($changes)) {
            $this->pendingChanges[$entityId] = $changes;
        }
    }

    public function postUpdate(PostUpdateEventArgs $args): void {
        $entity = $args->getObject();

        if (!$this->shouldTrack($entity)) {
            return;
        }

        $entityId = spl_object_hash($entity);
        $changes = $this->pendingChanges[$entityId] ?? [];
        unset($this->pendingChanges[$entityId]);

        if (empty($changes)) {
            return;
        }

        $this->logAction(
            entityManager: $args->getObjectManager(),
            action: 'updated',
            entity: $entity,
            changes: $changes,
        );
    }

    public function postRemove(PostRemoveEventArgs $args): void {
        $entity = $args->getObject();

        if (!$this->shouldTrack($entity)) {
            return;
        }

        $this->logAction(
            entityManager: $args->getObjectManager(),
            action: 'deleted',
            entity: $entity,
            changes: $this->getEntityData($entity),
        );
    }

    private function shouldTrack(object $entity): bool {
        // Don't track AuditLog itself
        if ($entity instanceof AuditLog) {
            return false;
        }

        $class = get_class($entity);

        return in_array($class, self::TRACKED_ENTITIES, true);
    }

    /**
     * @param array<string, mixed> $changes
     */
    private function logAction(
        object $entityManager,
        string $action,
        object $entity,
        array $changes,
    ): void {
        // Get current user
        $userId = null;
        $token = $this->tokenStorage->getToken();
        if ($token && $token->getUser() instanceof User) {
            $userId = $token->getUser()->getId();
        }

        // Get request info
        $ipAddress = null;
        $userAgent = null;
        $request = $this->requestStack->getCurrentRequest();
        if ($request) {
            $ipAddress = $request->getClientIp();
            $userAgent = $request->headers->get('User-Agent');
        }

        // Use direct DBAL insert to avoid flush loop
        $this->connection->insert('audit_logs', [
            'user_id' => $userId,
            'action' => $this->getEntityShortName($entity) . '.' . $action,
            'entity_type' => $this->getEntityShortName($entity),
            'entity_id' => $this->getEntityId($entity),
            'changes' => json_encode($changes),
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent ? substr($userAgent, 0, 255) : null,
            'created_at' => (new DateTimeImmutable())->format('Y-m-d H:i:s'),
        ]);
    }

    private function getEntityShortName(object $entity): string {
        $class = get_class($entity);
        $parts = explode('\\', $class);

        return end($parts);
    }

    private function getEntityId(object $entity): ?int {
        if (method_exists($entity, 'getId')) {
            $id = $entity->getId();

            return is_int($id) ? $id : null;
        }

        return null;
    }

    /**
     * Get entity data for create/delete logging.
     * Uses reflection to get all entity properties.
     *
     * @return array<string, mixed>
     */
    private function getEntityData(object $entity): array {
        $data = [];
        $reflection = new ReflectionClass($entity);

        foreach ($reflection->getProperties() as $property) {
            $propertyName = $property->getName();

            // Skip excluded fields
            if (in_array($propertyName, self::EXCLUDED_FIELDS, true)) {
                continue;
            }

            // Skip collections (OneToMany, ManyToMany relationships)
            $propertyType = $property->getType();
            if ($propertyType instanceof ReflectionNamedType) {
                $typeName = $propertyType->getName();
                if ($typeName === 'Doctrine\Common\Collections\Collection'
                    || is_subclass_of($typeName, 'Doctrine\Common\Collections\Collection')) {
                    continue;
                }
            }

            // Build getter name
            $getterName = 'get' . ucfirst($propertyName);
            $isserName = 'is' . ucfirst($propertyName);

            if (method_exists($entity, $getterName)) {
                $value = $entity->$getterName();
            }
            elseif (method_exists($entity, $isserName)) {
                $value = $entity->$isserName();
            }
            else {
                continue;
            }

            $data[$propertyName] = $this->serializeValue($value);
        }

        return $data;
    }

    private function serializeValue(mixed $value): mixed {
        if ($value === null) {
            return null;
        }

        if (is_scalar($value)) {
            return $value;
        }

        if ($value instanceof DateTimeInterface) {
            return $value->format('Y-m-d H:i:s');
        }

        if (is_object($value)) {
            // For related entities, just get ID
            if (method_exists($value, 'getId')) {
                return $value->getId();
            }
            if (method_exists($value, '__toString')) {
                return (string) $value;
            }

            return get_class($value);
        }

        if (is_array($value)) {
            return json_encode($value);
        }

        return (string) $value;
    }
}
