<?php

declare(strict_types=1);

namespace App\Controller;

use App\Application\Command\WorkOrder\AddWorkOrderActivityCommand;
use App\Application\Command\WorkOrder\AssignUserToWorkOrderCommand;
use App\Application\Command\WorkOrder\CreateWorkOrderCommand;
use App\Application\Command\WorkOrder\CreateWorkOrderPriorityCommand;
use App\Application\Command\WorkOrder\CreateWorkOrderStatusCommand;
use App\Application\Command\WorkOrder\DeleteWorkOrderCommand;
use App\Application\Command\WorkOrder\DeleteWorkOrderPriorityCommand;
use App\Application\Command\WorkOrder\DeleteWorkOrderStatusCommand;
use App\Application\Command\WorkOrder\UpdateWorkOrderCommand;
use App\Application\Command\WorkOrder\UpdateWorkOrderPriorityCommand;
use App\Application\Command\WorkOrder\UpdateWorkOrderStatusCommand;
use App\Application\Query\WorkOrder\GetAllWorkOrdersQuery;
use App\Application\Query\WorkOrder\GetWorkOrderByIdQuery;
use App\Application\Query\WorkOrder\GetWorkOrderPrioritiesQuery;
use App\Application\Query\WorkOrder\GetWorkOrderStatusesQuery;
use App\Entity\User;
use DateTime;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\HandledStamp;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/work-orders', name: 'api_work_orders_')]
class WorkOrderController extends AbstractController {
    public function __construct(
        private MessageBusInterface $messageBus,
    ) {}

    #[Route('/statuses', name: 'statuses', methods: ['GET'])]
    #[OA\Get(
        path: '/api/work-orders/statuses',
        summary: 'Get all work order statuses',
        tags: ['WorkOrder'],
    )]
    #[OA\Response(
        response: 200,
        description: 'List of work order statuses ordered by display order',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'open'),
                    new OA\Property(property: 'color', type: 'string', example: '#3b82f6'),
                    new OA\Property(property: 'displayOrder', type: 'integer', example: 1),
                    new OA\Property(property: 'isFinal', type: 'boolean', example: false),
                ],
            ),
        ),
    )]
    public function getStatuses(): JsonResponse {
        $envelope = $this->messageBus->dispatch(new GetWorkOrderStatusesQuery());
        $statuses = $envelope->last(HandledStamp::class)->getResult();

        return $this->json($statuses);
    }

    #[Route('/priorities', name: 'priorities', methods: ['GET'])]
    #[OA\Get(
        path: '/api/work-orders/priorities',
        summary: 'Get all work order priorities',
        tags: ['WorkOrder'],
    )]
    #[OA\Response(
        response: 200,
        description: 'List of work order priorities ordered by display order',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'low'),
                    new OA\Property(property: 'color', type: 'string', example: '#10b981'),
                    new OA\Property(property: 'displayOrder', type: 'integer', example: 1),
                ],
            ),
        ),
    )]
    public function getPriorities(): JsonResponse {
        $envelope = $this->messageBus->dispatch(new GetWorkOrderPrioritiesQuery());
        $priorities = $envelope->last(HandledStamp::class)->getResult();

        return $this->json($priorities);
    }

    #[Route('/statuses', name: 'create_status', methods: ['POST'])]
    #[IsGranted('WORKORDER_STATUS_CREATE')]
    #[OA\Post(
        path: '/api/work-orders/statuses',
        summary: 'Create work order status (admin only)',
        security: [['Bearer' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'pending_approval'),
                    new OA\Property(property: 'color', type: 'string', example: '#8b5cf6'),
                    new OA\Property(property: 'displayOrder', type: 'integer', example: 6),
                    new OA\Property(property: 'isFinal', type: 'boolean', example: false),
                ],
            ),
        ),
        tags: ['WorkOrder'],
    )]
    #[OA\Response(response: 201, description: 'Status created successfully')]
    #[OA\Response(response: 403, description: 'Access denied - admin only')]
    public function createStatus(Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $command = new CreateWorkOrderStatusCommand(
            name: $data['name'],
            color: $data['color'] ?? null,
            displayOrder: $data['displayOrder'] ?? 0,
            isFinal: $data['isFinal'] ?? false,
        );

        $envelope = $this->messageBus->dispatch($command);
        $status = $envelope->last(HandledStamp::class)->getResult();

        return $this->json($status, Response::HTTP_CREATED);
    }

    #[Route('/statuses/{id}', name: 'update_status', methods: ['PUT', 'PATCH'])]
    #[IsGranted('WORKORDER_STATUS_EDIT')]
    #[OA\Put(
        path: '/api/work-orders/statuses/{id}',
        summary: 'Update work order status (admin only)',
        security: [['Bearer' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'pending_approval'),
                    new OA\Property(property: 'color', type: 'string', example: '#8b5cf6'),
                    new OA\Property(property: 'displayOrder', type: 'integer', example: 6),
                    new OA\Property(property: 'isFinal', type: 'boolean', example: false),
                ],
            ),
        ),
        tags: ['WorkOrder'],
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer'),
    )]
    #[OA\Response(response: 200, description: 'Status updated successfully')]
    #[OA\Response(response: 403, description: 'Access denied - admin only')]
    #[OA\Response(response: 404, description: 'Status not found')]
    public function updateStatus(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $command = new UpdateWorkOrderStatusCommand(
            id: $id,
            name: $data['name'] ?? null,
            color: $data['color'] ?? null,
            displayOrder: $data['displayOrder'] ?? null,
            isFinal: $data['isFinal'] ?? null,
        );

        $envelope = $this->messageBus->dispatch($command);
        $status = $envelope->last(HandledStamp::class)->getResult();

        return $this->json($status);
    }

    #[Route('/statuses/{id}', name: 'delete_status', methods: ['DELETE'])]
    #[IsGranted('WORKORDER_STATUS_DELETE')]
    #[OA\Delete(
        path: '/api/work-orders/statuses/{id}',
        summary: 'Delete work order status (admin only)',
        security: [['Bearer' => []]],
        tags: ['WorkOrder'],
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer'),
    )]
    #[OA\Response(response: 204, description: 'Status deleted successfully')]
    #[OA\Response(response: 403, description: 'Access denied - admin only')]
    #[OA\Response(response: 404, description: 'Status not found')]
    public function deleteStatus(int $id): JsonResponse {
        $this->messageBus->dispatch(new DeleteWorkOrderStatusCommand($id));

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/priorities', name: 'create_priority', methods: ['POST'])]
    #[IsGranted('WORKORDER_PRIORITY_CREATE')]
    #[OA\Post(
        path: '/api/work-orders/priorities',
        summary: 'Create work order priority (admin only)',
        security: [['Bearer' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'urgent'),
                    new OA\Property(property: 'color', type: 'string', example: '#dc2626'),
                    new OA\Property(property: 'displayOrder', type: 'integer', example: 5),
                ],
            ),
        ),
        tags: ['WorkOrder'],
    )]
    #[OA\Response(response: 201, description: 'Priority created successfully')]
    #[OA\Response(response: 403, description: 'Access denied - admin only')]
    public function createPriority(Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $command = new CreateWorkOrderPriorityCommand(
            name: $data['name'],
            color: $data['color'] ?? null,
            displayOrder: $data['displayOrder'] ?? 0,
        );

        $envelope = $this->messageBus->dispatch($command);
        $priority = $envelope->last(HandledStamp::class)->getResult();

        return $this->json($priority, Response::HTTP_CREATED);
    }

    #[Route('/priorities/{id}', name: 'update_priority', methods: ['PUT', 'PATCH'])]
    #[IsGranted('WORKORDER_PRIORITY_EDIT')]
    #[OA\Put(
        path: '/api/work-orders/priorities/{id}',
        summary: 'Update work order priority (admin only)',
        security: [['Bearer' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'urgent'),
                    new OA\Property(property: 'color', type: 'string', example: '#dc2626'),
                    new OA\Property(property: 'displayOrder', type: 'integer', example: 5),
                ],
            ),
        ),
        tags: ['WorkOrder'],
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer'),
    )]
    #[OA\Response(response: 200, description: 'Priority updated successfully')]
    #[OA\Response(response: 403, description: 'Access denied - admin only')]
    #[OA\Response(response: 404, description: 'Priority not found')]
    public function updatePriority(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $command = new UpdateWorkOrderPriorityCommand(
            id: $id,
            name: $data['name'] ?? null,
            color: $data['color'] ?? null,
            displayOrder: $data['displayOrder'] ?? null,
        );

        $envelope = $this->messageBus->dispatch($command);
        $priority = $envelope->last(HandledStamp::class)->getResult();

        return $this->json($priority);
    }

    #[Route('/priorities/{id}', name: 'delete_priority', methods: ['DELETE'])]
    #[IsGranted('WORKORDER_PRIORITY_DELETE')]
    #[OA\Delete(
        path: '/api/work-orders/priorities/{id}',
        summary: 'Delete work order priority (admin only)',
        security: [['Bearer' => []]],
        tags: ['WorkOrder'],
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer'),
    )]
    #[OA\Response(response: 204, description: 'Priority deleted successfully')]
    #[OA\Response(response: 403, description: 'Access denied - admin only')]
    #[OA\Response(response: 404, description: 'Priority not found')]
    public function deletePriority(int $id): JsonResponse {
        $this->messageBus->dispatch(new DeleteWorkOrderPriorityCommand($id));

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('', name: 'list', methods: ['GET'])]
    #[IsGranted('WORKORDER_VIEW')]
    #[OA\Get(
        path: '/api/work-orders',
        summary: 'Get all work orders',
        security: [['Bearer' => []]],
        tags: ['WorkOrder'],
    )]
    #[OA\Response(
        response: 200,
        description: 'List of work orders (provider sees only own work orders)',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: \App\Entity\WorkOrder::class)),
        ),
    )]
    #[OA\Response(response: 401, description: 'Unauthorized')]
    #[OA\Response(response: 403, description: 'Access denied')]
    public function list(): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        // Filter by user for provider role
        $filterByUserId = null;
        if ($user->getUserRole()->getName() === 'provider') {
            $filterByUserId = $user->getId();
        }

        $envelope = $this->messageBus->dispatch(new GetAllWorkOrdersQuery($filterByUserId));
        $workOrders = $envelope->last(HandledStamp::class)->getResult();

        return $this->json($workOrders, 200, [], [
            'enable_max_depth' => true,
        ]);
    }

    #[Route('/export', name: 'export', methods: ['GET'])]
    #[IsGranted('WORKORDER_VIEW')]
    #[OA\Get(
        path: '/api/work-orders/export',
        summary: 'Export work orders in minimal format (optimized for Excel)',
        description: 'Returns work orders with only essential fields for export. Provides 80% smaller response size compared to standard list endpoint.',
        security: [['Bearer' => []]],
        tags: ['WorkOrder'],
    )]
    #[OA\Parameter(
        name: 'startDate',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'string', format: 'date'),
        example: '2025-01-01',
        description: 'Filter work orders created after this date (inclusive)',
    )]
    #[OA\Parameter(
        name: 'endDate',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'string', format: 'date'),
        example: '2025-12-31',
        description: 'Filter work orders created before this date (inclusive)',
    )]
    #[OA\Response(
        response: 200,
        description: 'Simplified list of work orders for export (provider sees only own work orders)',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 123),
                    new OA\Property(property: 'uniqueCode', type: 'string', example: 'WO-2025-001'),
                    new OA\Property(property: 'title', type: 'string', example: 'Fix broken pump'),
                    new OA\Property(property: 'description', type: 'string', example: 'Pump in room A-101 needs repair'),
                    new OA\Property(property: 'status', type: 'string', example: 'In Progress'),
                    new OA\Property(property: 'statusColor', type: 'string', example: '#FFA500'),
                    new OA\Property(property: 'priority', type: 'string', example: 'High'),
                    new OA\Property(property: 'priorityColor', type: 'string', example: '#FF0000'),
                    new OA\Property(property: 'equipment', type: 'string', example: 'Wózek widłowy #42'),
                    new OA\Property(property: 'equipmentCostCenter', type: 'string', example: 'CC-001'),
                    new OA\Property(property: 'parentEquipment', type: 'string', example: 'Magazyn główny', nullable: true),
                    new OA\Property(property: 'createdBy', type: 'string', example: 'Jan Kowalski'),
                    new OA\Property(property: 'createdByEmail', type: 'string', example: 'jan.kowalski@maintly.com'),
                    new OA\Property(property: 'assignedUsers', type: 'string', example: 'Anna Nowak, Piotr Wiśniewski'),
                    new OA\Property(property: 'createdAt', type: 'string', format: 'date-time', example: '2025-01-15T10:30:00+00:00'),
                    new OA\Property(property: 'updatedAt', type: 'string', format: 'date-time', example: '2025-01-20T14:45:00+00:00'),
                    new OA\Property(property: 'plannedStartDate', type: 'string', format: 'date-time', example: '2025-01-20T08:00:00+00:00', nullable: true),
                    new OA\Property(property: 'plannedEndDate', type: 'string', format: 'date-time', example: '2025-01-25T16:00:00+00:00', nullable: true),
                    new OA\Property(property: 'actualStartDate', type: 'string', format: 'date-time', example: '2025-01-21T09:15:00+00:00', nullable: true),
                    new OA\Property(property: 'actualEndDate', type: 'string', format: 'date-time', example: '2025-01-24T15:30:00+00:00', nullable: true),
                ],
            ),
        ),
    )]
    #[OA\Response(response: 401, description: 'Unauthorized')]
    #[OA\Response(response: 403, description: 'Access denied')]
    public function export(Request $request): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        // Filter by user for provider role
        $filterByUserId = null;
        if ($user->getUserRole()->getName() === 'provider') {
            $filterByUserId = $user->getId();
        }

        $envelope = $this->messageBus->dispatch(new GetAllWorkOrdersQuery($filterByUserId));
        $workOrders = $envelope->last(HandledStamp::class)->getResult();

        // Apply date filters if provided
        $startDate = $request->query->get('startDate');
        $endDate = $request->query->get('endDate');

        if ($startDate || $endDate) {
            $workOrders = array_filter($workOrders, function ($wo) use ($startDate, $endDate) {
                $createdAt = $wo->getCreatedAt();

                if ($startDate) {
                    $start = new DateTime($startDate);
                    $start->setTime(0, 0, 0);
                    if ($createdAt < $start) {
                        return false;
                    }
                }

                if ($endDate) {
                    $end = new DateTime($endDate);
                    $end->setTime(23, 59, 59);
                    if ($createdAt > $end) {
                        return false;
                    }
                }

                return true;
            });

            // Re-index array after filtering
            $workOrders = array_values($workOrders);
        }

        // Transform to minimal export format
        $exportData = array_map(function ($workOrder) {
            $assignedUsers = [];
            foreach ($workOrder->getAssignments() as $assignment) {
                $user = $assignment->getAssignedUser();
                $assignedUsers[] = $user->getFirstName() . ' ' . $user->getLastName();
            }

            return [
                'id' => $workOrder->getId(),
                'uniqueCode' => $workOrder->getUniqueCode(),
                'title' => $workOrder->getTitle(),
                'description' => $workOrder->getDescription(),
                'status' => $workOrder->getStatus()->getName(),
                'statusColor' => $workOrder->getStatus()->getColor(),
                'priority' => $workOrder->getPriority()->getName(),
                'priorityColor' => $workOrder->getPriority()->getColor(),
                'equipment' => $workOrder->getEquipment()->getName(),
                'equipmentCostCenter' => $workOrder->getEquipment()->getCostCenter(),
                'parentEquipment' => $workOrder->getEquipment()->getParentEquipment()?->getName(),
                'createdBy' => $workOrder->getCreatedBy()->getFirstName() . ' ' . $workOrder->getCreatedBy()->getLastName(),
                'createdByEmail' => $workOrder->getCreatedBy()->getEmail(),
                'assignedUsers' => implode(', ', $assignedUsers) ?: null,
                'createdAt' => $workOrder->getCreatedAt()?->format('c'),
                'updatedAt' => $workOrder->getUpdatedAt()?->format('c'),
                'plannedStartDate' => $workOrder->getPlannedStartDate()?->format('c'),
                'plannedEndDate' => $workOrder->getPlannedEndDate()?->format('c'),
                'actualStartDate' => $workOrder->getActualStartDate()?->format('c'),
                'actualEndDate' => $workOrder->getActualEndDate()?->format('c'),
            ];
        }, $workOrders);

        return $this->json($exportData);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('WORKORDER_CREATE')]
    #[OA\Post(
        path: '/api/work-orders',
        summary: 'Create a new work order',
        security: [['Bearer' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['title', 'description', 'statusId', 'priorityId', 'equipmentId'],
                properties: [
                    new OA\Property(property: 'title', type: 'string', example: 'Fix broken pump'),
                    new OA\Property(property: 'description', type: 'string', example: 'Pump in room A-101 is not working properly'),
                    new OA\Property(property: 'statusId', type: 'integer', example: 1),
                    new OA\Property(property: 'priorityId', type: 'integer', example: 3),
                    new OA\Property(property: 'equipmentId', type: 'integer', example: 5),
                    new OA\Property(property: 'plannedStartDate', type: 'string', format: 'date-time', example: '2025-11-10T09:00:00+00:00'),
                    new OA\Property(property: 'plannedEndDate', type: 'string', format: 'date-time', example: '2025-11-10T17:00:00+00:00'),
                ],
            ),
        ),
        tags: ['WorkOrder'],
    )]
    #[OA\Response(
        response: 201,
        description: 'Work order created successfully',
        content: new OA\JsonContent(ref: new Model(type: \App\Entity\WorkOrder::class)),
    )]
    #[OA\Response(response: 400, description: 'Invalid input')]
    #[OA\Response(response: 401, description: 'Unauthorized')]
    #[OA\Response(response: 403, description: 'Access denied')]
    public function create(Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        /** @var User $user */
        $user = $this->getUser();

        $plannedStartDate = isset($data['plannedStartDate'])
            ? new DateTime($data['plannedStartDate'])
            : null;

        $plannedEndDate = isset($data['plannedEndDate'])
            ? new DateTime($data['plannedEndDate'])
            : null;

        $command = new CreateWorkOrderCommand(
            title: $data['title'],
            description: $data['description'],
            statusId: $data['statusId'],
            priorityId: $data['priorityId'],
            equipmentId: $data['equipmentId'],
            createdBy: $user->getId(),
            plannedStartDate: $plannedStartDate,
            plannedEndDate: $plannedEndDate,
        );

        $envelope = $this->messageBus->dispatch($command);
        $workOrder = $envelope->last(HandledStamp::class)->getResult();

        return $this->json($workOrder, Response::HTTP_CREATED, [], [
            'enable_max_depth' => true,
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    #[OA\Get(
        path: '/api/work-orders/{id}',
        summary: 'Get work order by ID',
        security: [['Bearer' => []]],
        tags: ['WorkOrder'],
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer'),
        example: 1,
    )]
    #[OA\Response(
        response: 200,
        description: 'Work order details',
        content: new OA\JsonContent(ref: new Model(type: \App\Entity\WorkOrder::class)),
    )]
    #[OA\Response(response: 401, description: 'Unauthorized')]
    #[OA\Response(response: 403, description: 'Access denied')]
    #[OA\Response(response: 404, description: 'Work order not found')]
    public function show(int $id): JsonResponse {
        $envelope = $this->messageBus->dispatch(new GetWorkOrderByIdQuery($id));
        $workOrder = $envelope->last(HandledStamp::class)->getResult();

        $this->denyAccessUnlessGranted('WORKORDER_VIEW', $workOrder);

        return $this->json($workOrder, 200, [], [
            'enable_max_depth' => true,
        ]);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    #[OA\Put(
        path: '/api/work-orders/{id}',
        summary: 'Update work order',
        security: [['Bearer' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'title', type: 'string', example: 'Fix broken pump - Updated'),
                    new OA\Property(property: 'description', type: 'string', example: 'Updated description'),
                    new OA\Property(property: 'statusId', type: 'integer', example: 2),
                    new OA\Property(property: 'priorityId', type: 'integer', example: 4),
                    new OA\Property(property: 'equipmentId', type: 'integer', example: 5),
                    new OA\Property(property: 'plannedStartDate', type: 'string', format: 'date-time'),
                    new OA\Property(property: 'plannedEndDate', type: 'string', format: 'date-time'),
                    new OA\Property(property: 'actualStartDate', type: 'string', format: 'date-time'),
                    new OA\Property(property: 'actualEndDate', type: 'string', format: 'date-time'),
                ],
            ),
        ),
        tags: ['WorkOrder'],
    )]
    #[OA\Patch(
        path: '/api/work-orders/{id}',
        summary: 'Partially update work order',
        security: [['Bearer' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'statusId', type: 'integer', example: 2),
                ],
            ),
        ),
        tags: ['WorkOrder'],
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer'),
        example: 1,
    )]
    #[OA\Response(
        response: 200,
        description: 'Work order updated successfully',
        content: new OA\JsonContent(ref: new Model(type: \App\Entity\WorkOrder::class)),
    )]
    #[OA\Response(response: 400, description: 'Invalid input')]
    #[OA\Response(response: 401, description: 'Unauthorized')]
    #[OA\Response(response: 403, description: 'Access denied')]
    #[OA\Response(response: 404, description: 'Work order not found')]
    public function update(int $id, Request $request): JsonResponse {
        // First get the work order to check permissions
        $envelope = $this->messageBus->dispatch(new GetWorkOrderByIdQuery($id));
        $workOrder = $envelope->last(HandledStamp::class)->getResult();

        $this->denyAccessUnlessGranted('WORKORDER_EDIT', $workOrder);

        $data = json_decode($request->getContent(), true);

        /** @var User $user */
        $user = $this->getUser();

        $plannedStartDate = isset($data['plannedStartDate'])
            ? new DateTime($data['plannedStartDate'])
            : null;

        $plannedEndDate = isset($data['plannedEndDate'])
            ? new DateTime($data['plannedEndDate'])
            : null;

        $actualStartDate = isset($data['actualStartDate'])
            ? new DateTime($data['actualStartDate'])
            : null;

        $actualEndDate = isset($data['actualEndDate'])
            ? new DateTime($data['actualEndDate'])
            : null;

        $command = new UpdateWorkOrderCommand(
            id: $id,
            updatedBy: $user->getId(),
            title: $data['title'] ?? null,
            description: $data['description'] ?? null,
            statusId: $data['statusId'] ?? null,
            priorityId: $data['priorityId'] ?? null,
            equipmentId: $data['equipmentId'] ?? null,
            plannedStartDate: $plannedStartDate,
            plannedEndDate: $plannedEndDate,
            actualStartDate: $actualStartDate,
            actualEndDate: $actualEndDate,
        );

        $envelope = $this->messageBus->dispatch($command);
        $updatedWorkOrder = $envelope->last(HandledStamp::class)->getResult();

        return $this->json($updatedWorkOrder, 200, [], [
            'enable_max_depth' => true,
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[OA\Delete(
        path: '/api/work-orders/{id}',
        summary: 'Delete work order (soft delete)',
        security: [['Bearer' => []]],
        tags: ['WorkOrder'],
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer'),
        example: 1,
    )]
    #[OA\Response(response: 204, description: 'Work order deleted successfully')]
    #[OA\Response(response: 401, description: 'Unauthorized')]
    #[OA\Response(response: 403, description: 'Access denied - only admin and manager can delete')]
    #[OA\Response(response: 404, description: 'Work order not found')]
    public function delete(int $id): JsonResponse {
        // First get the work order to check permissions
        $envelope = $this->messageBus->dispatch(new GetWorkOrderByIdQuery($id));
        $workOrder = $envelope->last(HandledStamp::class)->getResult();

        $this->denyAccessUnlessGranted('WORKORDER_DELETE', $workOrder);

        $this->messageBus->dispatch(new DeleteWorkOrderCommand($id));

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/{id}/assign', name: 'assign_user', methods: ['POST'])]
    #[OA\Post(
        path: '/api/work-orders/{id}/assign',
        summary: 'Assign user to work order',
        security: [['Bearer' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['userId'],
                properties: [
                    new OA\Property(property: 'userId', type: 'integer', example: 5),
                ],
            ),
        ),
        tags: ['WorkOrder'],
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer'),
        example: 1,
    )]
    #[OA\Response(
        response: 201,
        description: 'User assigned successfully',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'id', type: 'integer', example: 1),
                new OA\Property(property: 'workOrderId', type: 'integer', example: 1),
                new OA\Property(property: 'userId', type: 'integer', example: 5),
                new OA\Property(property: 'assignedAt', type: 'string', format: 'date-time'),
            ],
        ),
    )]
    #[OA\Response(response: 400, description: 'User already assigned or invalid input')]
    #[OA\Response(response: 401, description: 'Unauthorized')]
    #[OA\Response(response: 403, description: 'Access denied')]
    #[OA\Response(response: 404, description: 'Work order or user not found')]
    public function assignUser(int $id, Request $request): JsonResponse {
        // First get the work order to check permissions
        $envelope = $this->messageBus->dispatch(new GetWorkOrderByIdQuery($id));
        $workOrder = $envelope->last(HandledStamp::class)->getResult();

        $this->denyAccessUnlessGranted('WORKORDER_EDIT', $workOrder);

        $data = json_decode($request->getContent(), true);

        /** @var User $user */
        $user = $this->getUser();

        $command = new AssignUserToWorkOrderCommand(
            workOrderId: $id,
            userId: $data['userId'],
            assignedBy: $user->getId(),
        );

        $envelope = $this->messageBus->dispatch($command);
        $assignment = $envelope->last(HandledStamp::class)->getResult();

        return $this->json($assignment, Response::HTTP_CREATED);
    }

    #[Route('/{id}/activities', name: 'add_activity', methods: ['POST'])]
    #[OA\Post(
        path: '/api/work-orders/{id}/activities',
        summary: 'Add activity to work order',
        security: [['Bearer' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['description', 'performedBy'],
                properties: [
                    new OA\Property(property: 'description', type: 'string', example: 'Replaced the pump motor'),
                    new OA\Property(property: 'performedBy', type: 'integer', example: 5),
                    new OA\Property(property: 'timeSpent', type: 'integer', example: 120, description: 'Time spent in minutes'),
                    new OA\Property(property: 'completedAt', type: 'string', format: 'date-time', example: '2025-11-10T15:30:00+00:00'),
                ],
            ),
        ),
        tags: ['WorkOrder'],
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer'),
        example: 1,
    )]
    #[OA\Response(
        response: 201,
        description: 'Activity added successfully',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'id', type: 'integer', example: 1),
                new OA\Property(property: 'description', type: 'string', example: 'Replaced the pump motor'),
                new OA\Property(property: 'timeSpent', type: 'integer', example: 120),
                new OA\Property(property: 'completedAt', type: 'string', format: 'date-time'),
                new OA\Property(property: 'createdAt', type: 'string', format: 'date-time'),
            ],
        ),
    )]
    #[OA\Response(response: 400, description: 'Invalid input')]
    #[OA\Response(response: 401, description: 'Unauthorized')]
    #[OA\Response(response: 403, description: 'Access denied')]
    #[OA\Response(response: 404, description: 'Work order not found')]
    public function addActivity(int $id, Request $request): JsonResponse {
        // First get the work order to check permissions
        $envelope = $this->messageBus->dispatch(new GetWorkOrderByIdQuery($id));
        $workOrder = $envelope->last(HandledStamp::class)->getResult();

        $this->denyAccessUnlessGranted('WORKORDER_EDIT', $workOrder);

        $data = json_decode($request->getContent(), true);

        /** @var User $user */
        $user = $this->getUser();

        $completedAt = isset($data['completedAt'])
            ? new DateTime($data['completedAt'])
            : null;

        $command = new AddWorkOrderActivityCommand(
            workOrderId: $id,
            description: $data['description'],
            performedBy: $data['performedBy'],
            createdBy: $user->getId(),
            timeSpent: $data['timeSpent'] ?? null,
            completedAt: $completedAt,
        );

        $envelope = $this->messageBus->dispatch($command);
        $activity = $envelope->last(HandledStamp::class)->getResult();

        return $this->json($activity, Response::HTTP_CREATED, [], [
            'enable_max_depth' => true,
        ]);
    }
}
