<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\AuditLogRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AuditLogRepository::class)]
#[ORM\Table(name: 'audit_logs')]
#[ORM\Index(columns: ['user_id'], name: 'idx_audit_user')]
#[ORM\Index(columns: ['action'], name: 'idx_audit_action')]
#[ORM\Index(columns: ['entity_type'], name: 'idx_audit_entity_type')]
#[ORM\Index(columns: ['created_at'], name: 'idx_audit_created')]
#[ORM\HasLifecycleCallbacks]
class AuditLog {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['audit:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?User $user = null;

    #[ORM\Column(length: 100)]
    #[Groups(['audit:read'])]
    private string $action;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['audit:read'])]
    private ?string $entityType = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['audit:read'])]
    private ?int $entityId = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['audit:read'])]
    private ?array $changes = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['audit:read'])]
    private ?array $metadata = null;

    #[ORM\Column(length: 45, nullable: true)]
    #[Groups(['audit:read'])]
    private ?string $ipAddress = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['audit:read'])]
    private ?string $userAgent = null;

    #[ORM\Column]
    #[Groups(['audit:read'])]
    private DateTimeImmutable $createdAt;

    public function __construct() {
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getUser(): ?User {
        return $this->user;
    }

    public function setUser(?User $user): self {
        $this->user = $user;

        return $this;
    }

    public function getAction(): string {
        return $this->action;
    }

    public function setAction(string $action): self {
        $this->action = $action;

        return $this;
    }

    public function getEntityType(): ?string {
        return $this->entityType;
    }

    public function setEntityType(?string $entityType): self {
        $this->entityType = $entityType;

        return $this;
    }

    public function getEntityId(): ?int {
        return $this->entityId;
    }

    public function setEntityId(?int $entityId): self {
        $this->entityId = $entityId;

        return $this;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getChanges(): ?array {
        return $this->changes;
    }

    /**
     * @param array<string, mixed>|null $changes
     */
    public function setChanges(?array $changes): self {
        $this->changes = $changes;

        return $this;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getMetadata(): ?array {
        return $this->metadata;
    }

    /**
     * @param array<string, mixed>|null $metadata
     */
    public function setMetadata(?array $metadata): self {
        $this->metadata = $metadata;

        return $this;
    }

    public function getIpAddress(): ?string {
        return $this->ipAddress;
    }

    public function setIpAddress(?string $ipAddress): self {
        $this->ipAddress = $ipAddress;

        return $this;
    }

    public function getUserAgent(): ?string {
        return $this->userAgent;
    }

    public function setUserAgent(?string $userAgent): self {
        $this->userAgent = $userAgent;

        return $this;
    }

    public function getCreatedAt(): DateTimeImmutable {
        return $this->createdAt;
    }
}
