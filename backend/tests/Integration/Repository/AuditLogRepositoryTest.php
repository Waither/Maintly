<?php

declare(strict_types=1);

namespace App\Tests\Integration\Repository;

use App\Entity\AuditLog;
use App\Repository\AuditLogRepository;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class AuditLogRepositoryTest extends KernelTestCase {
    private \Doctrine\ORM\EntityManagerInterface $em;
    private AuditLogRepository $repo;

    protected function setUp(): void {
        self::bootKernel();
        $this->em = static::getContainer()->get('doctrine')->getManager();
        $this->repo = $this->em->getRepository(AuditLog::class);
        $this->em->getConnection()->beginTransaction();
    }

    protected function tearDown(): void {
        $this->em->getConnection()->rollBack();
        parent::tearDown();
    }

    private function createAuditLog(string $action, string $entityType, int $entityId, string $ip = '127.0.0.1'): AuditLog {
        $log = new AuditLog();
        $log->setAction($action);
        $log->setEntityType($entityType);
        $log->setEntityId($entityId);
        $log->setIpAddress($ip);
        $this->em->persist($log);
        $this->em->flush();

        return $log;
    }

    public function testFindWithFiltersNoFilters(): void {
        $this->createAuditLog('created', 'Equipment', 1);

        $results = $this->repo->findWithFilters([]);
        $this->assertNotEmpty($results);
    }

    public function testFindWithFiltersActionFilter(): void {
        $this->createAuditLog('custom_action_xyz', 'Equipment', 99);

        $results = $this->repo->findWithFilters(['action' => 'custom_action_xyz']);
        $this->assertNotEmpty($results);
        foreach ($results as $r) {
            $this->assertSame('custom_action_xyz', $r->getAction());
        }
    }

    public function testFindWithFiltersEntityTypeFilter(): void {
        $this->createAuditLog('created', 'SpecialEntity', 77);

        $results = $this->repo->findWithFilters(['entityType' => 'SpecialEntity']);
        foreach ($results as $r) {
            $this->assertSame('SpecialEntity', $r->getEntityType());
        }
    }

    public function testFindWithFiltersEntityIdFilter(): void {
        $this->createAuditLog('created', 'Foo', 9999);

        $results = $this->repo->findWithFilters(['entityId' => 9999]);
        $this->assertNotEmpty($results);
        foreach ($results as $r) {
            $this->assertSame(9999, $r->getEntityId());
        }
    }

    public function testFindWithFiltersIpFilter(): void {
        $this->createAuditLog('created', 'Bar', 1, '192.168.1.100');

        $results = $this->repo->findWithFilters(['ipAddress' => '192.168.1.100']);
        $this->assertNotEmpty($results);
        foreach ($results as $r) {
            $this->assertSame('192.168.1.100', $r->getIpAddress());
        }
    }

    public function testCountWithFilters(): void {
        $this->createAuditLog('count_test_action', 'CountEntity', 1);
        $this->createAuditLog('count_test_action', 'CountEntity', 2);

        $count = $this->repo->countWithFilters(['action' => 'count_test_action', 'entityType' => 'CountEntity']);
        $this->assertGreaterThanOrEqual(2, $count);
    }

    public function testGetDistinctActions(): void {
        $this->createAuditLog('distinct_action_A', 'X', 1);
        $this->createAuditLog('distinct_action_B', 'X', 1);

        $actions = $this->repo->getDistinctActions();
        $this->assertContains('distinct_action_A', $actions);
        $this->assertContains('distinct_action_B', $actions);
    }

    public function testGetDistinctEntityTypes(): void {
        $this->createAuditLog('created', 'UniqueEntityType99', 1);

        $types = $this->repo->getDistinctEntityTypes();
        $this->assertContains('UniqueEntityType99', $types);
    }
}
