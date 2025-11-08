<?php

namespace App\Entity;

use App\Repository\TagRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TagRepository::class)]
#[ORM\Table(name: 'tags')]
class Tag {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100, unique: true)]
    private ?string $name = null;

    #[ORM\Column(length: 7, nullable: true)]
    private ?string $color = null;

    #[ORM\ManyToOne(targetEntity: TagGroup::class, inversedBy: 'tags')]
    #[ORM\JoinColumn(name: 'tag_group_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?TagGroup $tagGroup = null;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;

    /**
     * @var Collection<int, EquipmentTag>
     */
    #[ORM\OneToMany(targetEntity: EquipmentTag::class, mappedBy: 'tag', cascade: ['persist', 'remove'])]
    private Collection $equipmentTags;

    public function __construct() {
        $this->createdAt = new DateTimeImmutable();
        $this->equipmentTags = new ArrayCollection();
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

    public function getColor(): ?string {
        return $this->color;
    }

    public function setColor(?string $color): self {
        $this->color = $color;

        return $this;
    }

    public function getTagGroup(): ?TagGroup {
        return $this->tagGroup;
    }

    public function setTagGroup(?TagGroup $tagGroup): self {
        $this->tagGroup = $tagGroup;

        return $this;
    }

    public function getCreatedAt(): ?DateTimeImmutable {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): self {
        $this->createdAt = $createdAt;

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
            $equipmentTag->setTag($this);
        }

        return $this;
    }

    public function removeEquipmentTag(EquipmentTag $equipmentTag): self {
        if ($this->equipmentTags->removeElement($equipmentTag)) {
            if ($equipmentTag->getTag() === $this) {
                $equipmentTag->setTag(null);
            }
        }

        return $this;
    }
}
