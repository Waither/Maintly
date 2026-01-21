<?php

namespace App\Entity;

use App\Repository\WorkOrderRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Ignore;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: WorkOrderRepository::class)]
#[ORM\Table(name: 'work_orders')]
#[ORM\HasLifecycleCallbacks]
class WorkOrder {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 20, unique: true, nullable: true)]
    private ?string $uniqueCode = null;

    #[ORM\Column(type: 'string', length: 255)]
    private string $title;

    #[ORM\Column(type: 'text')]
    private string $description;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTime $plannedStartDate = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTime $plannedEndDate = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTime $actualStartDate = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTime $actualEndDate = null;

    #[ORM\Column(type: 'datetime')]
    private DateTime $createdAt;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTime $updatedAt = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTime $deletedAt = null;

    // Relations
    #[ORM\ManyToOne(targetEntity: WorkOrderStatus::class, inversedBy: 'workOrders')]
    #[ORM\JoinColumn(name: 'status_id', referencedColumnName: 'id', nullable: false)]
    private WorkOrderStatus $status;

    #[ORM\ManyToOne(targetEntity: WorkOrderPriority::class, inversedBy: 'workOrders')]
    #[ORM\JoinColumn(name: 'priority_id', referencedColumnName: 'id', nullable: false)]
    private WorkOrderPriority $priority;

    #[ORM\ManyToOne(targetEntity: Equipment::class)]
    #[ORM\JoinColumn(name: 'equipment_id', referencedColumnName: 'id', nullable: false)]
    #[MaxDepth(1)]
    private Equipment $equipment;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'created_by', referencedColumnName: 'id', nullable: false)]
    #[MaxDepth(1)]
    private User $createdBy;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'updated_by', referencedColumnName: 'id', nullable: true)]
    #[MaxDepth(1)]
    private ?User $updatedBy = null;

    /**
     * @var Collection<int, WorkOrderAssignment>
     */
    #[ORM\OneToMany(targetEntity: WorkOrderAssignment::class, mappedBy: 'workOrder', cascade: ['persist', 'remove'], fetch: 'EAGER')]
    #[Ignore]
    private Collection $assignments;

    /**
     * @var Collection<int, WorkOrderTag>
     */
    #[ORM\OneToMany(targetEntity: WorkOrderTag::class, mappedBy: 'workOrder', cascade: ['persist', 'remove'], fetch: 'EAGER')]
    #[Ignore]
    private Collection $workOrderTags;

    /**
     * @var Collection<int, WorkOrderActivity>
     */
    #[ORM\OneToMany(targetEntity: WorkOrderActivity::class, mappedBy: 'workOrder', cascade: ['persist', 'remove'])]
    #[Ignore]
    private Collection $activities;

    /**
     * @var Collection<int, WorkOrderFile>
     */
    #[ORM\OneToMany(targetEntity: WorkOrderFile::class, mappedBy: 'workOrder', cascade: ['persist', 'remove'])]
    #[Ignore]
    private Collection $files;

    public function __construct() {
        $this->createdAt = new DateTime();
        $this->assignments = new ArrayCollection();
        $this->workOrderTags = new ArrayCollection();
        $this->activities = new ArrayCollection();
        $this->files = new ArrayCollection();
    }

    /**
     * Auto-generate unique code after persist.
     */
    #[ORM\PostPersist]
    public function generateUniqueCode(): void {
        if ($this->uniqueCode === null) {
            $this->uniqueCode = 'WO-' . bin2hex(random_bytes(4));
        }
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getUniqueCode(): ?string {
        return $this->uniqueCode;
    }

    public function setUniqueCode(?string $uniqueCode): self {
        $this->uniqueCode = $uniqueCode;

        return $this;
    }

    public function getTitle(): string {
        return $this->title;
    }

    public function setTitle(string $title): self {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): string {
        return $this->description;
    }

    public function setDescription(string $description): self {
        $this->description = $description;

        return $this;
    }

    public function getPlannedStartDate(): ?DateTime {
        return $this->plannedStartDate;
    }

    public function setPlannedStartDate(?DateTime $plannedStartDate): self {
        $this->plannedStartDate = $plannedStartDate;

        return $this;
    }

    public function getPlannedEndDate(): ?DateTime {
        return $this->plannedEndDate;
    }

    public function setPlannedEndDate(?DateTime $plannedEndDate): self {
        $this->plannedEndDate = $plannedEndDate;

        return $this;
    }

    public function getActualStartDate(): ?DateTime {
        return $this->actualStartDate;
    }

    public function setActualStartDate(?DateTime $actualStartDate): self {
        $this->actualStartDate = $actualStartDate;

        return $this;
    }

    public function getActualEndDate(): ?DateTime {
        return $this->actualEndDate;
    }

    public function setActualEndDate(?DateTime $actualEndDate): self {
        $this->actualEndDate = $actualEndDate;

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

    public function getStatus(): WorkOrderStatus {
        return $this->status;
    }

    public function setStatus(WorkOrderStatus $status): self {
        $this->status = $status;

        return $this;
    }

    public function getPriority(): WorkOrderPriority {
        return $this->priority;
    }

    public function setPriority(WorkOrderPriority $priority): self {
        $this->priority = $priority;

        return $this;
    }

    public function getEquipment(): Equipment {
        return $this->equipment;
    }

    public function setEquipment(Equipment $equipment): self {
        $this->equipment = $equipment;

        return $this;
    }

    public function getCreatedBy(): User {
        return $this->createdBy;
    }

    public function setCreatedBy(User $createdBy): self {
        $this->createdBy = $createdBy;

        return $this;
    }

    public function getUpdatedBy(): ?User {
        return $this->updatedBy;
    }

    public function setUpdatedBy(?User $updatedBy): self {
        $this->updatedBy = $updatedBy;

        return $this;
    }

    /**
     * @return Collection<int, WorkOrderAssignment>
     */
    public function getAssignments(): Collection {
        return $this->assignments;
    }

    /**
     * Get assigned users for serialization (frontend expects this format)
     * @return array<int, array{userId: int, user: User, assignedAt: string}>
     */
    public function getAssignedUsers(): array {
        $result = [];
        foreach ($this->assignments as $assignment) {
            $result[] = [
                'userId' => $assignment->getUser()->getId(),
                'user' => $assignment->getUser(),
                'assignedAt' => $assignment->getAssignedAt()->format('Y-m-d H:i:s'),
            ];
        }
        return $result;
    }

    /**
     * @return Collection<int, WorkOrderTag>
     */
    public function getWorkOrderTags(): Collection {
        return $this->workOrderTags;
    }

    /**
     * Get tags for serialization (frontend expects this format)
     * @return array<int, array{tagId: int, tag: array, assignedAt: string}>
     */
    public function getTags(): array {
        $result = [];
        foreach ($this->workOrderTags as $workOrderTag) {
            $tag = $workOrderTag->getTag();
            $result[] = [
                'tagId' => $tag->getId(),
                'tag' => [
                    'id' => $tag->getId(),
                    'name' => $tag->getName(),
                    'color' => $tag->getColor(),
                ],
                'assignedAt' => $workOrderTag->getAssignedAt()->format('Y-m-d H:i:s'),
            ];
        }
        return $result;
    }

    /**
     * @return Collection<int, WorkOrderActivity>
     */
    public function getActivities(): Collection {
        return $this->activities;
    }

    /**
     * @return Collection<int, WorkOrderFile>
     */
    public function getFiles(): Collection {
        return $this->files;
    }
}
