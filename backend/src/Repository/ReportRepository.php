<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Report;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Report>
 */
class ReportRepository extends ServiceEntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, Report::class);
    }

    /**
     * Find all reports for a specific user.
     *
     * @return Report[]
     */
    public function findByUser(User $user, int $limit = 50, int $offset = 0): array {
        return $this->createQueryBuilder('r')
            ->where('r.user = :user')
            ->setParameter('user', $user)
            ->orderBy('r.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    /**
     * Count reports for a specific user.
     */
    public function countByUser(User $user): int {
        return (int) $this->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->where('r.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Find old completed reports for cleanup.
     *
     * @return Report[]
     */
    public function findOldCompletedReports(int $daysOld = 30): array {
        $cutoffDate = new DateTimeImmutable("-{$daysOld} days");

        return $this->createQueryBuilder('r')
            ->where('r.status = :status')
            ->andWhere('r.completedAt < :cutoffDate')
            ->setParameter('status', 'completed')
            ->setParameter('cutoffDate', $cutoffDate)
            ->getQuery()
            ->getResult();
    }
}
