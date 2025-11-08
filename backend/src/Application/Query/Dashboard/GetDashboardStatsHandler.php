<?php

declare(strict_types=1);

namespace App\Application\Query\Dashboard;

use App\Repository\EquipmentRepository;
use App\Repository\WorkOrderActivityRepository;
use App\Repository\WorkOrderRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetDashboardStatsHandler {
    public function __construct(
        private WorkOrderRepository $workOrderRepository,
        private EquipmentRepository $equipmentRepository,
        private WorkOrderActivityRepository $activityRepository,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function __invoke(GetDashboardStatsQuery $query): array {
        // Work Orders statistics
        $workOrderStats = $this->getWorkOrderStats($query->userId);

        // Equipment statistics
        $equipmentStats = $this->getEquipmentStats();

        // Top equipment by work orders count
        $topEquipment = $this->getTopEquipment($query->userId);

        // Recent activities
        $recentActivities = $this->getRecentActivities($query->userId);

        return [
            'workOrders' => $workOrderStats,
            'equipment' => $equipmentStats,
            'topEquipment' => $topEquipment,
            'recentActivities' => $recentActivities,
        ];
    }

    /**
     * @return array<string, int>
     */
    private function getWorkOrderStats(?int $userId): array {
        $queryBuilder = $this->workOrderRepository->createQueryBuilder('wo')
            ->select('COUNT(wo.id) as total')
            ->addSelect('SUM(CASE WHEN s.name = :pending THEN 1 ELSE 0 END) as pending')
            ->addSelect('SUM(CASE WHEN s.name = :inProgress THEN 1 ELSE 0 END) as inProgress')
            ->addSelect('SUM(CASE WHEN s.name = :completed THEN 1 ELSE 0 END) as completed')
            ->addSelect('SUM(CASE WHEN s.name = :cancelled THEN 1 ELSE 0 END) as cancelled')
            ->addSelect('SUM(CASE WHEN s.name = :onHold THEN 1 ELSE 0 END) as onHold')
            ->leftJoin('wo.status', 's')
            ->where('wo.deletedAt IS NULL')
            ->setParameter('pending', 'open')
            ->setParameter('inProgress', 'in_progress')
            ->setParameter('completed', 'completed')
            ->setParameter('cancelled', 'cancelled')
            ->setParameter('onHold', 'on_hold');

        // Filter by creator for provider role
        if ($userId !== null) {
            $queryBuilder
                ->andWhere('wo.createdBy = :userId')
                ->setParameter('userId', $userId);
        }

        $result = $queryBuilder->getQuery()->getSingleResult();

        return [
            'total' => (int) $result['total'],
            'pending' => (int) $result['pending'],
            'inProgress' => (int) $result['inProgress'],
            'completed' => (int) $result['completed'],
            'cancelled' => (int) $result['cancelled'],
            'onHold' => (int) $result['onHold'],
        ];
    }

    /**
     * @return array<string, int>
     */
    private function getEquipmentStats(): array {
        $total = $this->equipmentRepository->createQueryBuilder('e')
            ->select('COUNT(e.id)')
            ->where('e.deletedAt IS NULL')
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'total' => (int) $total,
        ];
    }

    /**
     * Get top 5 equipment by work orders count.
     *
     * @return array<int, array{id: int, name: string, costCenter: string|int, workOrdersCount: int}>
     */
    private function getTopEquipment(?int $userId): array {
        $queryBuilder = $this->workOrderRepository->createQueryBuilder('wo')
            ->select('e.id, e.name, e.costCenter, COUNT(wo.id) as workOrdersCount')
            ->leftJoin('wo.equipment', 'e')
            ->where('wo.deletedAt IS NULL')
            ->groupBy('e.id')
            ->orderBy('workOrdersCount', 'DESC')
            ->setMaxResults(5);

        // Filter by creator for provider role
        if ($userId !== null) {
            $queryBuilder
                ->andWhere('wo.createdBy = :userId')
                ->setParameter('userId', $userId);
        }

        $results = $queryBuilder->getQuery()->getResult();

        return array_map(function ($item) {
            return [
                'id' => $item['id'],
                'name' => $item['name'],
                'costCenter' => $item['costCenter'],
                'workOrdersCount' => (int) $item['workOrdersCount'],
            ];
        }, $results);
    }

    /**
     * Get 10 most recent activities.
     *
     * @return array<int, array{id: int, workOrderId: int, workOrderTitle: string, userName: string, activityText: string, createdAt: string}>
     */
    private function getRecentActivities(?int $userId): array {
        $queryBuilder = $this->activityRepository->createQueryBuilder('a')
            ->select('a.id, wo.id as workOrderId, wo.title as workOrderTitle, u.firstName, u.lastName, a.description as activityText, a.createdAt')
            ->leftJoin('a.workOrder', 'wo')
            ->leftJoin('a.performedBy', 'u')
            ->where('wo.deletedAt IS NULL')
            ->orderBy('a.createdAt', 'DESC')
            ->setMaxResults(10);

        // Filter by work order creator for provider role
        if ($userId !== null) {
            $queryBuilder
                ->andWhere('wo.createdBy = :userId')
                ->setParameter('userId', $userId);
        }

        $results = $queryBuilder->getQuery()->getResult();

        return array_map(function ($item) {
            return [
                'id' => $item['id'],
                'workOrderId' => $item['workOrderId'],
                'workOrderTitle' => $item['workOrderTitle'],
                'userName' => $item['firstName'] . ' ' . $item['lastName'],
                'activityText' => $item['activityText'],
                'createdAt' => $item['createdAt']->format('c'),
            ];
        }, $results);
    }
}
