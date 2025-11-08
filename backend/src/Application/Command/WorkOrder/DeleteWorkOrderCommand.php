<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

class DeleteWorkOrderCommand {
    public function __construct(
        public readonly int $id,
    ) {}
}
