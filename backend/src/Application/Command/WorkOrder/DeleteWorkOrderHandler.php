<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use App\Application\Command\WorkOrder\DeleteWorkOrderCommand;
use App\Entity\WorkOrder;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class DeleteWorkOrderHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(DeleteWorkOrderCommand $command): void {
        $workOrder = $this->entityManager->getRepository(WorkOrder::class)->find($command->id);

        if (!$workOrder) {
            throw new NotFoundHttpException('Work order not found');
        }

        // Soft delete
        $workOrder->setDeletedAt(new DateTime());
        $this->entityManager->flush();
    }
}
