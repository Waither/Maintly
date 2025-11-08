<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use App\Entity\WorkOrderPriority;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class CreateWorkOrderPriorityHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(CreateWorkOrderPriorityCommand $command): WorkOrderPriority {
        $priority = new WorkOrderPriority();
        $priority->setName($command->name);
        $priority->setColor($command->color);
        $priority->setDisplayOrder($command->displayOrder);

        $this->entityManager->persist($priority);
        $this->entityManager->flush();

        return $priority;
    }
}
