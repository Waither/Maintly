<?php

namespace App\Entity;

use App\Repository\NotificationRepository;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * Represents a notification for a user
 * Stores in-app notifications displayed in bell icon with unread count.
 */
#[ORM\Entity(repositoryClass: NotificationRepository::class)]
#[ORM\Table(name: 'notifications')]
#[ORM\Index(name: 'idx_user_created', columns: ['user_id', 'created_at'])]
#[ORM\Index(name: 'idx_user_is_read', columns: ['user_id', 'is_read'])]
#[ORM\HasLifecycleCallbacks]
class Notification {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    #[Groups(['notification:read', 'notification:list'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private User $user;

    /**
     * Notification type: report_completed, report_failed, work_order_assigned, etc.
     */
    #[ORM\Column(type: Types::STRING, length: 50)]
    #[Groups(['notification:read', 'notification:list'])]
    private string $type;

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Groups(['notification:read', 'notification:list'])]
    private string $title;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['notification:read', 'notification:list'])]
    private ?string $message = null;

    /**
     * Additional data (JSON): reportId, workOrderId, etc.
     *
     * @var array<string, mixed>|null
     */
    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['notification:read'])]
    private ?array $data = null;

    #[ORM\Column(type: Types::BOOLEAN, options: ['default' => false])]
    #[Groups(['notification:read', 'notification:list'])]
    private bool $isRead = false;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    #[Groups(['notification:read', 'notification:list'])]
    private DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    #[Groups(['notification:read', 'notification:list'])]
    private ?DateTimeImmutable $readAt = null;

    public function __construct() {
        $this->createdAt = new DateTimeImmutable();
    }

    #[ORM\PrePersist]
    public function onPrePersist(): void {
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getUser(): User {
        return $this->user;
    }

    public function setUser(User $user): self {
        $this->user = $user;

        return $this;
    }

    public function getType(): string {
        return $this->type;
    }

    public function setType(string $type): self {
        $this->type = $type;

        return $this;
    }

    public function getTitle(): string {
        return $this->title;
    }

    public function setTitle(string $title): self {
        $this->title = $title;

        return $this;
    }

    public function getMessage(): ?string {
        return $this->message;
    }

    public function setMessage(?string $message): self {
        $this->message = $message;

        return $this;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getData(): ?array {
        return $this->data;
    }

    /**
     * @param array<string, mixed>|null $data
     */
    public function setData(?array $data): self {
        $this->data = $data;

        return $this;
    }

    public function isRead(): bool {
        return $this->isRead;
    }

    public function setIsRead(bool $isRead): self {
        $this->isRead = $isRead;
        if ($isRead && $this->readAt === null) {
            $this->readAt = new DateTimeImmutable();
        }

        return $this;
    }

    public function markAsRead(): self {
        return $this->setIsRead(true);
    }

    public function getCreatedAt(): DateTimeImmutable {
        return $this->createdAt;
    }

    public function getReadAt(): ?DateTimeImmutable {
        return $this->readAt;
    }
}
