<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use App\Entity\WorkOrderPriority;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class UpdateWorkOrderPriorityHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(UpdateWorkOrderPriorityCommand $command): WorkOrderPriority {
        $priority = $this->entityManager->getRepository(WorkOrderPriority::class)->find($command->id);

        if (!$priority) {
            throw new NotFoundHttpException('Work order priority not found');
        }

        if ($command->name !== null) {
            $priority->setName($command->name);
        }

        if ($command->color !== null) {
            $priority->setColor($command->color);
        }

        if ($command->displayOrder !== null) {
            $priority->setDisplayOrder($command->displayOrder);
        }

        $this->entityManager->flush();

        return $priority;
    }
}
