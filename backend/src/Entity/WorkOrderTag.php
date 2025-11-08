<?php

namespace App\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Ignore;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity]
#[ORM\Table(name: 'work_order_tags')]
#[ORM\UniqueConstraint(name: 'unique_work_order_tag', columns: ['work_order_id', 'tag_id'])]
class WorkOrderTag {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'datetime')]
    private DateTime $assignedAt;

    #[ORM\ManyToOne(targetEntity: WorkOrder::class, inversedBy: 'workOrderTags')]
    #[ORM\JoinColumn(name: 'work_order_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Ignore]
    private WorkOrder $workOrder;

    #[ORM\ManyToOne(targetEntity: Tag::class)]
    #[ORM\JoinColumn(name: 'tag_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[MaxDepth(1)]
    private Tag $tag;

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

    public function getTag(): Tag {
        return $this->tag;
    }

    public function setTag(Tag $tag): self {
        $this->tag = $tag;

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
