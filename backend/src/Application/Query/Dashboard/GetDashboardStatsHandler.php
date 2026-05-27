<?php

declare(strict_types=1);

namespace App\Application\Query\Dashboard;

use App\Repository\EquipmentRepository;
use App\Repository\ReportRepository;
use App\Repository\UserRepository;
use App\Repository\WorkOrderActivityRepository;
use App\Repository\WorkOrderRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetDashboardStatsHandler {
    public function __construct(
        private WorkOrderRepository $workOrderRepository,
        private EquipmentRepository $equipmentRepository,
        private WorkOrderActivityRepository $activityRepository,
        private UserRepository $userRepository,
        private ReportRepository $reportRepository,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function __invoke(GetDashboardStatsQuery $query): array {
        // Work Orders statistics
        $workOrderStats = $this->getWorkOrderStats($query->userId);

        // Equipment statistics
        $equipmentStats = $this->getEquipmentStats();

        // Users statistics
        $userStats = $this->getUserStats();

        // Reports statistics
        $reportStats = $this->getReportStats();

        // Top equipment by work orders count
        $topEquipment = $this->getTopEquipment($query->userId);

        // Recent activities
        $recentActivities = $this->getRecentActivities($query->userId);

        // KPI: MTTR and MTBF
        $kpiStats = $this->getKpiStats($query->userId);

        return [
            'workOrders' => $workOrderStats,
            'equipment' => $equipmentStats,
            'users' => $userStats,
            'reports' => $reportStats,
            'topEquipment' => $topEquipment,
            'recentActivities' => $recentActivities,
            'kpi' => $kpiStats,
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
     * @return array<string, int>
     */
    private function getUserStats(): array {
        $total = (int) $this->userRepository->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->getQuery()
            ->getSingleScalarResult();

        $active = (int) $this->userRepository->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.isActive = :active')
            ->setParameter('active', true)
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'total' => $total,
            'active' => $active,
        ];
    }

    /**
     * @return array<string, int>
     */
    private function getReportStats(): array {
        $total = (int) $this->reportRepository->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->getQuery()
            ->getSingleScalarResult();

        $pending = (int) $this->reportRepository->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->where('r.status = :status')
            ->setParameter('status', 'pending')
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'total' => $total,
            'pending' => $pending,
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
    /**
     * Calculate MTTR (Mean Time To Repair) and MTBF (Mean Time Between Failures) in hours.
     * MTTR = average time from work order creation to closing (actualEndDate or updatedAt on final status).
     * MTBF = average time between consecutive completed work orders for the same equipment.
     *
     * @return array{mttr: float|null, mtbf: float|null, mttrUnit: string, mtbfUnit: string}
     */
    private function getKpiStats(?int $userId): array {
        // MTTR: average resolution time (hours) for completed/cancelled work orders
        $qb = $this->workOrderRepository->createQueryBuilder('wo')
            ->select('wo.createdAt, wo.actualEndDate, wo.updatedAt')
            ->leftJoin('wo.status', 's')
            ->where('s.isFinal = :final')
            ->andWhere('wo.deletedAt IS NULL')
            ->setParameter('final', true);

        if ($userId !== null) {
            $qb->andWhere('wo.createdBy = :userId')->setParameter('userId', $userId);
        }

        $finalOrders = $qb->getQuery()->getResult();

        $mttr = null;
        if (count($finalOrders) > 0) {
            $totalSeconds = 0;
            foreach ($finalOrders as $row) {
                $end = $row['actualEndDate'] ?? $row['updatedAt'];
                if ($end instanceof \DateTime && $row['createdAt'] instanceof \DateTime) {
                    $totalSeconds += $end->getTimestamp() - $row['createdAt']->getTimestamp();
                }
            }
            $avgSeconds = $totalSeconds / count($finalOrders);
            $mttr = round($avgSeconds / 3600, 2); // hours
        }

        // MTBF: average time between consecutive completed work orders per equipment (hours)
        $qb2 = $this->workOrderRepository->createQueryBuilder('wo')
            ->select('IDENTITY(wo.equipment) as equipmentId, wo.actualEndDate, wo.updatedAt')
            ->leftJoin('wo.status', 's')
            ->where('s.isFinal = :final')
            ->andWhere('wo.deletedAt IS NULL')
            ->orderBy('IDENTITY(wo.equipment)', 'ASC')
            ->addOrderBy('wo.createdAt', 'ASC')
            ->setParameter('final', true);

        if ($userId !== null) {
            $qb2->andWhere('wo.createdBy = :userId')->setParameter('userId', $userId);
        }

        $orderedOrders = $qb2->getQuery()->getResult();

        $mtbf = null;
        $intervals = [];
        $lastEndByEquipment = [];

        foreach ($orderedOrders as $row) {
            $eqId = (int) $row['equipmentId'];
            $end = $row['actualEndDate'] ?? $row['updatedAt'];

            if ($end instanceof \DateTime) {
                if (isset($lastEndByEquipment[$eqId])) {
                    $intervals[] = $end->getTimestamp() - $lastEndByEquipment[$eqId];
                }
                $lastEndByEquipment[$eqId] = $end->getTimestamp();
            }
        }

        if (count($intervals) > 0) {
            $mtbf = round(array_sum($intervals) / count($intervals) / 3600, 2); // hours
        }

        return [
            'mttr' => $mttr,
            'mtbf' => $mtbf,
            'mttrUnit' => 'hours',
            'mtbfUnit' => 'hours',
        ];
    }

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
