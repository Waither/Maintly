<?php

namespace App\Repository;

use App\Entity\WorkOrderPriority;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<WorkOrderPriority>
 */
class WorkOrderPriorityRepository extends ServiceEntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, WorkOrderPriority::class);
    }

    /**
     * @return WorkOrderPriority[]
     */
    public function findAllOrdered(): array {
        return $this->createQueryBuilder('p')
            ->orderBy('p.displayOrder', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
