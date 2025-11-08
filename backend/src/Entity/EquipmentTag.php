<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Ignore;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity]
#[ORM\Table(name: 'equipment_tags')]
#[ORM\UniqueConstraint(name: 'unique_equipment_tag', columns: ['equipment_id', 'tag_id'])]
class EquipmentTag {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Equipment::class, inversedBy: 'equipmentTags')]
    #[ORM\JoinColumn(name: 'equipment_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Ignore]
    private ?Equipment $equipment = null;

    #[ORM\ManyToOne(targetEntity: Tag::class, inversedBy: 'equipmentTags')]
    #[ORM\JoinColumn(name: 'tag_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[MaxDepth(1)]
    private ?Tag $tag = null;

    #[ORM\Column]
    private ?DateTimeImmutable $assignedAt = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'assigned_by', referencedColumnName: 'id', nullable: false)]
    #[MaxDepth(1)]
    private ?User $assignedBy = null;

    public function __construct() {
        $this->assignedAt = new DateTimeImmutable();
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getEquipment(): ?Equipment {
        return $this->equipment;
    }

    public function setEquipment(?Equipment $equipment): self {
        $this->equipment = $equipment;

        return $this;
    }

    public function getTag(): ?Tag {
        return $this->tag;
    }

    public function setTag(?Tag $tag): self {
        $this->tag = $tag;

        return $this;
    }

    public function getAssignedAt(): ?DateTimeImmutable {
        return $this->assignedAt;
    }

    public function setAssignedAt(DateTimeImmutable $assignedAt): self {
        $this->assignedAt = $assignedAt;

        return $this;
    }

    public function getAssignedBy(): ?User {
        return $this->assignedBy;
    }

    public function setAssignedBy(?User $assignedBy): self {
        $this->assignedBy = $assignedBy;

        return $this;
    }
}
