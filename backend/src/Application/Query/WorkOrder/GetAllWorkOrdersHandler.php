<?php

declare(strict_types=1);

namespace App\Application\Query\WorkOrder;

use App\Repository\WorkOrderRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetAllWorkOrdersHandler {
    public function __construct(
        private WorkOrderRepository $workOrderRepository,
    ) {}

    /**
     * @return array<int, \App\Entity\WorkOrder>
     */
    public function __invoke(GetAllWorkOrdersQuery $query): array {
        return $this->workOrderRepository->findWithFilters(
            userId: $query->filterByUserId,
            statusName: $query->statusName,
            priorityName: $query->priorityName,
        );
    }
}
