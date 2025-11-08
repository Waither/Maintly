<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'equipment_files')]
class EquipmentFile {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Equipment::class, inversedBy: 'files')]
    #[ORM\JoinColumn(name: 'equipment_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Equipment $equipment = null;

    #[ORM\Column(length: 255)]
    private ?string $fileName = null;

    #[ORM\Column(length: 50)]
    private ?string $fileType = null;

    #[ORM\Column(type: 'bigint', nullable: true)]
    private ?int $fileSize = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private ?DateTimeImmutable $uploadedAt = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'uploaded_by', referencedColumnName: 'id', nullable: false)]
    private ?User $uploadedBy = null;

    #[ORM\Column(nullable: true)]
    private ?DateTimeImmutable $deletedAt = null;

    public function __construct() {
        $this->uploadedAt = new DateTimeImmutable();
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

    public function getFileName(): ?string {
        return $this->fileName;
    }

    public function setFileName(string $fileName): self {
        $this->fileName = $fileName;

        return $this;
    }

    public function getFileType(): ?string {
        return $this->fileType;
    }

    public function setFileType(string $fileType): self {
        $this->fileType = $fileType;

        return $this;
    }

    public function getFileSize(): ?int {
        return $this->fileSize;
    }

    public function setFileSize(?int $fileSize): self {
        $this->fileSize = $fileSize;

        return $this;
    }

    public function getDescription(): ?string {
        return $this->description;
    }

    public function setDescription(?string $description): self {
        $this->description = $description;

        return $this;
    }

    public function getUploadedAt(): ?DateTimeImmutable {
        return $this->uploadedAt;
    }

    public function setUploadedAt(DateTimeImmutable $uploadedAt): self {
        $this->uploadedAt = $uploadedAt;

        return $this;
    }

    public function getUploadedBy(): ?User {
        return $this->uploadedBy;
    }

    public function setUploadedBy(?User $uploadedBy): self {
        $this->uploadedBy = $uploadedBy;

        return $this;
    }

    public function getDeletedAt(): ?DateTimeImmutable {
        return $this->deletedAt;
    }

    public function setDeletedAt(?DateTimeImmutable $deletedAt): self {
        $this->deletedAt = $deletedAt;

        return $this;
    }
}
