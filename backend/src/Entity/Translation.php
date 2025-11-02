<?php

namespace App\Entity;

use App\Repository\TranslationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TranslationRepository::class)]
#[ORM\Table(name: 'translations')]
#[ORM\UniqueConstraint(name: 'unique_key_locale', columns: ['message_key', 'locale'])]
class Translation {
    /**
     * @var int|null Database assigns int after persist, null before
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    private string $messageKey;

    #[ORM\Column(type: 'string', length: 5)]
    private string $locale;

    #[ORM\Column(type: 'text')]
    private string $text;

    public function getId(): ?int {
        return $this->id;
    }

    public function getMessageKey(): string {
        return $this->messageKey;
    }

    public function setMessageKey(string $messageKey): self {
        $this->messageKey = $messageKey;

        return $this;
    }

    public function getLocale(): string {
        return $this->locale;
    }

    public function setLocale(string $locale): self {
        $this->locale = $locale;

        return $this;
    }

    public function getText(): string {
        return $this->text;
    }

    public function setText(string $text): self {
        $this->text = $text;

        return $this;
    }
}
