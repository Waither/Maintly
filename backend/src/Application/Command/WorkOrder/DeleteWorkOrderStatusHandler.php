<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use App\Entity\WorkOrderStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class DeleteWorkOrderStatusHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(DeleteWorkOrderStatusCommand $command): void {
        $status = $this->entityManager->getRepository(WorkOrderStatus::class)->find($command->id);

        if (!$status) {
            throw new NotFoundHttpException('Work order status not found');
        }

        $this->entityManager->remove($status);
        $this->entityManager->flush();
    }
}
