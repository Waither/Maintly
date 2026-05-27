<?php

declare(strict_types=1);

namespace App\Tests\Unit\Command;

use App\Command\GenerateReportCommand;
use App\Service\Report\ReportGenerator;
use Exception;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;

class GenerateReportCommandTest extends TestCase {
    private GenerateReportCommand $command;
    private CommandTester $commandTester;
    private ReportGenerator $reportGenerator;

    protected function setUp(): void {
        $this->reportGenerator = $this->createMock(ReportGenerator::class);

        $this->command = new GenerateReportCommand($this->reportGenerator);

        $application = new Application();
        $application->add($this->command);

        $this->commandTester = new CommandTester($application->find('app:generate-report'));
    }

    public function testExecuteWithValidArguments(): void {
        $tmpFile = tempnam(sys_get_temp_dir(), 'report_');
        self::assertNotFalse($tmpFile);
        file_put_contents($tmpFile, 'content');

        $this->reportGenerator->expects($this->once())
            ->method('generate')
            ->with(
                'maintenance',
                'pdf',
                [
                    'status' => 'completed',
                    'dateFrom' => '2026-01-01',
                    'dateTo' => '2026-12-31',
                    'equipmentId' => '12',
                    'costCenter' => 'CC-100',
                    'role' => 'ROLE_ADMIN',
                ],
                '/tmp',
            )
            ->willReturn($tmpFile);

        $statusCode = $this->commandTester->execute([
            'type' => 'maintenance',
            'format' => 'pdf',
            '--status' => 'completed',
            '--date-from' => '2026-01-01',
            '--date-to' => '2026-12-31',
            '--equipment-id' => '12',
            '--cost-center' => 'CC-100',
            '--role' => 'ROLE_ADMIN',
            '--output' => '/tmp',
        ]);

        $this->assertSame(Command::SUCCESS, $statusCode);
        $this->assertStringContainsString('Report generated successfully', $this->commandTester->getDisplay());

        unlink($tmpFile);
    }

    public function testExecuteFailsForInvalidReportType(): void {
        $this->reportGenerator->expects($this->never())->method('generate');

        $statusCode = $this->commandTester->execute([
            'type' => 'invalid-type',
            'format' => 'pdf',
        ]);

        $this->assertSame(Command::FAILURE, $statusCode);
        $this->assertStringContainsString('Invalid report type', $this->commandTester->getDisplay());
    }

    public function testExecuteFailsForInvalidFormat(): void {
        $this->reportGenerator->expects($this->never())->method('generate');

        $statusCode = $this->commandTester->execute([
            'type' => 'maintenance',
            'format' => 'xml',
        ]);

        $this->assertSame(Command::FAILURE, $statusCode);
        $this->assertStringContainsString('Invalid format', $this->commandTester->getDisplay());
    }

    public function testExecuteHandlesGeneratorException(): void {
        $this->reportGenerator->expects($this->once())
            ->method('generate')
            ->willThrowException(new Exception('boom'));

        $statusCode = $this->commandTester->execute([
            'type' => 'maintenance',
            'format' => 'pdf',
        ]);

        $this->assertSame(Command::FAILURE, $statusCode);
        $this->assertStringContainsString('Report generation failed', $this->commandTester->getDisplay());
    }

    public function testCommandIsNamed(): void {
        $this->assertSame('app:generate-report', $this->command->getName());
    }

    public function testCommandHasDescription(): void {
        $this->assertNotEmpty($this->command->getDescription());
    }
}
