<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use DateTimeInterface;

class AddWorkOrderActivityCommand {
    public function __construct(
        public readonly int $workOrderId,
        public readonly string $description,
        public readonly int $performedBy,
        public readonly int $createdBy,
        public readonly ?int $timeSpent = null,
        public readonly ?DateTimeInterface $completedAt = null,
    ) {}
}
