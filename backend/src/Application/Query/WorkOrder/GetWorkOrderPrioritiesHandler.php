<?php

declare(strict_types=1);

namespace App\Application\Query\WorkOrder;

use App\Application\Query\WorkOrder\GetWorkOrderPrioritiesQuery;
use App\Repository\WorkOrderPriorityRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetWorkOrderPrioritiesHandler {
    public function __construct(
        private WorkOrderPriorityRepository $priorityRepository,
    ) {}

    public function __invoke(GetWorkOrderPrioritiesQuery $query): array {
        return $this->priorityRepository->findAllOrdered();
    }
}
