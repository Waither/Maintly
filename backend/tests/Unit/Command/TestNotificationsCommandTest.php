<?php

declare(strict_types=1);

namespace App\Tests\Unit\Command;

use App\Command\TestNotificationsCommand;
use App\Entity\Report;
use App\Entity\User;
use App\Message\GenerateReportMessage;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Component\Messenger\MessageBusInterface;

class TestNotificationsCommandTest extends TestCase {
    private TestNotificationsCommand $command;
    private CommandTester $commandTester;
    private EntityManagerInterface $entityManager;
    private MessageBusInterface $messageBus;
    private UserRepository $userRepository;

    protected function setUp(): void {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->messageBus = $this->createMock(MessageBusInterface::class);
        $this->userRepository = $this->createMock(UserRepository::class);

        $this->command = new TestNotificationsCommand(
            $this->entityManager,
            $this->messageBus,
            $this->userRepository,
            sys_get_temp_dir(),
        );

        $application = new Application();
        $application->add($this->command);

        $this->commandTester = new CommandTester($application->find('app:test-notifications'));
    }

    public function testExecuteFailsWhenUserDoesNotExist(): void {
        $this->userRepository->method('find')->with(1)->willReturn(null);

        $statusCode = $this->commandTester->execute([]);

        $this->assertSame(Command::FAILURE, $statusCode);
        $this->assertStringContainsString('User with ID 1 not found', $this->commandTester->getDisplay());
    }

    public function testExecutePersistsReportAndDispatchesMessage(): void {
        $user = new User();
        $user->setEmail('admin@maintly.com');
        $this->userRepository->method('find')->with(1)->willReturn($user);

        $this->entityManager->expects($this->once())
            ->method('persist')
            ->with($this->isInstanceOf(Report::class))
            ->willReturnCallback(function (Report $report): void {
                $reflection = new \ReflectionProperty($report, 'id');
                $reflection->setValue($report, 123);
            });

        $this->entityManager->expects($this->once())->method('flush');

        $this->messageBus->expects($this->once())
            ->method('dispatch')
            ->with($this->callback(function (GenerateReportMessage $message): bool {
                return $message->reportId === 123
                    && $message->reportType === 'maintenance'
                    && $message->format === 'pdf';
            }));

        $statusCode = $this->commandTester->execute([]);

        $this->assertSame(Command::SUCCESS, $statusCode);
        $this->assertStringContainsString('Dispatched GenerateReportMessage', $this->commandTester->getDisplay());
    }

    public function testCommandName(): void {
        $this->assertSame('app:test-notifications', $this->command->getName());
    }

    public function testCommandDescription(): void {
        $this->assertNotEmpty($this->command->getDescription());
    }
}
