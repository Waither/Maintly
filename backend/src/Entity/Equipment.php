<?php

namespace App\Entity;

use App\Repository\EquipmentRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EquipmentRepository::class)]
#[ORM\Table(name: 'equipment')]
#[ORM\HasLifecycleCallbacks]
class Equipment {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: 'integer')]
    private ?int $costCenter = null;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    #[ORM\JoinColumn(name: 'parent_equipment_id', referencedColumnName: 'id', onDelete: 'SET NULL')]
    private ?self $parentEquipment = null;

    /**
     * @var Collection<int, Equipment>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'parentEquipment')]
    private Collection $children;

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $directWorkTime = 0;

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $totalWorkTime = 0;

    #[ORM\Column(length: 255, unique: true, nullable: true)]
    private ?string $qrCodeData = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'created_by', referencedColumnName: 'id', nullable: false)]
    private ?User $createdBy = null;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'updated_by', referencedColumnName: 'id', nullable: true)]
    private ?User $updatedBy = null;

    #[ORM\Column(nullable: true)]
    private ?DateTimeImmutable $deletedAt = null;

    /**
     * @var Collection<int, EquipmentTag>
     */
    #[ORM\OneToMany(targetEntity: EquipmentTag::class, mappedBy: 'equipment', cascade: ['persist', 'remove'])]
    private Collection $equipmentTags;

    /**
     * @var Collection<int, EquipmentFile>
     */
    #[ORM\OneToMany(targetEntity: EquipmentFile::class, mappedBy: 'equipment', cascade: ['persist', 'remove'])]
    private Collection $files;

    /**
     * @var Collection<int, EquipmentCustomValue>
     */
    #[ORM\OneToMany(targetEntity: EquipmentCustomValue::class, mappedBy: 'equipment', cascade: ['persist', 'remove'])]
    private Collection $customValues;

    public function __construct() {
        $this->createdAt = new DateTimeImmutable();
        $this->children = new ArrayCollection();
        $this->equipmentTags = new ArrayCollection();
        $this->files = new ArrayCollection();
        $this->customValues = new ArrayCollection();
    }

    #[ORM\PostPersist]
    public function generateQrCode(): void {
        if ($this->qrCodeData === null && $this->id !== null) {
            $this->qrCodeData = sprintf('EQ-%06d', $this->id);
        }
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): self {
        $this->name = $name;

        return $this;
    }

    public function getCostCenter(): ?int {
        return $this->costCenter;
    }

    public function setCostCenter(int $costCenter): self {
        $this->costCenter = $costCenter;

        return $this;
    }

    public function getParentEquipment(): ?self {
        return $this->parentEquipment;
    }

    public function setParentEquipment(?self $parentEquipment): self {
        $this->parentEquipment = $parentEquipment;

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getChildren(): Collection {
        return $this->children;
    }

    public function addChild(self $child): self {
        if (!$this->children->contains($child)) {
            $this->children->add($child);
            $child->setParentEquipment($this);
        }

        return $this;
    }

    public function removeChild(self $child): self {
        if ($this->children->removeElement($child)) {
            if ($child->getParentEquipment() === $this) {
                $child->setParentEquipment(null);
            }
        }

        return $this;
    }

    public function getDirectWorkTime(): int {
        return $this->directWorkTime;
    }

    public function setDirectWorkTime(int $directWorkTime): self {
        $this->directWorkTime = $directWorkTime;

        return $this;
    }

    public function getTotalWorkTime(): int {
        return $this->totalWorkTime;
    }

    public function setTotalWorkTime(int $totalWorkTime): self {
        $this->totalWorkTime = $totalWorkTime;

        return $this;
    }

    public function getQrCodeData(): ?string {
        return $this->qrCodeData;
    }

    public function setQrCodeData(?string $qrCodeData): self {
        $this->qrCodeData = $qrCodeData;

        return $this;
    }

    public function getCreatedBy(): ?User {
        return $this->createdBy;
    }

    public function setCreatedBy(?User $createdBy): self {
        $this->createdBy = $createdBy;

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

    public function getUpdatedBy(): ?User {
        return $this->updatedBy;
    }

    public function setUpdatedBy(?User $updatedBy): self {
        $this->updatedBy = $updatedBy;

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
     * @return Collection<int, EquipmentTag>
     */
    public function getEquipmentTags(): Collection {
        return $this->equipmentTags;
    }

    public function addEquipmentTag(EquipmentTag $equipmentTag): self {
        if (!$this->equipmentTags->contains($equipmentTag)) {
            $this->equipmentTags->add($equipmentTag);
            $equipmentTag->setEquipment($this);
        }

        return $this;
    }

    public function removeEquipmentTag(EquipmentTag $equipmentTag): self {
        if ($this->equipmentTags->removeElement($equipmentTag)) {
            if ($equipmentTag->getEquipment() === $this) {
                $equipmentTag->setEquipment(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, EquipmentFile>
     */
    public function getFiles(): Collection {
        return $this->files;
    }

    public function addFile(EquipmentFile $file): self {
        if (!$this->files->contains($file)) {
            $this->files->add($file);
            $file->setEquipment($this);
        }

        return $this;
    }

    public function removeFile(EquipmentFile $file): self {
        if ($this->files->removeElement($file)) {
            if ($file->getEquipment() === $this) {
                $file->setEquipment(null);
            }
        }

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
            $customValue->setEquipment($this);
        }

        return $this;
    }

    public function removeCustomValue(EquipmentCustomValue $customValue): self {
        if ($this->customValues->removeElement($customValue)) {
            if ($customValue->getEquipment() === $this) {
                $customValue->setEquipment(null);
            }
        }

        return $this;
    }
}
