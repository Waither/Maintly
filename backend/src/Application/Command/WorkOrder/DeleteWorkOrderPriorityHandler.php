<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use App\Entity\WorkOrderPriority;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class DeleteWorkOrderPriorityHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(DeleteWorkOrderPriorityCommand $command): void {
        $priority = $this->entityManager->getRepository(WorkOrderPriority::class)->find($command->id);

        if (!$priority) {
            throw new NotFoundHttpException('Work order priority not found');
        }

        $this->entityManager->remove($priority);
        $this->entityManager->flush();
    }
}
