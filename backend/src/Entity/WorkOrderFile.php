<?php

namespace App\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'work_order_files')]
class WorkOrderFile {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    private string $fileName;

    #[ORM\Column(type: 'string', length: 50)]
    private string $fileType;

    #[ORM\Column(type: 'bigint', nullable: true)]
    private ?int $fileSize = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: 'datetime')]
    private DateTime $uploadedAt;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTime $deletedAt = null;

    #[ORM\ManyToOne(targetEntity: WorkOrder::class, inversedBy: 'files')]
    #[ORM\JoinColumn(name: 'work_order_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private WorkOrder $workOrder;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'uploaded_by', referencedColumnName: 'id', nullable: false)]
    private User $uploadedBy;

    public function __construct() {
        $this->uploadedAt = new DateTime();
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getFileName(): string {
        return $this->fileName;
    }

    public function setFileName(string $fileName): self {
        $this->fileName = $fileName;

        return $this;
    }

    public function getFileType(): string {
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

    public function getUploadedAt(): DateTime {
        return $this->uploadedAt;
    }

    public function getDeletedAt(): ?DateTime {
        return $this->deletedAt;
    }

    public function setDeletedAt(?DateTime $deletedAt): self {
        $this->deletedAt = $deletedAt;

        return $this;
    }

    public function getWorkOrder(): WorkOrder {
        return $this->workOrder;
    }

    public function setWorkOrder(WorkOrder $workOrder): self {
        $this->workOrder = $workOrder;

        return $this;
    }

    public function getUploadedBy(): User {
        return $this->uploadedBy;
    }

    public function setUploadedBy(User $uploadedBy): self {
        $this->uploadedBy = $uploadedBy;

        return $this;
    }
}
