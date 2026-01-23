<?php

namespace App\Repository;

use App\Entity\AuditLog;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AuditLog>
 */
class AuditLogRepository extends ServiceEntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, AuditLog::class);
    }

    /**
     * Find logs with filters and pagination.
     *
     * @param array<string, mixed> $filters
     *
     * @return AuditLog[]
     */
    public function findWithFilters(array $filters, int $limit = 50, int $offset = 0): array {
        $qb = $this->createQueryBuilder('a')
            ->orderBy('a.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset);

        // Filter by user
        if (isset($filters['userId'])) {
            $qb->andWhere('a.user = :userId')
                ->setParameter('userId', $filters['userId']);
        }

        // Filter by action
        if (isset($filters['action'])) {
            $qb->andWhere('a.action = :action')
                ->setParameter('action', $filters['action']);
        }

        // Filter by entity type
        if (isset($filters['entityType'])) {
            $qb->andWhere('a.entityType = :entityType')
                ->setParameter('entityType', $filters['entityType']);
        }

        // Filter by entity ID
        if (isset($filters['entityId'])) {
            $qb->andWhere('a.entityId = :entityId')
                ->setParameter('entityId', $filters['entityId']);
        }

        // Filter by date range
        if (isset($filters['startDate'])) {
            $qb->andWhere('a.createdAt >= :startDate')
                ->setParameter('startDate', new DateTimeImmutable($filters['startDate'] . ' 00:00:00'));
        }

        if (isset($filters['endDate'])) {
            // Include the whole end day (until 23:59:59)
            $qb->andWhere('a.createdAt <= :endDate')
                ->setParameter('endDate', new DateTimeImmutable($filters['endDate'] . ' 23:59:59'));
        }

        // Filter by IP address
        if (isset($filters['ipAddress'])) {
            $qb->andWhere('a.ipAddress = :ipAddress')
                ->setParameter('ipAddress', $filters['ipAddress']);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * Count logs with filters.
     *
     * @param array<string, mixed> $filters
     */
    public function countWithFilters(array $filters): int {
        $qb = $this->createQueryBuilder('a')
            ->select('COUNT(a.id)');

        if (isset($filters['userId'])) {
            $qb->andWhere('a.user = :userId')
                ->setParameter('userId', $filters['userId']);
        }

        if (isset($filters['action'])) {
            $qb->andWhere('a.action = :action')
                ->setParameter('action', $filters['action']);
        }

        if (isset($filters['entityType'])) {
            $qb->andWhere('a.entityType = :entityType')
                ->setParameter('entityType', $filters['entityType']);
        }

        if (isset($filters['entityId'])) {
            $qb->andWhere('a.entityId = :entityId')
                ->setParameter('entityId', $filters['entityId']);
        }

        if (isset($filters['startDate'])) {
            $qb->andWhere('a.createdAt >= :startDate')
                ->setParameter('startDate', new DateTimeImmutable($filters['startDate']));
        }

        if (isset($filters['endDate'])) {
            $qb->andWhere('a.createdAt <= :endDate')
                ->setParameter('endDate', new DateTimeImmutable($filters['endDate']));
        }

        if (isset($filters['ipAddress'])) {
            $qb->andWhere('a.ipAddress = :ipAddress')
                ->setParameter('ipAddress', $filters['ipAddress']);
        }

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    /**
     * Get statistics grouped by action.
     *
     * @return array<int, array{action: string, count: int}>
     */
    public function getStatsByAction(?DateTimeImmutable $startDate = null): array {
        $qb = $this->createQueryBuilder('a')
            ->select('a.action', 'COUNT(a.id) as count')
            ->groupBy('a.action')
            ->orderBy('count', 'DESC');

        if ($startDate) {
            $qb->andWhere('a.createdAt >= :startDate')
                ->setParameter('startDate', $startDate);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * Get statistics grouped by user.
     *
     * @return array<int, array{userId: int|null, userEmail: string|null, count: int}>
     */
    public function getStatsByUser(?DateTimeImmutable $startDate = null): array {
        $qb = $this->createQueryBuilder('a')
            ->select('IDENTITY(a.user) as userId', 'u.email as userEmail', 'COUNT(a.id) as count')
            ->leftJoin('a.user', 'u')
            ->groupBy('a.user')
            ->orderBy('count', 'DESC');

        if ($startDate) {
            $qb->andWhere('a.createdAt >= :startDate')
                ->setParameter('startDate', $startDate);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * Delete old audit logs (cleanup).
     */
    public function deleteOlderThan(DateTimeImmutable $date): int {
        return $this->createQueryBuilder('a')
            ->delete()
            ->where('a.createdAt < :date')
            ->setParameter('date', $date)
            ->getQuery()
            ->execute();
    }

    /**
     * Get distinct action types.
     *
     * @return string[]
     */
    public function getDistinctActions(): array {
        $result = $this->createQueryBuilder('a')
            ->select('DISTINCT a.action')
            ->orderBy('a.action', 'ASC')
            ->getQuery()
            ->getScalarResult();

        return array_column($result, 'action');
    }

    /**
     * Get distinct entity types.
     *
     * @return string[]
     */
    public function getDistinctEntityTypes(): array {
        $result = $this->createQueryBuilder('a')
            ->select('DISTINCT a.entityType')
            ->where('a.entityType IS NOT NULL')
            ->orderBy('a.entityType', 'ASC')
            ->getQuery()
            ->getScalarResult();

        return array_column($result, 'entityType');
    }
}
