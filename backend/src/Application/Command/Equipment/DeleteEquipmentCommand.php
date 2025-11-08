<?php

namespace App\Application\Command\Equipment;

/**
 * Command to delete (soft delete) an equipment.
 */
final readonly class DeleteEquipmentCommand {
    public function __construct(
        public int $id,
    ) {}
}
