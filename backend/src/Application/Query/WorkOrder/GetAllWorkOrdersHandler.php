<?php

declare(strict_types=1);

namespace App\Application\Query\WorkOrder;

use App\Application\Query\WorkOrder\GetAllWorkOrdersQuery;
use App\Repository\WorkOrderRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetAllWorkOrdersHandler {
    public function __construct(
        private WorkOrderRepository $workOrderRepository,
    ) {}

    public function __invoke(GetAllWorkOrdersQuery $query): array {
        if ($query->filterByUserId !== null) {
            // For provider role - return only work orders created by this user
            return $this->workOrderRepository->findByCreator($query->filterByUserId);
        }

        // For admin, manager, technician, reporter - return all active work orders
        return $this->workOrderRepository->findAllActive();
    }
}
