<?php

declare(strict_types=1);

namespace App\Application\Query\WorkOrder;

use App\Entity\WorkOrder;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetWorkOrderByIdHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(GetWorkOrderByIdQuery $query): WorkOrder {
        $workOrder = $this->entityManager->getRepository(WorkOrder::class)->find($query->id);

        if (!$workOrder) {
            throw new NotFoundHttpException('Work order not found');
        }

        return $workOrder;
    }
}
