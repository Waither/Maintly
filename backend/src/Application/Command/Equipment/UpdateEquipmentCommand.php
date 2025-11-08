<?php

namespace App\Application\Command\Equipment;

/**
 * Command to update an existing equipment.
 */
final readonly class UpdateEquipmentCommand {
    public function __construct(
        public int $id,
        public ?string $name = null,
        public ?int $costCenter = null,
        public ?int $parentEquipmentId = null,
        public ?int $updatedBy = null,
    ) {}
}
