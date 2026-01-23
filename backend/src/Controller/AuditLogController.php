<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repository\AuditLogRepository;
use DateTimeImmutable;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/audit-logs', name: 'api_audit_logs_')]
#[IsGranted('ROLE_ADMIN')]
class AuditLogController extends AbstractController {
    use ApiResponseTrait;

    public function __construct(
        private readonly AuditLogRepository $auditLogRepository,
    ) {}

    /**
     * Get audit logs with filters and pagination.
     */
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request): JsonResponse {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(100, max(10, (int) $request->query->get('limit', 50)));
        $offset = ($page - 1) * $limit;

        // Build filters
        $filters = [];

        if ($request->query->has('userId')) {
            $filters['userId'] = (int) $request->query->get('userId');
        }

        if ($request->query->has('action')) {
            $filters['action'] = $request->query->get('action');
        }

        if ($request->query->has('entityType')) {
            $filters['entityType'] = $request->query->get('entityType');
        }

        if ($request->query->has('entityId')) {
            $filters['entityId'] = (int) $request->query->get('entityId');
        }

        if ($request->query->has('startDate')) {
            $filters['startDate'] = $request->query->get('startDate');
        }

        if ($request->query->has('endDate')) {
            $filters['endDate'] = $request->query->get('endDate');
        }

        if ($request->query->has('ipAddress')) {
            $filters['ipAddress'] = $request->query->get('ipAddress');
        }

        $logs = $this->auditLogRepository->findWithFilters($filters, $limit, $offset);
        $total = $this->auditLogRepository->countWithFilters($filters);

        // Serialize with user data
        $data = [];
        foreach ($logs as $log) {
            $data[] = [
                'id' => $log->getId(),
                'user' => $log->getUser() ? [
                    'id' => $log->getUser()->getId(),
                    'email' => $log->getUser()->getEmail(),
                    'firstName' => $log->getUser()->getFirstName(),
                    'lastName' => $log->getUser()->getLastName(),
                ] : null,
                'action' => $log->getAction(),
                'entityType' => $log->getEntityType(),
                'entityId' => $log->getEntityId(),
                'changes' => $log->getChanges(),
                'metadata' => $log->getMetadata(),
                'ipAddress' => $log->getIpAddress(),
                'userAgent' => $log->getUserAgent(),
                'createdAt' => $log->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return $this->successResponse(
            data: [
                'logs' => $data,
                'pagination' => [
                    'currentPage' => $page,
                    'totalPages' => (int) ceil($total / $limit),
                    'totalItems' => $total,
                    'itemsPerPage' => $limit,
                ],
            ],
            message: 'audit.list.retrieved',
        );
    }

    /**
     * Get audit log statistics.
     */
    #[Route('/stats', name: 'stats', methods: ['GET'])]
    public function stats(Request $request): JsonResponse {
        $period = $request->query->get('period', '7days'); // 7days, 30days, 90days, all

        $startDate = match ($period) {
            '7days' => new DateTimeImmutable('-7 days'),
            '30days' => new DateTimeImmutable('-30 days'),
            '90days' => new DateTimeImmutable('-90 days'),
            default => null,
        };

        $statsByAction = $this->auditLogRepository->getStatsByAction($startDate);
        $statsByUser = $this->auditLogRepository->getStatsByUser($startDate);

        return $this->successResponse(
            data: [
                'period' => $period,
                'byAction' => $statsByAction,
                'byUser' => $statsByUser,
            ],
            message: 'audit.stats.retrieved',
        );
    }

    /**
     * Get single audit log details.
     */
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse {
        $log = $this->auditLogRepository->find($id);

        if (!$log) {
            return $this->notFoundResponse('audit.not_found');
        }

        $data = [
            'id' => $log->getId(),
            'user' => $log->getUser() ? [
                'id' => $log->getUser()->getId(),
                'email' => $log->getUser()->getEmail(),
                'firstName' => $log->getUser()->getFirstName(),
                'lastName' => $log->getUser()->getLastName(),
            ] : null,
            'action' => $log->getAction(),
            'entityType' => $log->getEntityType(),
            'entityId' => $log->getEntityId(),
            'changes' => $log->getChanges(),
            'metadata' => $log->getMetadata(),
            'ipAddress' => $log->getIpAddress(),
            'userAgent' => $log->getUserAgent(),
            'createdAt' => $log->getCreatedAt()->format('Y-m-d H:i:s'),
        ];

        return $this->successResponse(
            data: $data,
            message: 'audit.retrieved',
        );
    }

    /**
     * Get distinct action types from audit logs.
     */
    #[Route('/meta/actions', name: 'actions', methods: ['GET'])]
    public function getActions(): JsonResponse {
        $actions = $this->auditLogRepository->getDistinctActions();
        
        return $this->successResponse(
            data: $actions,
            message: 'audit.actions.retrieved',
        );
    }

    /**
     * Get distinct entity types from audit logs.
     */
    #[Route('/meta/entities', name: 'entities', methods: ['GET'])]
    public function getEntities(): JsonResponse {
        $entities = $this->auditLogRepository->getDistinctEntityTypes();
        
        return $this->successResponse(
            data: $entities,
            message: 'audit.entities.retrieved',
        );
    }
}
