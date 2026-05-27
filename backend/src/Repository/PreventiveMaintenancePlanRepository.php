<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\PreventiveMaintenancePlan;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PreventiveMaintenancePlan>
 */
class PreventiveMaintenancePlanRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PreventiveMaintenancePlan::class);
    }

    /**
     * @return array<int, PreventiveMaintenancePlan>
     */
    public function findDuePlans(DateTime $now): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.isActive = :active')
            ->andWhere('p.nextDueAt IS NOT NULL')
            ->andWhere('p.nextDueAt <= :now')
            ->setParameter('active', true)
            ->setParameter('now', $now)
            ->orderBy('p.nextDueAt', 'ASC')
            ->getQuery()
            ->getResult();
    }
}