<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use App\Application\Command\WorkOrder\AddWorkOrderActivityCommand;
use App\Entity\User;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderActivity;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class AddWorkOrderActivityHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(AddWorkOrderActivityCommand $command): WorkOrderActivity {
        $workOrder = $this->entityManager->getRepository(WorkOrder::class)->find($command->workOrderId);

        if (!$workOrder) {
            throw new NotFoundHttpException('Work order not found');
        }

        $performedBy = $this->entityManager->getReference(User::class, $command->performedBy);
        $createdBy = $this->entityManager->getReference(User::class, $command->createdBy);

        $activity = new WorkOrderActivity();
        $activity->setWorkOrder($workOrder);
        $activity->setDescription($command->description);
        $activity->setPerformedBy($performedBy);
        $activity->setCreatedBy($createdBy);

        if ($command->timeSpent !== null) {
            $activity->setTimeSpent($command->timeSpent);
        }

        if ($command->completedAt !== null) {
            $activity->setCompletedAt($command->completedAt);
        }

        $this->entityManager->persist($activity);
        $this->entityManager->flush();

        return $activity;
    }
}
