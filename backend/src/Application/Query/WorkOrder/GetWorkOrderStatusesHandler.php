<?php

declare(strict_types=1);

namespace App\Application\Query\WorkOrder;

use App\Repository\WorkOrderStatusRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetWorkOrderStatusesHandler {
    public function __construct(
        private WorkOrderStatusRepository $statusRepository,
    ) {}

    /**
     * @return array<int, \App\Entity\WorkOrderStatus>
     */
    public function __invoke(GetWorkOrderStatusesQuery $query): array {
        return $this->statusRepository->findAllOrdered();
    }
}
