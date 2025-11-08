<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

class AssignUserToWorkOrderCommand {
    public function __construct(
        public readonly int $workOrderId,
        public readonly int $userId,
        public readonly int $assignedBy,
    ) {}
}
