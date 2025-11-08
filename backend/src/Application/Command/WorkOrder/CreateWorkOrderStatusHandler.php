<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use App\Application\Command\WorkOrder\CreateWorkOrderStatusCommand;
use App\Entity\WorkOrderStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class CreateWorkOrderStatusHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(CreateWorkOrderStatusCommand $command): WorkOrderStatus {
        $status = new WorkOrderStatus();
        $status->setName($command->name);
        $status->setColor($command->color);
        $status->setDisplayOrder($command->displayOrder);
        $status->setIsFinal($command->isFinal);

        $this->entityManager->persist($status);
        $this->entityManager->flush();

        return $status;
    }
}
