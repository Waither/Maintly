<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use App\Application\Command\WorkOrder\CreateWorkOrderCommand;
use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class CreateWorkOrderHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(CreateWorkOrderCommand $command): WorkOrder {
        $status = $this->entityManager->getReference(WorkOrderStatus::class, $command->statusId);
        $priority = $this->entityManager->getReference(WorkOrderPriority::class, $command->priorityId);
        $equipment = $this->entityManager->getReference(Equipment::class, $command->equipmentId);
        $createdBy = $this->entityManager->getReference(User::class, $command->createdBy);

        $workOrder = new WorkOrder();
        $workOrder->setTitle($command->title);
        $workOrder->setDescription($command->description);
        $workOrder->setStatus($status);
        $workOrder->setPriority($priority);
        $workOrder->setEquipment($equipment);
        $workOrder->setCreatedBy($createdBy);

        if ($command->plannedStartDate) {
            $workOrder->setPlannedStartDate($command->plannedStartDate);
        }

        if ($command->plannedEndDate) {
            $workOrder->setPlannedEndDate($command->plannedEndDate);
        }

        $this->entityManager->persist($workOrder);
        $this->entityManager->flush();

        return $workOrder;
    }
}
