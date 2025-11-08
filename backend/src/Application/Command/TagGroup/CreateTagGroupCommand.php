<?php

namespace App\Application\Command\TagGroup;

/**
 * Command to create a new tag group.
 */
final readonly class CreateTagGroupCommand {
    public function __construct(
        public string $name,
        public bool $isRequired = false,
        public bool $isSingleChoice = false,
        public int $displayOrder = 0,
    ) {}
}
