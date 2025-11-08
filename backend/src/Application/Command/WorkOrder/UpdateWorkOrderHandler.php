<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

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
            $plannedStart = $command->plannedStartDate instanceof \DateTime 
                ? $command->plannedStartDate 
                : \DateTime::createFromInterface($command->plannedStartDate);
            $workOrder->setPlannedStartDate($plannedStart);
        }

        if ($command->plannedEndDate !== null) {
            $plannedEnd = $command->plannedEndDate instanceof \DateTime 
                ? $command->plannedEndDate 
                : \DateTime::createFromInterface($command->plannedEndDate);
            $workOrder->setPlannedEndDate($plannedEnd);
        }

        if ($command->actualStartDate !== null) {
            $actualStart = $command->actualStartDate instanceof \DateTime 
                ? $command->actualStartDate 
                : \DateTime::createFromInterface($command->actualStartDate);
            $workOrder->setActualStartDate($actualStart);
        }

        if ($command->actualEndDate !== null) {
            $actualEnd = $command->actualEndDate instanceof \DateTime 
                ? $command->actualEndDate 
                : \DateTime::createFromInterface($command->actualEndDate);
            $workOrder->setActualEndDate($actualEnd);
        }

        $updatedBy = $this->entityManager->getReference(User::class, $command->updatedBy);
        $workOrder->setUpdatedBy($updatedBy);

        $this->entityManager->flush();

        return $workOrder;
    }
}
