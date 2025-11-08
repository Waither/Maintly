<?php

namespace App\Repository;

use App\Entity\WorkOrderStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<WorkOrderStatus>
 */
class WorkOrderStatusRepository extends ServiceEntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, WorkOrderStatus::class);
    }

    /**
     * @return WorkOrderStatus[]
     */
    public function findAllOrdered(): array {
        return $this->createQueryBuilder('s')
            ->orderBy('s.displayOrder', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
