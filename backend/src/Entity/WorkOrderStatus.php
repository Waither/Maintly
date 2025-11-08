<?php

namespace App\Entity;

use App\Repository\WorkOrderStatusRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: WorkOrderStatusRepository::class)]
#[ORM\Table(name: 'work_order_statuses')]
class WorkOrderStatus {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 50, unique: true)]
    private string $name;

    #[ORM\Column(type: 'string', length: 7, nullable: true)]
    private ?string $color = null;

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $displayOrder = 0;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $isFinal = false;

    #[ORM\Column(type: 'datetime')]
    private DateTime $createdAt;

    /**
     * @var Collection<int, WorkOrder>
     */
    #[ORM\OneToMany(targetEntity: WorkOrder::class, mappedBy: 'status')]
    private Collection $workOrders;

    public function __construct() {
        $this->createdAt = new DateTime();
        $this->workOrders = new ArrayCollection();
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getName(): string {
        return $this->name;
    }

    public function setName(string $name): self {
        $this->name = $name;

        return $this;
    }

    public function getColor(): ?string {
        return $this->color;
    }

    public function setColor(?string $color): self {
        $this->color = $color;

        return $this;
    }

    public function getDisplayOrder(): int {
        return $this->displayOrder;
    }

    public function setDisplayOrder(int $displayOrder): self {
        $this->displayOrder = $displayOrder;

        return $this;
    }

    public function isFinal(): bool {
        return $this->isFinal;
    }

    public function setIsFinal(bool $isFinal): self {
        $this->isFinal = $isFinal;

        return $this;
    }

    public function getCreatedAt(): DateTime {
        return $this->createdAt;
    }

    /**
     * @return Collection<int, WorkOrder>
     */
    public function getWorkOrders(): Collection {
        return $this->workOrders;
    }
}
