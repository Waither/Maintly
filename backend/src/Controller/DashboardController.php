<?php

declare(strict_types=1);

namespace App\Controller;

use App\Application\Query\Dashboard\GetDashboardStatsQuery;
use App\Entity\User;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\HandledStamp;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/dashboard', name: 'api_dashboard_')]
#[IsGranted('IS_AUTHENTICATED_FULLY')]
class DashboardController extends AbstractController {
    public function __construct(
        private MessageBusInterface $messageBus,
    ) {}

    #[Route('/stats', name: 'stats', methods: ['GET'])]
    #[OA\Get(
        path: '/api/dashboard/stats',
        summary: 'Get dashboard statistics',
        description: 'Returns comprehensive dashboard statistics including work orders counts, equipment stats, top equipment by work orders, and recent activities. Provider role sees only their own data.',
        security: [['Bearer' => []]],
        tags: ['Dashboard'],
    )]
    #[OA\Response(
        response: 200,
        description: 'Dashboard statistics',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: 'workOrders',
                    properties: [
                        new OA\Property(property: 'total', type: 'integer', example: 45),
                        new OA\Property(property: 'pending', type: 'integer', example: 12),
                        new OA\Property(property: 'inProgress', type: 'integer', example: 18),
                        new OA\Property(property: 'completed', type: 'integer', example: 13),
                        new OA\Property(property: 'cancelled', type: 'integer', example: 2),
                        new OA\Property(property: 'onHold', type: 'integer', example: 0),
                    ],
                    type: 'object',
                ),
                new OA\Property(
                    property: 'equipment',
                    properties: [
                        new OA\Property(property: 'total', type: 'integer', example: 25),
                    ],
                    type: 'object',
                ),
                new OA\Property(
                    property: 'topEquipment',
                    type: 'array',
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 5),
                            new OA\Property(property: 'name', type: 'string', example: 'Prasa hydrauliczna H-200'),
                            new OA\Property(property: 'costCenter', type: 'string', example: 'CC-001'),
                            new OA\Property(property: 'workOrdersCount', type: 'integer', example: 8),
                        ],
                    ),
                ),
                new OA\Property(
                    property: 'recentActivities',
                    type: 'array',
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 123),
                            new OA\Property(property: 'workOrderId', type: 'integer', example: 45),
                            new OA\Property(property: 'workOrderTitle', type: 'string', example: 'Fix hydraulic press'),
                            new OA\Property(property: 'userName', type: 'string', example: 'Jan Kowalski'),
                            new OA\Property(property: 'activityText', type: 'string', example: 'Completed repair of hydraulic system'),
                            new OA\Property(property: 'createdAt', type: 'string', format: 'date-time', example: '2025-11-08T10:30:00+00:00'),
                        ],
                    ),
                ),
            ],
        ),
    )]
    #[OA\Response(response: 401, description: 'Unauthorized - Invalid or missing JWT token')]
    public function getStats(): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        // Filter by user ID for provider role (only see own work orders)
        $filterByUserId = null;
        if ($user->getUserRole()->getName() === 'provider') {
            $filterByUserId = $user->getId();
        }

        $query = new GetDashboardStatsQuery($filterByUserId);
        $envelope = $this->messageBus->dispatch($query);
        $stats = $envelope->last(HandledStamp::class)->getResult();

        return $this->json($stats);
    }
}
