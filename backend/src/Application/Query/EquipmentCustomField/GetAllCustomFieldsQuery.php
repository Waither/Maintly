<?php

namespace App\Application\Query\EquipmentCustomField;

/**
 * Query to get all custom fields.
 */
final readonly class GetAllCustomFieldsQuery {
    public function __construct(
        public bool $onlyActive = true,
    ) {}
}
