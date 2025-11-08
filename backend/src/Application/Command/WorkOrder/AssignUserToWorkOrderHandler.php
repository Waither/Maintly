<?php

declare(strict_types=1);

namespace App\Application\Command\WorkOrder;

use App\Entity\User;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderAssignment;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class AssignUserToWorkOrderHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(AssignUserToWorkOrderCommand $command): WorkOrderAssignment {
        $workOrder = $this->entityManager->getRepository(WorkOrder::class)->find($command->workOrderId);

        if (!$workOrder) {
            throw new NotFoundHttpException('Work order not found');
        }

        $user = $this->entityManager->getRepository(User::class)->find($command->userId);

        if (!$user) {
            throw new NotFoundHttpException('User not found');
        }

        // Check if user is already assigned
        $existingAssignment = $this->entityManager->getRepository(WorkOrderAssignment::class)
            ->findOneBy(['workOrder' => $workOrder, 'user' => $user]);

        if ($existingAssignment) {
            throw new BadRequestHttpException('User is already assigned to this work order');
        }

        $assignedBy = $this->entityManager->getReference(User::class, $command->assignedBy);

        $assignment = new WorkOrderAssignment();
        $assignment->setWorkOrder($workOrder);
        $assignment->setUser($user);
        $assignment->setAssignedBy($assignedBy);

        $this->entityManager->persist($assignment);
        $this->entityManager->flush();

        return $assignment;
    }
}
