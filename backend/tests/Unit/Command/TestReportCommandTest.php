<?php

declare(strict_types=1);

namespace App\Tests\Unit\Command;

use App\Command\TestReportCommand;
use App\Repository\EquipmentRepository;
use App\Repository\UserRepository;
use App\Repository\WorkOrderRepository;
use App\Service\Report\Formatter\CsvReportFormatter;
use App\Service\Report\Formatter\ExcelReportFormatter;
use App\Service\Report\Formatter\PdfReportFormatter;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;
use Twig\Environment;
use Twig\Loader\ArrayLoader;

class TestReportCommandTest extends TestCase {
    private TestReportCommand $command;
    private CommandTester $commandTester;
    private WorkOrderRepository $workOrderRepository;
    private EquipmentRepository $equipmentRepository;
    private UserRepository $userRepository;

    protected function setUp(): void {
        $this->workOrderRepository = $this->createMock(WorkOrderRepository::class);
        $this->equipmentRepository = $this->createMock(EquipmentRepository::class);
        $this->userRepository = $this->createMock(UserRepository::class);

        $twig = new Environment(new ArrayLoader([
            'reports/maintenance.html.twig' => '<html><body>{{ title }}</body></html>',
        ]));

        $this->command = new TestReportCommand(
            new PdfReportFormatter($twig),
            new ExcelReportFormatter(),
            new CsvReportFormatter(),
            $this->workOrderRepository,
            $this->equipmentRepository,
            $this->userRepository,
            sys_get_temp_dir(),
        );

        $application = new Application();
        $application->add($this->command);

        $this->commandTester = new CommandTester($application->find('app:test-report'));
    }

    public function testExecuteFailsForInvalidFormat(): void {
        $statusCode = $this->commandTester->execute([
            'format' => 'xml',
            'type' => 'maintenance',
        ]);

        $this->assertSame(Command::FAILURE, $statusCode);
        $this->assertStringContainsString('Invalid format', $this->commandTester->getDisplay());
    }

    public function testExecuteFailsForInvalidReportType(): void {
        $statusCode = $this->commandTester->execute([
            'format' => 'pdf',
            'type' => 'invalid',
        ]);

        $this->assertSame(Command::FAILURE, $statusCode);
        $this->assertStringContainsString('Invalid report type', $this->commandTester->getDisplay());
    }

    public function testExecuteFailsWhenNoDataFound(): void {
        $this->workOrderRepository->method('findAllActive')->willReturn([]);

        $statusCode = $this->commandTester->execute([
            'format' => 'pdf',
            'type' => 'maintenance',
        ]);

        $this->assertSame(Command::FAILURE, $statusCode);
        $this->assertStringContainsString('No data found in database', $this->commandTester->getDisplay());
    }

    public function testCommandName(): void {
        $this->assertSame('app:test-report', $this->command->getName());
    }

    public function testCommandDescription(): void {
        $this->assertNotEmpty($this->command->getDescription());
    }
}
