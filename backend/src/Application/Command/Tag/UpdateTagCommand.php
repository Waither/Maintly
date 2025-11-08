<?php

namespace App\Application\Command\Tag;

/**
 * Command to update an existing tag.
 */
final readonly class UpdateTagCommand {
    public function __construct(
        public int $id,
        public ?string $name = null,
        public ?string $color = null,
        public ?int $tagGroupId = null,
    ) {}
}
