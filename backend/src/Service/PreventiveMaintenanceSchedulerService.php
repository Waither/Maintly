<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\PreventiveMaintenancePlan;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderStatus;
use App\Repository\PreventiveMaintenancePlanRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;

class PreventiveMaintenanceSchedulerService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private PreventiveMaintenancePlanRepository $planRepository,
    ) {
    }

    /**
     * @return array{generated:int, plans: array<int, array{id:int, title:string, workOrderId:int, nextDueAt:?string}>}
     */
    public function generateDueWorkOrders(): array
    {
        $now = new DateTime();
        $generatedPlans = [];

        foreach ($this->planRepository->findDuePlans($now) as $plan) {
            $workOrder = $this->generateWorkOrderFromPlan($plan, $now);

            $generatedPlans[] = [
                'id' => (int) $plan->getId(),
                'title' => $plan->getTitle(),
                'workOrderId' => (int) $workOrder->getId(),
                'nextDueAt' => $plan->getNextDueAt()?->format('c'),
            ];
        }

        return [
            'generated' => count($generatedPlans),
            'plans' => $generatedPlans,
        ];
    }

    public function generateWorkOrderFromPlan(PreventiveMaintenancePlan $plan, ?DateTime $scheduledFor = null): WorkOrder
    {
        $status = $this->entityManager->getRepository(WorkOrderStatus::class)->findOneBy(['name' => 'open']);

        if (!$status instanceof WorkOrderStatus) {
            throw new \RuntimeException('Open work order status not found.');
        }

        $workOrder = new WorkOrder();
        $workOrder->setTitle($plan->getTitle());
        $workOrder->setDescription(trim($plan->getDescription()) . "\n\n[PM] Preventive maintenance plan: #" . ($plan->getId() ?? 'new'));
        $workOrder->setStatus($status);
        $workOrder->setPriority($plan->getPriority());
        $workOrder->setEquipment($plan->getEquipment());
        $workOrder->setCreatedBy($plan->getCreatedBy());

        $startDate = $scheduledFor ?? $plan->getNextDueAt() ?? new DateTime();
        $endDate = (clone $startDate)->modify('+1 day');

        $workOrder->setPlannedStartDate($startDate);
        $workOrder->setPlannedEndDate($endDate);

        $this->entityManager->persist($workOrder);

        $plan->setLastGeneratedAt(new DateTime());
        $nextDueAt = new DateTime();
        $nextDueAt->modify('+' . max(1, $plan->getIntervalDays()) . ' days');
        $plan->setNextDueAt($nextDueAt);

        $this->entityManager->flush();

        return $workOrder;
    }
}