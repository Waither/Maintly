<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use App\Entity\Equipment;
use App\Entity\Tag;
use App\Entity\User;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderAssignment;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use App\Entity\WorkOrderTag;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\WorkOrderStatusTransitionService;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class UpdateWorkOrderHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
        private WorkOrderStatusTransitionService $transitionService,
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
            $this->transitionService->validateTransition($workOrder, $command->statusId);
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
            $plannedStart = $command->plannedStartDate instanceof DateTime
                ? $command->plannedStartDate
                : DateTime::createFromInterface($command->plannedStartDate);
            $workOrder->setPlannedStartDate($plannedStart);
        }

        if ($command->plannedEndDate !== null) {
            $plannedEnd = $command->plannedEndDate instanceof DateTime
                ? $command->plannedEndDate
                : DateTime::createFromInterface($command->plannedEndDate);
            $workOrder->setPlannedEndDate($plannedEnd);
        }

        if ($command->actualStartDate !== null) {
            $actualStart = $command->actualStartDate instanceof DateTime
                ? $command->actualStartDate
                : DateTime::createFromInterface($command->actualStartDate);
            $workOrder->setActualStartDate($actualStart);
        }

        if ($command->actualEndDate !== null) {
            $actualEnd = $command->actualEndDate instanceof DateTime
                ? $command->actualEndDate
                : DateTime::createFromInterface($command->actualEndDate);
            $workOrder->setActualEndDate($actualEnd);
        }

        $updatedBy = $this->entityManager->getReference(User::class, $command->updatedBy);
        $workOrder->setUpdatedBy($updatedBy);

        // Handle assigned users
        if ($command->assignedUserIds !== null) {
            // Remove existing assignments first
            foreach ($workOrder->getAssignments() as $assignment) {
                $this->entityManager->remove($assignment);
            }
            // Flush to actually delete before adding new ones (unique constraint)
            $this->entityManager->flush();

            // Add new assignments
            foreach ($command->assignedUserIds as $userId) {
                $user = $this->entityManager->getReference(User::class, $userId);
                $assignment = new WorkOrderAssignment();
                $assignment->setWorkOrder($workOrder);
                $assignment->setUser($user);
                $assignment->setAssignedBy($updatedBy);
                $this->entityManager->persist($assignment);
            }
        }

        // Handle tags
        if ($command->tagIds !== null) {
            // Remove existing tags first
            foreach ($workOrder->getWorkOrderTags() as $workOrderTag) {
                $this->entityManager->remove($workOrderTag);
            }
            // Flush to actually delete before adding new ones (unique constraint)
            $this->entityManager->flush();

            // Add new tags
            foreach ($command->tagIds as $tagId) {
                $tag = $this->entityManager->getReference(Tag::class, $tagId);
                $workOrderTag = new WorkOrderTag();
                $workOrderTag->setWorkOrder($workOrder);
                $workOrderTag->setTag($tag);
                $workOrderTag->setAssignedBy($updatedBy);
                $this->entityManager->persist($workOrderTag);
            }
        }

        $this->entityManager->flush();

        return $workOrder;
    }
}
