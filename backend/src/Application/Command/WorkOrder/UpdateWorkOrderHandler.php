<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use App\Application\Command\WorkOrder\UpdateWorkOrderCommand;
use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class UpdateWorkOrderHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(UpdateWorkOrderCommand $command): WorkOrder {
        $workOrder = $this->entityManager->getRepository(WorkOrder::class)->find($command->id);

        if (!$workOrder) {
            throw new NotFoundHttpException('Work order not found');
        }

        if ($command->title !== null) {
            $workOrder->setTitle($command->title);
        }

        if ($command->description !== null) {
            $workOrder->setDescription($command->description);
        }

        if ($command->statusId !== null) {
            $status = $this->entityManager->getReference(WorkOrderStatus::class, $command->statusId);
            $workOrder->setStatus($status);
        }

        if ($command->priorityId !== null) {
            $priority = $this->entityManager->getReference(WorkOrderPriority::class, $command->priorityId);
            $workOrder->setPriority($priority);
        }

        if ($command->equipmentId !== null) {
            $equipment = $this->entityManager->getReference(Equipment::class, $command->equipmentId);
            $workOrder->setEquipment($equipment);
        }

        if ($command->plannedStartDate !== null) {
            $workOrder->setPlannedStartDate($command->plannedStartDate);
        }

        if ($command->plannedEndDate !== null) {
            $workOrder->setPlannedEndDate($command->plannedEndDate);
        }

        if ($command->actualStartDate !== null) {
            $workOrder->setActualStartDate($command->actualStartDate);
        }

        if ($command->actualEndDate !== null) {
            $workOrder->setActualEndDate($command->actualEndDate);
        }

        $updatedBy = $this->entityManager->getReference(User::class, $command->updatedBy);
        $workOrder->setUpdatedBy($updatedBy);

        $this->entityManager->flush();

        return $workOrder;
    }
}
