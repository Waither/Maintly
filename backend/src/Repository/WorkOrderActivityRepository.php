<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\WorkOrderActivity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<WorkOrderActivity>
 */
class WorkOrderActivityRepository extends ServiceEntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, WorkOrderActivity::class);
    }
}
