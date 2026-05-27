<?php

declare(strict_types=1);

namespace App\Tests\Unit\Service\Report;

use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use App\Service\Report\Formatter\ReportFormatterInterface;
use App\Service\Report\ReportGenerator;
use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class ReportGeneratorTest extends TestCase {
    private EntityManagerInterface $entityManager;
    private ReportFormatterInterface $formatter;
    private ReportGenerator $generator;
    private string $reportsDir;

    protected function setUp(): void {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->formatter = $this->createMock(ReportFormatterInterface::class);

        $this->formatter->method('getFormat')->willReturn('csv');
        $this->formatter->method('getExtension')->willReturn('csv');

        $this->reportsDir = sys_get_temp_dir() . '/reports_' . uniqid('', true);

        $this->generator = new ReportGenerator(
            $this->entityManager,
            $this->reportsDir,
            [$this->formatter],
        );
    }

    public function testGenerateMaintenanceReportReturnsPathAndFormatsData(): void {
        $status = new WorkOrderStatus();
        $status->setName('Open');

        $priority = new WorkOrderPriority();
        $priority->setName('High');

        $equipment = new Equipment();
        $equipment->setName('Pump A');

        $workOrder = new WorkOrder();
        $workOrder->setTitle('Fix pump');
        $workOrder->setEquipment($equipment);
        $workOrder->setStatus($status);
        $workOrder->setPriority($priority);

        $this->entityManager->method('createQueryBuilder')->willReturn($this->createQueryBuilderMock([$workOrder]));

        $this->formatter->expects($this->once())
            ->method('format')
            ->with(
                $this->callback(static function (array $data): bool {
                    return ($data['title'] ?? '') === 'Work Orders Report'
                        && count($data['rows'] ?? []) === 1
                        && (($data['summary']['total'] ?? 0) === 1);
                }),
                $this->callback(static fn (string $path): bool => str_ends_with($path, '.csv')),
                $this->callback(static fn (array $options): bool => ($options['reportType'] ?? '') === 'maintenance'),
            );

        $filePath = $this->generator->generate('maintenance', 'csv');

        $this->assertStringContainsString($this->reportsDir, $filePath);
        $this->assertStringEndsWith('.csv', $filePath);
    }

    public function testGenerateEquipmentReportAppliesCostCenterFilter(): void {
        $equipment = new Equipment();
        $equipment->setName('Compressor');
        $equipment->setCostCenter('CC-01');

        $qb = $this->createMock(QueryBuilder::class);
        $query = $this->createMock(AbstractQuery::class);

        $qb->method('select')->willReturnSelf();
        $qb->method('from')->willReturnSelf();
        $qb->method('leftJoin')->willReturnSelf();
        $qb->expects($this->once())->method('andWhere')->with('e.costCenter = :costCenter')->willReturnSelf();
        $qb->expects($this->once())->method('setParameter')->with('costCenter', 'CC-01')->willReturnSelf();
        $qb->method('getQuery')->willReturn($query);
        $query->method('getResult')->willReturn([$equipment]);

        $this->entityManager->method('createQueryBuilder')->willReturn($qb);
        $this->formatter->expects($this->once())->method('format');

        $filePath = $this->generator->generate('equipment', 'csv', ['costCenter' => 'CC-01']);

        $this->assertStringEndsWith('.csv', $filePath);
    }

    public function testGenerateUsersReportAppliesRoleFilter(): void {
        $user = new User();
        $user->setEmail('reporter@maintly.com');

        $qb = $this->createMock(QueryBuilder::class);
        $query = $this->createMock(AbstractQuery::class);

        $qb->method('select')->willReturnSelf();
        $qb->method('from')->willReturnSelf();
        $qb->method('leftJoin')->willReturnSelf();
        $qb->expects($this->once())->method('andWhere')->with('r.name = :role')->willReturnSelf();
        $qb->expects($this->once())->method('setParameter')->with('role', 'reporter')->willReturnSelf();
        $qb->method('getQuery')->willReturn($query);
        $query->method('getResult')->willReturn([$user]);

        $this->entityManager->method('createQueryBuilder')->willReturn($qb);
        $this->formatter->expects($this->once())->method('format');

        $filePath = $this->generator->generate('users', 'csv', ['role' => 'reporter']);

        $this->assertStringEndsWith('.csv', $filePath);
    }

    public function testGenerateThrowsForUnsupportedFormat(): void {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Unsupported format: xml');

        $this->generator->generate('maintenance', 'xml');
    }

    public function testGenerateThrowsForUnknownReportType(): void {
        $this->entityManager->expects($this->never())->method('createQueryBuilder');

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Unknown report type: unknown');

        $this->generator->generate('unknown', 'csv');
    }

    public function testGenerateCreatesMissingOutputDirectory(): void {
        $customDir = sys_get_temp_dir() . '/missing_reports_' . uniqid('', true);

        $this->entityManager->method('createQueryBuilder')->willReturn($this->createQueryBuilderMock([]));
        $this->formatter->expects($this->once())->method('format');

        $this->generator->generate('maintenance', 'csv', [], $customDir);

        $this->assertDirectoryExists($customDir);
    }

    private function createQueryBuilderMock(array $rows): QueryBuilder {
        $qb = $this->createMock(QueryBuilder::class);
        $query = $this->createMock(AbstractQuery::class);

        $qb->method('select')->willReturnSelf();
        $qb->method('from')->willReturnSelf();
        $qb->method('leftJoin')->willReturnSelf();
        $qb->method('andWhere')->willReturnSelf();
        $qb->method('setParameter')->willReturnSelf();
        $qb->method('getQuery')->willReturn($query);

        $query->method('getResult')->willReturn($rows);

        return $qb;
    }
}
