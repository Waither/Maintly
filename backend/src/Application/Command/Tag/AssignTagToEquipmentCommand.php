<?php

namespace App\Application\Command\Tag;

/**
 * Command to assign tag to equipment.
 */
final readonly class AssignTagToEquipmentCommand {
    public function __construct(
        public int $equipmentId,
        public int $tagId,
        public int $assignedBy,
    ) {}
}
