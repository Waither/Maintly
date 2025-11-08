<?php

namespace App\Application\Command\TagGroup;

/**
 * Command to update an existing tag group.
 */
final readonly class UpdateTagGroupCommand {
    public function __construct(
        public int $id,
        public ?string $name = null,
        public ?bool $isRequired = null,
        public ?bool $isSingleChoice = null,
        public ?int $displayOrder = null,
    ) {}
}
