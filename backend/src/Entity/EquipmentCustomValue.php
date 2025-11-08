<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Ignore;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity]
#[ORM\Table(name: 'equipment_custom_values')]
#[ORM\UniqueConstraint(name: 'unique_equipment_custom_field', columns: ['equipment_id', 'custom_field_id'])]
class EquipmentCustomValue {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Equipment::class, inversedBy: 'customValues')]
    #[ORM\JoinColumn(name: 'equipment_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Ignore]
    private ?Equipment $equipment = null;

    #[ORM\ManyToOne(targetEntity: EquipmentCustomField::class, inversedBy: 'customValues')]
    #[ORM\JoinColumn(name: 'custom_field_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[MaxDepth(1)]
    private ?EquipmentCustomField $customField = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $value = null;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?DateTimeImmutable $updatedAt = null;

    public function __construct() {
        $this->createdAt = new DateTimeImmutable();
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

    public function getCustomField(): ?EquipmentCustomField {
        return $this->customField;
    }

    public function setCustomField(?EquipmentCustomField $customField): self {
        $this->customField = $customField;

        return $this;
    }

    public function getValue(): ?string {
        return $this->value;
    }

    public function setValue(?string $value): self {
        $this->value = $value;

        return $this;
    }

    public function getCreatedAt(): ?DateTimeImmutable {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): self {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?DateTimeImmutable {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?DateTimeImmutable $updatedAt): self {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
