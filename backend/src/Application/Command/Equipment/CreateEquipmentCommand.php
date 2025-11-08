<?php

namespace App\Application\Command\Equipment;

/**
 * Command to create a new equipment.
 */
final readonly class CreateEquipmentCommand {
    public function __construct(
        public string $name,
        public int $costCenter,
        public ?int $parentEquipmentId = null,
        public ?int $createdBy = null,
    ) {}
}
