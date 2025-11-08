<?php

declare(strict_types=1);

namespace App\Application\Query\WorkOrder;

class GetWorkOrderByIdQuery {
    public function __construct(
        public readonly int $id,
    ) {}
}
