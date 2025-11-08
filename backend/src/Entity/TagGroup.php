<?php

namespace App\Entity;

use App\Repository\TagGroupRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Ignore;

#[ORM\Entity(repositoryClass: TagGroupRepository::class)]
#[ORM\Table(name: 'tag_groups')]
class TagGroup {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100, unique: true)]
    private ?string $name = null;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $isRequired = false;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $isSingleChoice = false;

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $displayOrder = 0;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;

    /**
     * @var Collection<int, Tag>
     */
    #[ORM\OneToMany(targetEntity: Tag::class, mappedBy: 'tagGroup')]
    #[Ignore]
    private Collection $tags;

    public function __construct() {
        $this->createdAt = new DateTimeImmutable();
        $this->tags = new ArrayCollection();
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

    public function isRequired(): bool {
        return $this->isRequired;
    }

    public function setIsRequired(bool $isRequired): self {
        $this->isRequired = $isRequired;

        return $this;
    }

    public function isSingleChoice(): bool {
        return $this->isSingleChoice;
    }

    public function setIsSingleChoice(bool $isSingleChoice): self {
        $this->isSingleChoice = $isSingleChoice;

        return $this;
    }

    public function getDisplayOrder(): int {
        return $this->displayOrder;
    }

    public function setDisplayOrder(int $displayOrder): self {
        $this->displayOrder = $displayOrder;

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
     * @return Collection<int, Tag>
     */
    public function getTags(): Collection {
        return $this->tags;
    }

    public function addTag(Tag $tag): self {
        if (!$this->tags->contains($tag)) {
            $this->tags->add($tag);
            $tag->setTagGroup($this);
        }

        return $this;
    }

    public function removeTag(Tag $tag): self {
        if ($this->tags->removeElement($tag)) {
            if ($tag->getTagGroup() === $this) {
                $tag->setTagGroup(null);
            }
        }

        return $this;
    }
}
