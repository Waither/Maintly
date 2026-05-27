<?php

declare(strict_types=1);

namespace App\Tests\Unit\Command;

use App\Command\TestAuditLogCommand;
use App\Service\AuditLogger;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;

class TestAuditLogCommandTest extends TestCase {
    private TestAuditLogCommand $command;
    private CommandTester $commandTester;
    private AuditLogger $auditLogger;

    protected function setUp(): void {
        $this->auditLogger = $this->createMock(AuditLogger::class);

        $this->command = new TestAuditLogCommand($this->auditLogger);

        $application = new Application();
        $application->add($this->command);

        $this->commandTester = new CommandTester($application->find('app:test-audit-log'));
    }

    public function testExecuteSuccessfully(): void {
        $actions = [];
        $this->auditLogger->expects($this->exactly(8))
            ->method('log')
            ->willReturnCallback(function (string $action) use (&$actions): void {
                $actions[] = $action;
            });

        $statusCode = $this->commandTester->execute([]);

        $this->assertSame(Command::SUCCESS, $statusCode);
        $this->assertCount(8, $actions);
        $this->assertContains('work_order.created', $actions);
        $this->assertContains('settings.updated', $actions);
        $this->assertStringContainsString('All sample audit log entries created', $this->commandTester->getDisplay());
    }

    public function testCommandName(): void {
        $this->assertSame('app:test-audit-log', $this->command->getName());
    }

    public function testCommandDescription(): void {
        $this->assertNotEmpty($this->command->getDescription());
    }
}
