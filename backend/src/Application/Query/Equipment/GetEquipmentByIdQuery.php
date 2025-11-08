<?php

namespace App\Application\Query\Equipment;

/**
 * Query to get equipment by ID.
 */
final readonly class GetEquipmentByIdQuery {
    public function __construct(
        public int $id,
    ) {}
}
