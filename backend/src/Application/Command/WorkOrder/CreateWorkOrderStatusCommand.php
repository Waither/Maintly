<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

class CreateWorkOrderStatusCommand {
    public function __construct(
        public readonly string $name,
        public readonly ?string $color = null,
        public readonly int $displayOrder = 0,
        public readonly bool $isFinal = false,
    ) {}
}
