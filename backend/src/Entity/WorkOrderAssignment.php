<?php

namespace App\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Ignore;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity]
#[ORM\Table(name: 'work_order_assignments')]
#[ORM\UniqueConstraint(name: 'unique_work_order_user', columns: ['work_order_id', 'user_id'])]
class WorkOrderAssignment {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'datetime')]
    private DateTime $assignedAt;

    #[ORM\ManyToOne(targetEntity: WorkOrder::class, inversedBy: 'assignments')]
    #[ORM\JoinColumn(name: 'work_order_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Ignore]
    private WorkOrder $workOrder;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false)]
    #[MaxDepth(1)]
    private User $user;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'assigned_by', referencedColumnName: 'id', nullable: false)]
    #[MaxDepth(1)]
    private User $assignedBy;

    public function __construct() {
        $this->assignedAt = new DateTime();
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getAssignedAt(): DateTime {
        return $this->assignedAt;
    }

    public function setAssignedAt(DateTime $assignedAt): self {
        $this->assignedAt = $assignedAt;

        return $this;
    }

    public function getWorkOrder(): WorkOrder {
        return $this->workOrder;
    }

    public function setWorkOrder(WorkOrder $workOrder): self {
        $this->workOrder = $workOrder;

        return $this;
    }

    public function getUser(): User {
        return $this->user;
    }

    public function setUser(User $user): self {
        $this->user = $user;

        return $this;
    }

    public function getAssignedBy(): User {
        return $this->assignedBy;
    }

    public function setAssignedBy(User $assignedBy): self {
        $this->assignedBy = $assignedBy;

        return $this;
    }
}
