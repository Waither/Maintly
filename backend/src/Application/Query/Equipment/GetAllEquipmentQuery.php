<?php

namespace App\Application\Query\Equipment;

/**
 * Query to get all equipment.
 */
final readonly class GetAllEquipmentQuery {
    public function __construct(
        public bool $includeDeleted = false,
    ) {}
}
