<?php

namespace App\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Ignore;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity]
#[ORM\Table(name: 'work_order_activities')]
class WorkOrderActivity {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'text')]
    private string $description;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $timeSpent = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTime $completedAt = null;

    #[ORM\Column(type: 'datetime')]
    private DateTime $createdAt;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTime $updatedAt = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTime $deletedAt = null;

    #[ORM\ManyToOne(targetEntity: WorkOrder::class, inversedBy: 'activities')]
    #[ORM\JoinColumn(name: 'work_order_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Ignore]
    private WorkOrder $workOrder;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'performed_by', referencedColumnName: 'id', nullable: false)]
    #[MaxDepth(1)]
    private User $performedBy;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'created_by', referencedColumnName: 'id', nullable: false)]
    #[MaxDepth(1)]
    private User $createdBy;

    public function __construct() {
        $this->createdAt = new DateTime();
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getDescription(): string {
        return $this->description;
    }

    public function setDescription(string $description): self {
        $this->description = $description;

        return $this;
    }

    public function getTimeSpent(): ?int {
        return $this->timeSpent;
    }

    public function setTimeSpent(?int $timeSpent): self {
        $this->timeSpent = $timeSpent;

        return $this;
    }

    public function getCompletedAt(): ?DateTime {
        return $this->completedAt;
    }

    public function setCompletedAt(?DateTime $completedAt): self {
        $this->completedAt = $completedAt;

        return $this;
    }

    public function getCreatedAt(): DateTime {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?DateTime {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?DateTime $updatedAt): self {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getDeletedAt(): ?DateTime {
        return $this->deletedAt;
    }

    public function setDeletedAt(?DateTime $deletedAt): self {
        $this->deletedAt = $deletedAt;

        return $this;
    }

    public function getWorkOrder(): WorkOrder {
        return $this->workOrder;
    }

    public function setWorkOrder(WorkOrder $workOrder): self {
        $this->workOrder = $workOrder;

        return $this;
    }

    public function getPerformedBy(): User {
        return $this->performedBy;
    }

    public function setPerformedBy(User $performedBy): self {
        $this->performedBy = $performedBy;

        return $this;
    }

    public function getCreatedBy(): User {
        return $this->createdBy;
    }

    public function setCreatedBy(User $createdBy): self {
        $this->createdBy = $createdBy;

        return $this;
    }
}
