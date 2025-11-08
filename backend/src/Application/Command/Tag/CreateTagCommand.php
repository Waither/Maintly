<?php

namespace App\Application\Command\Tag;

/**
 * Command to create a new tag.
 */
final readonly class CreateTagCommand {
    public function __construct(
        public string $name,
        public ?string $color = null,
        public ?int $tagGroupId = null,
    ) {}
}
