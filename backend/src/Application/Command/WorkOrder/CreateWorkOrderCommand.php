<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use DateTimeInterface;

class CreateWorkOrderCommand {
    public function __construct(
        public readonly string $title,
        public readonly string $description,
        public readonly int $statusId,
        public readonly int $priorityId,
        public readonly int $equipmentId,
        public readonly int $createdBy,
        public readonly ?DateTimeInterface $plannedStartDate = null,
        public readonly ?DateTimeInterface $plannedEndDate = null,
    ) {}
}
