<?php

namespace App\Application\Command\Tag;

/**
 * Command to remove tag from equipment.
 */
final readonly class RemoveTagFromEquipmentCommand {
    public function __construct(
        public int $equipmentId,
        public int $tagId,
    ) {}
}
