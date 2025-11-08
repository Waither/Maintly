<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use App\Entity\WorkOrderStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class UpdateWorkOrderStatusHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(UpdateWorkOrderStatusCommand $command): WorkOrderStatus {
        $status = $this->entityManager->getRepository(WorkOrderStatus::class)->find($command->id);

        if (!$status) {
            throw new NotFoundHttpException('Work order status not found');
        }

        if ($command->name !== null) {
            $status->setName($command->name);
        }

        if ($command->color !== null) {
            $status->setColor($command->color);
        }

        if ($command->displayOrder !== null) {
            $status->setDisplayOrder($command->displayOrder);
        }

        if ($command->isFinal !== null) {
            $status->setIsFinal($command->isFinal);
        }

        $this->entityManager->flush();

        return $status;
    }
}
