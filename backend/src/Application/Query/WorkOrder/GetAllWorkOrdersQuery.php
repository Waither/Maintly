<?php

declare(strict_types=1);

namespace App\Application\Query\WorkOrder;

class GetAllWorkOrdersQuery {
    public function __construct(
        public readonly ?int $filterByUserId = null, // For provider role - filter by created_by
    ) {}
}
