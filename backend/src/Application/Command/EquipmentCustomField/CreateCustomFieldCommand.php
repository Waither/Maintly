<?php

namespace App\Application\Command\EquipmentCustomField;

/**
 * Command to create a new custom field.
 */
final readonly class CreateCustomFieldCommand {
    /**
     * @param array<int|string, mixed>|null $fieldOptions
     */
    public function __construct(
        public string $fieldName,
        public string $fieldType,
        public ?array $fieldOptions = null,
        public bool $isRequired = false,
        public ?string $defaultValue = null,
        public int $displayOrder = 0,
        public ?int $createdBy = null,
    ) {}
}
