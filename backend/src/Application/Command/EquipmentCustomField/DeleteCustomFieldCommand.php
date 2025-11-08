<?php

namespace App\Application\Command\EquipmentCustomField;

/**
 * Command to delete (soft delete) a custom field.
 */
final readonly class DeleteCustomFieldCommand {
    public function __construct(
        public int $id,
    ) {}
}
