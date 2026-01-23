<?php

namespace App\Repository;

use App\Entity\WorkOrder;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<WorkOrder>
 */
class WorkOrderRepository extends ServiceEntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, WorkOrder::class);
    }

    /**
     * Find all work orders (excluding soft-deleted).
     *
     * @return WorkOrder[]
     */
    public function findAllActive(): array {
        return $this->createQueryBuilder('w')
            ->where('w.deletedAt IS NULL')
            ->orderBy('w.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find work orders created by specific user.
     *
     * @return WorkOrder[]
     */
    public function findByCreator(int $userId): array {
        return $this->createQueryBuilder('w')
            ->where('w.deletedAt IS NULL')
            ->andWhere('w.createdBy = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('w.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find work orders with optional filters.
     *
     * @return WorkOrder[]
     */
    public function findWithFilters(?int $userId = null, ?string $statusName = null, ?string $priorityName = null): array {
        $qb = $this->createQueryBuilder('w')
            ->leftJoin('w.status', 's')
            ->leftJoin('w.priority', 'p')
            ->where('w.deletedAt IS NULL');

        if ($userId !== null) {
            $qb->andWhere('w.createdBy = :userId')
               ->setParameter('userId', $userId);
        }

        if ($statusName !== null && $statusName !== '') {
            $qb->andWhere('s.name = :statusName')
               ->setParameter('statusName', $statusName);
        }

        if ($priorityName !== null && $priorityName !== '') {
            $qb->andWhere('p.name = :priorityName')
               ->setParameter('priorityName', $priorityName);
        }

        return $qb->orderBy('w.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
