<?php

namespace App\Entity;

use App\Repository\EquipmentCustomFieldRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Ignore;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: EquipmentCustomFieldRepository::class)]
#[ORM\Table(name: 'equipment_custom_fields')]
class EquipmentCustomField {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100, unique: true)]
    private ?string $fieldName = null;

    #[ORM\Column(type: 'string', length: 20)]
    private ?string $fieldType = null;

    /**
     * @var array<int|string, mixed>|null
     */
    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $fieldOptions = null;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $isRequired = false;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $defaultValue = null;

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $displayOrder = 0;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private bool $isActive = true;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'created_by', referencedColumnName: 'id', nullable: false)]
    #[MaxDepth(1)]
    private ?User $createdBy = null;

    #[ORM\Column(nullable: true)]
    private ?DateTimeImmutable $deletedAt = null;

    /**
     * @var Collection<int, EquipmentCustomValue>
     */
    #[ORM\OneToMany(targetEntity: EquipmentCustomValue::class, mappedBy: 'customField', cascade: ['persist', 'remove'])]
    #[Ignore]
    private Collection $customValues;

    public function __construct() {
        $this->createdAt = new DateTimeImmutable();
        $this->customValues = new ArrayCollection();
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getFieldName(): ?string {
        return $this->fieldName;
    }

    public function setFieldName(string $fieldName): self {
        $this->fieldName = $fieldName;

        return $this;
    }

    public function getFieldType(): ?string {
        return $this->fieldType;
    }

    public function setFieldType(string $fieldType): self {
        $this->fieldType = $fieldType;

        return $this;
    }

    /**
     * @return array<int|string, mixed>|null
     */
    public function getFieldOptions(): ?array {
        return $this->fieldOptions;
    }

    /**
     * @param array<int|string, mixed>|null $fieldOptions
     */
    public function setFieldOptions(?array $fieldOptions): self {
        $this->fieldOptions = $fieldOptions;

        return $this;
    }

    public function isRequired(): bool {
        return $this->isRequired;
    }

    public function setIsRequired(bool $isRequired): self {
        $this->isRequired = $isRequired;

        return $this;
    }

    public function getDefaultValue(): ?string {
        return $this->defaultValue;
    }

    public function setDefaultValue(?string $defaultValue): self {
        $this->defaultValue = $defaultValue;

        return $this;
    }

    public function getDisplayOrder(): int {
        return $this->displayOrder;
    }

    public function setDisplayOrder(int $displayOrder): self {
        $this->displayOrder = $displayOrder;

        return $this;
    }

    public function isActive(): bool {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): self {
        $this->isActive = $isActive;

        return $this;
    }

    public function getCreatedAt(): ?DateTimeImmutable {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): self {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getCreatedBy(): ?User {
        return $this->createdBy;
    }

    public function setCreatedBy(?User $createdBy): self {
        $this->createdBy = $createdBy;

        return $this;
    }

    public function getDeletedAt(): ?DateTimeImmutable {
        return $this->deletedAt;
    }

    public function setDeletedAt(?DateTimeImmutable $deletedAt): self {
        $this->deletedAt = $deletedAt;

        return $this;
    }

    /**
     * @return Collection<int, EquipmentCustomValue>
     */
    public function getCustomValues(): Collection {
        return $this->customValues;
    }

    public function addCustomValue(EquipmentCustomValue $customValue): self {
        if (!$this->customValues->contains($customValue)) {
            $this->customValues->add($customValue);
            $customValue->setCustomField($this);
        }

        return $this;
    }

    public function removeCustomValue(EquipmentCustomValue $customValue): self {
        if ($this->customValues->removeElement($customValue)) {
            if ($customValue->getCustomField() === $this) {
                $customValue->setCustomField(null);
            }
        }

        return $this;
    }
}
