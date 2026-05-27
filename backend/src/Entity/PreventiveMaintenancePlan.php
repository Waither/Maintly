<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\PreventiveMaintenancePlanRepository;
use DateTime;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PreventiveMaintenancePlanRepository::class)]
#[ORM\Table(name: 'preventive_maintenance_plans')]
#[ORM\HasLifecycleCallbacks]
class PreventiveMaintenancePlan
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    private string $title;

    #[ORM\Column(type: 'text')]
    private string $description = '';

    #[ORM\Column(type: 'integer')]
    private int $intervalDays = 30;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private bool $isActive = true;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTime $nextDueAt = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTime $lastGeneratedAt = null;

    #[ORM\Column(type: 'datetime')]
    private DateTime $createdAt;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTime $updatedAt = null;

    #[ORM\ManyToOne(targetEntity: Equipment::class)]
    #[ORM\JoinColumn(name: 'equipment_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private Equipment $equipment;

    #[ORM\ManyToOne(targetEntity: WorkOrderPriority::class)]
    #[ORM\JoinColumn(name: 'priority_id', referencedColumnName: 'id', nullable: false)]
    private WorkOrderPriority $priority;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'created_by', referencedColumnName: 'id', nullable: false)]
    private User $createdBy;

    public function __construct()
    {
        $this->createdAt = new DateTime();
    }

    #[ORM\PreUpdate]
    public function touch(): void
    {
        $this->updatedAt = new DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getIntervalDays(): int
    {
        return $this->intervalDays;
    }

    public function setIntervalDays(int $intervalDays): self
    {
        $this->intervalDays = $intervalDays;

        return $this;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;

        return $this;
    }

    public function getNextDueAt(): ?DateTime
    {
        return $this->nextDueAt;
    }

    public function setNextDueAt(?DateTime $nextDueAt): self
    {
        $this->nextDueAt = $nextDueAt;

        return $this;
    }

    public function getLastGeneratedAt(): ?DateTime
    {
        return $this->lastGeneratedAt;
    }

    public function setLastGeneratedAt(?DateTime $lastGeneratedAt): self
    {
        $this->lastGeneratedAt = $lastGeneratedAt;

        return $this;
    }

    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?DateTime
    {
        return $this->updatedAt;
    }

    public function getEquipment(): Equipment
    {
        return $this->equipment;
    }

    public function setEquipment(Equipment $equipment): self
    {
        $this->equipment = $equipment;

        return $this;
    }

    public function getPriority(): WorkOrderPriority
    {
        return $this->priority;
    }

    public function setPriority(WorkOrderPriority $priority): self
    {
        $this->priority = $priority;

        return $this;
    }

    public function getCreatedBy(): User
    {
        return $this->createdBy;
    }

    public function setCreatedBy(User $createdBy): self
    {
        $this->createdBy = $createdBy;

        return $this;
    }
}