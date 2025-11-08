<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use DateTimeInterface;

class UpdateWorkOrderCommand {
    public function __construct(
        public readonly int $id,
        public readonly int $updatedBy,
        public readonly ?string $title = null,
        public readonly ?string $description = null,
        public readonly ?int $statusId = null,
        public readonly ?int $priorityId = null,
        public readonly ?int $equipmentId = null,
        public readonly ?DateTimeInterface $plannedStartDate = null,
        public readonly ?DateTimeInterface $plannedEndDate = null,
        public readonly ?DateTimeInterface $actualStartDate = null,
        public readonly ?DateTimeInterface $actualEndDate = null,
    ) {}
}
