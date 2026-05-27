<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Equipment;
use App\Entity\PreventiveMaintenancePlan;
use App\Entity\User;
use App\Entity\WorkOrderPriority;
use App\Repository\PreventiveMaintenancePlanRepository;
use App\Service\PreventiveMaintenanceSchedulerService;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/preventive-plans', name: 'preventive_plans_')]
class PreventiveMaintenancePlanController extends AbstractController
{
    use ApiResponseTrait;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private PreventiveMaintenancePlanRepository $planRepository,
        private PreventiveMaintenanceSchedulerService $schedulerService,
    ) {
    }

    #[Route('', name: 'list', methods: ['GET'])]
    #[IsGranted('WORKORDER_VIEW')]
    public function list(): JsonResponse
    {
        $plans = $this->planRepository->findBy([], ['nextDueAt' => 'ASC', 'id' => 'DESC']);

        return $this->successResponse(array_map([$this, 'mapPlan'], $plans));
    }

    #[Route('/{id}', name: 'show', methods: ['GET'], requirements: ['id' => '\\d+'])]
    #[IsGranted('WORKORDER_VIEW')]
    public function show(int $id): JsonResponse
    {
        $plan = $this->planRepository->find($id);

        if (!$plan instanceof PreventiveMaintenancePlan) {
            return $this->errorResponse('Preventive maintenance plan not found', 404);
        }

        return $this->successResponse($this->mapPlan($plan));
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('WORKORDER_CREATE')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->errorResponse('Invalid JSON payload', 400);
        }

        foreach (['title', 'equipmentId', 'priorityId', 'intervalDays'] as $field) {
            if (!isset($data[$field])) {
                return $this->errorResponse('Missing required field: ' . $field, 400);
            }
        }

        /** @var User $user */
        $user = $this->getUser();

        $plan = new PreventiveMaintenancePlan();
        $plan->setTitle((string) $data['title']);
        $plan->setDescription((string) ($data['description'] ?? ''));
        $plan->setIntervalDays(max(1, (int) $data['intervalDays']));
        $plan->setIsActive((bool) ($data['isActive'] ?? true));
        $plan->setEquipment($this->entityManager->getReference(Equipment::class, (int) $data['equipmentId']));
        $plan->setPriority($this->entityManager->getReference(WorkOrderPriority::class, (int) $data['priorityId']));
        $plan->setCreatedBy($user);

        if (isset($data['nextDueAt'])) {
            $plan->setNextDueAt(new DateTime((string) $data['nextDueAt']));
        } else {
            $nextDueAt = new DateTime();
            $nextDueAt->modify('+' . $plan->getIntervalDays() . ' days');
            $plan->setNextDueAt($nextDueAt);
        }

        $this->entityManager->persist($plan);
        $this->entityManager->flush();

        return $this->successResponse($this->mapPlan($plan), 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'], requirements: ['id' => '\\d+'])]
    #[IsGranted('WORKORDER_EDIT')]
    public function update(int $id, Request $request): JsonResponse
    {
        $plan = $this->planRepository->find($id);

        if (!$plan instanceof PreventiveMaintenancePlan) {
            return $this->errorResponse('Preventive maintenance plan not found', 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->errorResponse('Invalid JSON payload', 400);
        }

        if (isset($data['title'])) {
            $plan->setTitle((string) $data['title']);
        }
        if (array_key_exists('description', $data)) {
            $plan->setDescription((string) $data['description']);
        }
        if (isset($data['intervalDays'])) {
            $plan->setIntervalDays(max(1, (int) $data['intervalDays']));
        }
        if (isset($data['isActive'])) {
            $plan->setIsActive((bool) $data['isActive']);
        }
        if (isset($data['equipmentId'])) {
            $plan->setEquipment($this->entityManager->getReference(Equipment::class, (int) $data['equipmentId']));
        }
        if (isset($data['priorityId'])) {
            $plan->setPriority($this->entityManager->getReference(WorkOrderPriority::class, (int) $data['priorityId']));
        }
        if (isset($data['nextDueAt'])) {
            $plan->setNextDueAt(new DateTime((string) $data['nextDueAt']));
        }

        $this->entityManager->flush();

        return $this->successResponse($this->mapPlan($plan));
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'], requirements: ['id' => '\\d+'])]
    #[IsGranted('WORKORDER_DELETE')]
    public function delete(int $id): JsonResponse
    {
        $plan = $this->planRepository->find($id);

        if (!$plan instanceof PreventiveMaintenancePlan) {
            return $this->errorResponse('Preventive maintenance plan not found', 404);
        }

        $this->entityManager->remove($plan);
        $this->entityManager->flush();

        return $this->json(null, 204);
    }

    #[Route('/{id}/generate', name: 'generate', methods: ['POST'], requirements: ['id' => '\\d+'])]
    #[IsGranted('WORKORDER_CREATE')]
    public function generate(int $id): JsonResponse
    {
        $plan = $this->planRepository->find($id);

        if (!$plan instanceof PreventiveMaintenancePlan) {
            return $this->errorResponse('Preventive maintenance plan not found', 404);
        }

        $workOrder = $this->schedulerService->generateWorkOrderFromPlan($plan);

        return $this->successResponse([
            'plan' => $this->mapPlan($plan),
            'workOrder' => [
                'id' => $workOrder->getId(),
                'title' => $workOrder->getTitle(),
                'status' => $workOrder->getStatus()->getName(),
                'equipment' => $workOrder->getEquipment()->getName(),
            ],
        ], 201);
    }

    #[Route('/run-due', name: 'run_due', methods: ['POST'])]
    #[IsGranted('WORKORDER_CREATE')]
    public function runDue(): JsonResponse
    {
        return $this->successResponse($this->schedulerService->generateDueWorkOrders());
    }

    /**
     * @return array<string, mixed>
     */
    private function mapPlan(PreventiveMaintenancePlan $plan): array
    {
        return [
            'id' => $plan->getId(),
            'title' => $plan->getTitle(),
            'description' => $plan->getDescription(),
            'intervalDays' => $plan->getIntervalDays(),
            'isActive' => $plan->isActive(),
            'nextDueAt' => $plan->getNextDueAt()?->format('c'),
            'lastGeneratedAt' => $plan->getLastGeneratedAt()?->format('c'),
            'equipment' => [
                'id' => $plan->getEquipment()->getId(),
                'name' => $plan->getEquipment()->getName(),
            ],
            'priority' => [
                'id' => $plan->getPriority()->getId(),
                'name' => $plan->getPriority()->getName(),
            ],
            'createdBy' => [
                'id' => $plan->getCreatedBy()->getId(),
                'name' => $plan->getCreatedBy()->getFirstName() . ' ' . $plan->getCreatedBy()->getLastName(),
            ],
            'createdAt' => $plan->getCreatedAt()->format('c'),
            'updatedAt' => $plan->getUpdatedAt()?->format('c'),
        ];
    }
}