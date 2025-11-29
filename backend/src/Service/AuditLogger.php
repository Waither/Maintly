<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\AuditLog;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class AuditLogger {
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly RequestStack $requestStack,
    ) {}

    /**
     * Log an action.
     *
     * @param array<string, mixed>|null $changes
     * @param array<string, mixed>|null $metadata
     */
    public function log(
        string $action,
        ?string $entityType = null,
        ?int $entityId = null,
        ?array $changes = null,
        ?array $metadata = null,
        ?User $user = null,
    ): void {
        $auditLog = new AuditLog();

        // Get current user if not provided
        if ($user === null) {
            $token = $this->tokenStorage->getToken();
            if ($token && $token->getUser() instanceof User) {
                $user = $token->getUser();
            }
        }

        $auditLog->setUser($user);
        $auditLog->setAction($action);
        $auditLog->setEntityType($entityType);
        $auditLog->setEntityId($entityId);
        $auditLog->setChanges($changes);
        $auditLog->setMetadata($metadata);

        // Get request info
        $request = $this->requestStack->getCurrentRequest();
        if ($request) {
            $auditLog->setIpAddress($request->getClientIp());
            $auditLog->setUserAgent($request->headers->get('User-Agent'));
        }

        $this->entityManager->persist($auditLog);
        $this->entityManager->flush();
    }

    /**
     * Log entity creation.
     *
     * @param array<string, mixed>|null $metadata
     */
    public function logCreated(object $entity, ?array $metadata = null): void {
        $this->log(
            action: 'created',
            entityType: $this->getEntityType($entity),
            entityId: $this->getEntityId($entity),
            metadata: $metadata,
        );
    }

    /**
     * Log entity update.
     *
     * @param array<string, mixed> $changes
     * @param array<string, mixed>|null $metadata
     */
    public function logUpdated(object $entity, array $changes, ?array $metadata = null): void {
        $this->log(
            action: 'updated',
            entityType: $this->getEntityType($entity),
            entityId: $this->getEntityId($entity),
            changes: $changes,
            metadata: $metadata,
        );
    }

    /**
     * Log entity deletion.
     *
     * @param array<string, mixed>|null $metadata
     */
    public function logDeleted(object $entity, ?array $metadata = null): void {
        $this->log(
            action: 'deleted',
            entityType: $this->getEntityType($entity),
            entityId: $this->getEntityId($entity),
            metadata: $metadata,
        );
    }

    /**
     * Log custom action.
     *
     * @param array<string, mixed>|null $metadata
     */
    public function logAction(string $action, ?array $metadata = null): void {
        $this->log(
            action: $action,
            metadata: $metadata,
        );
    }

    private function getEntityType(object $entity): string {
        $class = get_class($entity);
        $parts = explode('\\', $class);

        return end($parts);
    }

    private function getEntityId(object $entity): ?int {
        if (method_exists($entity, 'getId')) {
            return $entity->getId();
        }

        return null;
    }
}
