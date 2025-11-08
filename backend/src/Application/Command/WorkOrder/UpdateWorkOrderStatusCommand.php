<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

class UpdateWorkOrderStatusCommand {
    public function __construct(
        public readonly int $id,
        public readonly ?string $name = null,
        public readonly ?string $color = null,
        public readonly ?int $displayOrder = null,
        public readonly ?bool $isFinal = null,
    ) {}
}
