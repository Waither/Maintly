<?php

namespace App\Application\Command\EquipmentCustomValue;

/**
 * Command to set custom field value for equipment.
 */
final readonly class SetCustomValueCommand {
    public function __construct(
        public int $equipmentId,
        public int $customFieldId,
        public ?string $value,
    ) {}
}
