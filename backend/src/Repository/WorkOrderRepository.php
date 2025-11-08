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
}
