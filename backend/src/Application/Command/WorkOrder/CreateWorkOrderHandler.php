<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use DateTime;
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
            $plannedStart = $command->plannedStartDate instanceof DateTime
                ? $command->plannedStartDate
                : DateTime::createFromInterface($command->plannedStartDate);
            $workOrder->setPlannedStartDate($plannedStart);
        }

        if ($command->plannedEndDate) {
            $plannedEnd = $command->plannedEndDate instanceof DateTime
                ? $command->plannedEndDate
                : DateTime::createFromInterface($command->plannedEndDate);
            $workOrder->setPlannedEndDate($plannedEnd);
        }

        $this->entityManager->persist($workOrder);
        $this->entityManager->flush();

        // Add assigned users (after flush to have workOrder ID)
        foreach ($command->assignedUserIds as $userId) {
            $user = $this->entityManager->getReference(User::class, $userId);
            $assignment = new \App\Entity\WorkOrderAssignment();
            $assignment->setWorkOrder($workOrder);
            $assignment->setUser($user);
            $assignment->setAssignedBy($createdBy);
            $this->entityManager->persist($assignment);
        }

        // Add tags (after flush to have workOrder ID)
        foreach ($command->tagIds as $tagId) {
            $tag = $this->entityManager->getReference(\App\Entity\Tag::class, $tagId);
            $workOrderTag = new \App\Entity\WorkOrderTag();
            $workOrderTag->setWorkOrder($workOrder);
            $workOrderTag->setTag($tag);
            $workOrderTag->setAssignedBy($createdBy);
            $this->entityManager->persist($workOrderTag);
        }

        if (!empty($command->assignedUserIds) || !empty($command->tagIds)) {
            $this->entityManager->flush();
        }

        return $workOrder;
    }
}
