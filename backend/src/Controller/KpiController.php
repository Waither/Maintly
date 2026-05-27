<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Repository\EquipmentRepository;
use App\Repository\WorkOrderRepository;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/kpi', name: 'kpi_')]
#[IsGranted('IS_AUTHENTICATED_FULLY')]
class KpiController extends AbstractController
{
    use ApiResponseTrait;

    public function __construct(
        private WorkOrderRepository $workOrderRepository,
        private EquipmentRepository $equipmentRepository,
    ) {}

    /**
     * GET /api/kpi/stats?dateFrom=2026-01-01&dateTo=2026-12-31
     *
     * Returns:
     *  - workOrders: counts by status, overdue, by priority
     *  - trend: work orders created per month in period
     *  - topEquipment: top 8 by WO count
     *  - kpi: MTTR, MTBF
     *  - equipment: total + top by work time
     */
    #[Route('/stats', name: 'stats', methods: ['GET'])]
    public function stats(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $filterUserId = $user->getUserRole()->getName() === 'provider' ? $user->getId() : null;

        $rawFrom = $request->query->get('dateFrom');
        $rawTo   = $request->query->get('dateTo');

        try {
            $dateFrom = $rawFrom ? new DateTime((string) $rawFrom) : new DateTime('first day of January this year');
            $dateTo   = $rawTo   ? new DateTime((string) $rawTo)   : new DateTime('today');
        } catch (\Throwable) {
            return $this->validationErrorResponse('Nieprawidłowy format daty', [
                'dateFrom' => 'Use format YYYY-MM-DD',
                'dateTo' => 'Use format YYYY-MM-DD',
            ]);
        }

        if ($dateFrom > $dateTo) {
            return $this->validationErrorResponse('Nieprawidłowy zakres dat', [
                'dateFrom' => 'dateFrom must be earlier than or equal to dateTo',
                'dateTo' => 'dateTo must be later than or equal to dateFrom',
            ]);
        }

        $dateTo->setTime(23, 59, 59);

        return $this->json([
            'period'       => [
                'from' => $dateFrom->format('Y-m-d'),
                'to'   => $dateTo->format('Y-m-d'),
            ],
            'workOrders'   => $this->workOrderStats($dateFrom, $dateTo, $filterUserId),
            'trend'        => $this->workOrderMonthlyTrend($dateFrom, $dateTo, $filterUserId),
            'topEquipment' => $this->topEquipmentByWo($dateFrom, $dateTo, $filterUserId),
            'kpi'          => $this->kpiStats($dateFrom, $dateTo, $filterUserId),
            'equipment'    => $this->equipmentStats(),
        ]);
    }

    // -----------------------------------------------------------------

    /** @return array<string, mixed> */
    private function workOrderStats(DateTime $from, DateTime $to, ?int $userId): array
    {
        $qb = $this->workOrderRepository->createQueryBuilder('wo')
            ->select(
                'COUNT(wo.id)                                                          AS total',
                "SUM(CASE WHEN s.name = 'open'        THEN 1 ELSE 0 END)              AS open_count",
                "SUM(CASE WHEN s.name = 'in_progress' THEN 1 ELSE 0 END)              AS in_progress_count",
                "SUM(CASE WHEN s.name = 'completed'   THEN 1 ELSE 0 END)              AS completed_count",
                "SUM(CASE WHEN s.name = 'cancelled'   THEN 1 ELSE 0 END)              AS cancelled_count",
                "SUM(CASE WHEN s.name = 'on_hold'     THEN 1 ELSE 0 END)              AS on_hold_count",
                "SUM(CASE WHEN s.isFinal = FALSE AND wo.plannedEndDate < :now THEN 1 ELSE 0 END) AS overdue_count",
                "SUM(CASE WHEN p.name = 'critical'    THEN 1 ELSE 0 END)              AS critical_count",
                "SUM(CASE WHEN p.name = 'high'        THEN 1 ELSE 0 END)              AS high_count",
                "SUM(CASE WHEN p.name = 'medium'      THEN 1 ELSE 0 END)              AS medium_count",
                "SUM(CASE WHEN p.name = 'low'         THEN 1 ELSE 0 END)              AS low_count",
            )
            ->leftJoin('wo.status', 's')
            ->leftJoin('wo.priority', 'p')
            ->where('wo.deletedAt IS NULL')
            ->andWhere('wo.createdAt >= :from')
            ->andWhere('wo.createdAt <= :to')
            ->setParameter('from', $from)
            ->setParameter('to', $to)
            ->setParameter('now', new DateTime());

        if ($userId !== null) {
            $qb->andWhere('wo.createdBy = :userId')->setParameter('userId', $userId);
        }

        $row = $qb->getQuery()->getSingleResult();

        $total     = (int) $row['total'];
        $completed = (int) $row['completed_count'];

        return [
            'total'            => $total,
            'open'             => (int) $row['open_count'],
            'inProgress'       => (int) $row['in_progress_count'],
            'completed'        => $completed,
            'cancelled'        => (int) $row['cancelled_count'],
            'onHold'           => (int) $row['on_hold_count'],
            'overdue'          => (int) $row['overdue_count'],
            'completionRate'   => $total > 0 ? round($completed / $total * 100, 1) : 0,
            'byPriority'       => [
                'critical' => (int) $row['critical_count'],
                'high'     => (int) $row['high_count'],
                'medium'   => (int) $row['medium_count'],
                'low'      => (int) $row['low_count'],
            ],
        ];
    }

    /**
     * Work orders created per month in period – for trend chart.
     *
     * @return array<int, array{month: string, created: int, completed: int}>
     */
    private function workOrderMonthlyTrend(DateTime $from, DateTime $to, ?int $userId): array
    {
        $qbCreated = $this->workOrderRepository->createQueryBuilder('wo')
            ->select(
                'SUBSTRING(wo.createdAt, 1, 7) AS ym',
                'COUNT(wo.id)                   AS cnt',
            )
            ->where('wo.deletedAt IS NULL')
            ->andWhere('wo.createdAt >= :from')
            ->andWhere('wo.createdAt <= :to')
            ->groupBy('ym')
            ->orderBy('ym', 'ASC')
            ->setParameter('from', $from)
            ->setParameter('to', $to);

        if ($userId !== null) {
            $qbCreated->andWhere('wo.createdBy = :userId')->setParameter('userId', $userId);
        }

        $qbCompleted = $this->workOrderRepository->createQueryBuilder('wo')
            ->select(
                'SUBSTRING(wo.actualEndDate, 1, 7) AS ym',
                'COUNT(wo.id)                       AS cnt',
            )
            ->leftJoin('wo.status', 's')
            ->where('wo.deletedAt IS NULL')
            ->andWhere("s.name = 'completed'")
            ->andWhere('wo.actualEndDate >= :from')
            ->andWhere('wo.actualEndDate <= :to')
            ->groupBy('ym')
            ->orderBy('ym', 'ASC')
            ->setParameter('from', $from)
            ->setParameter('to', $to);

        if ($userId !== null) {
            $qbCompleted->andWhere('wo.createdBy = :userId')->setParameter('userId', $userId);
        }

        $createdMap   = [];
        foreach ($qbCreated->getQuery()->getResult() as $row) {
            if ($row['ym']) {
                $createdMap[$row['ym']] = (int) $row['cnt'];
            }
        }

        $completedMap = [];
        foreach ($qbCompleted->getQuery()->getResult() as $row) {
            if ($row['ym']) {
                $completedMap[$row['ym']] = (int) $row['cnt'];
            }
        }

        // Build a full list of months in the period
        $months  = [];
        $current = (clone $from)->modify('first day of this month');
        $end     = (clone $to)->modify('first day of this month');

        while ($current <= $end) {
            $ym       = $current->format('Y-m');
            $months[] = [
                'month'     => $ym,
                'created'   => $createdMap[$ym]   ?? 0,
                'completed' => $completedMap[$ym] ?? 0,
            ];
            $current->modify('+1 month');
        }

        return $months;
    }

    /**
     * Top 8 equipment by number of work orders in period.
     *
     * @return array<int, array{id: int, name: string, count: int}>
     */
    private function topEquipmentByWo(DateTime $from, DateTime $to, ?int $userId): array
    {
        $qb = $this->workOrderRepository->createQueryBuilder('wo')
            ->select('e.id, e.name, COUNT(wo.id) AS cnt')
            ->leftJoin('wo.equipment', 'e')
            ->where('wo.deletedAt IS NULL')
            ->andWhere('wo.createdAt >= :from')
            ->andWhere('wo.createdAt <= :to')
            ->andWhere('e.id IS NOT NULL')
            ->groupBy('e.id')
            ->orderBy('cnt', 'DESC')
            ->setMaxResults(8)
            ->setParameter('from', $from)
            ->setParameter('to', $to);

        if ($userId !== null) {
            $qb->andWhere('wo.createdBy = :userId')->setParameter('userId', $userId);
        }

        return array_map(static fn ($r) => [
            'id'    => $r['id'],
            'name'  => $r['name'],
            'count' => (int) $r['cnt'],
        ], $qb->getQuery()->getResult());
    }

    /**
     * MTTR and MTBF for the period.
     *
     * @return array{mttr: float|null, mtbf: float|null, unit: string}
     */
    private function kpiStats(DateTime $from, DateTime $to, ?int $userId): array
    {
        // MTTR – avg hours from createdAt to actualEndDate (or updatedAt) for final orders in period
        $qb = $this->workOrderRepository->createQueryBuilder('wo')
            ->select('wo.createdAt, wo.actualEndDate, wo.updatedAt')
            ->leftJoin('wo.status', 's')
            ->where('s.isFinal = :final')
            ->andWhere('wo.deletedAt IS NULL')
            ->andWhere('wo.createdAt >= :from')
            ->andWhere('wo.createdAt <= :to')
            ->setParameter('final', true)
            ->setParameter('from', $from)
            ->setParameter('to', $to);

        if ($userId !== null) {
            $qb->andWhere('wo.createdBy = :userId')->setParameter('userId', $userId);
        }

        $finalOrders = $qb->getQuery()->getResult();
        $mttr        = null;

        if (count($finalOrders) > 0) {
            $totalSeconds = 0;
            $counted      = 0;
            foreach ($finalOrders as $row) {
                $end = $row['actualEndDate'] ?? $row['updatedAt'];
                if ($end instanceof \DateTime && $row['createdAt'] instanceof \DateTime) {
                    $totalSeconds += $end->getTimestamp() - $row['createdAt']->getTimestamp();
                    ++$counted;
                }
            }
            if ($counted > 0) {
                $mttr = round($totalSeconds / $counted / 3600, 2);
            }
        }

        // MTBF – avg hours between consecutive completed WO per equipment
        $qb2 = $this->workOrderRepository->createQueryBuilder('wo')
            ->select('IDENTITY(wo.equipment) AS equipmentId, wo.actualEndDate, wo.updatedAt')
            ->leftJoin('wo.status', 's')
            ->where('s.isFinal = :final')
            ->andWhere('wo.deletedAt IS NULL')
            ->andWhere('wo.createdAt >= :from')
            ->andWhere('wo.createdAt <= :to')
            ->orderBy('IDENTITY(wo.equipment)', 'ASC')
            ->addOrderBy('wo.createdAt', 'ASC')
            ->setParameter('final', true)
            ->setParameter('from', $from)
            ->setParameter('to', $to);

        if ($userId !== null) {
            $qb2->andWhere('wo.createdBy = :userId')->setParameter('userId', $userId);
        }

        $intervals           = [];
        $lastEndByEquipment  = [];
        foreach ($qb2->getQuery()->getResult() as $row) {
            $eqId = (int) $row['equipmentId'];
            $end  = $row['actualEndDate'] ?? $row['updatedAt'];
            if ($end instanceof \DateTime) {
                if (isset($lastEndByEquipment[$eqId])) {
                    $intervals[] = $end->getTimestamp() - $lastEndByEquipment[$eqId];
                }
                $lastEndByEquipment[$eqId] = $end->getTimestamp();
            }
        }

        $mtbf = count($intervals) > 0
            ? round(array_sum($intervals) / count($intervals) / 3600, 2)
            : null;

        return [
            'mttr' => $mttr,
            'mtbf' => $mtbf,
            'unit' => 'hours',
        ];
    }

    /** @return array<string, mixed> */
    private function equipmentStats(): array
    {
        $rows = $this->equipmentRepository->createQueryBuilder('e')
            ->select('e.id, e.name, e.directWorkTime, e.totalWorkTime')
            ->where('e.deletedAt IS NULL')
            ->orderBy('e.totalWorkTime', 'DESC')
            ->setMaxResults(8)
            ->getQuery()
            ->getResult();

        $total = (int) $this->equipmentRepository->createQueryBuilder('e')
            ->select('COUNT(e.id)')
            ->where('e.deletedAt IS NULL')
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'total'   => $total,
            'topByWorkTime' => array_map(static fn ($r) => [
                'id'            => $r['id'],
                'name'          => $r['name'],
                'directMinutes' => $r['directWorkTime'],
                'totalMinutes'  => $r['totalWorkTime'],
            ], $rows),
        ];
    }
}
