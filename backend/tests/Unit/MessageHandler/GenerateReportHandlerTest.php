<?php

declare(strict_types=1);

namespace App\Tests\Unit\MessageHandler;

use App\Entity\Notification;
use App\Entity\Report;
use App\Entity\User;
use App\Entity\UserRole;
use App\Message\EmailNotificationMessage;
use App\Message\GenerateReportMessage;
use App\MessageHandler\GenerateReportHandler;
use App\Repository\ReportRepository;
use App\Service\Report\ReportGenerator;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\MessageBusInterface;

class GenerateReportHandlerTest extends TestCase {
    public function testReportNotFoundLogsAndReturns(): void {
        $reportRepository = $this->createMock(ReportRepository::class);
        $reportRepository->method('find')->willReturn(null);

        $reportGenerator = $this->createMock(ReportGenerator::class);
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $logger = $this->createMock(LoggerInterface::class);
        $messageBus = $this->createMock(MessageBusInterface::class);

        $logger->expects($this->once())->method('error');
        $reportGenerator->expects($this->never())->method('generate');
        $entityManager->expects($this->never())->method('flush');
        $messageBus->expects($this->never())->method('dispatch');

        $handler = new GenerateReportHandler(
            $reportGenerator,
            $reportRepository,
            $entityManager,
            $logger,
            $messageBus,
            'http://localhost',
        );

        $handler(new GenerateReportMessage(123, 'maintenance', 'pdf'));
    }

    public function testReportGenerationSuccess(): void {
        $report = $this->createReport();
        $this->setEntityId($report, 10);

        $reportRepository = $this->createMock(ReportRepository::class);
        $reportRepository->method('find')->willReturn($report);

        $reportGenerator = $this->createMock(ReportGenerator::class);
        $reportGenerator->expects($this->once())
            ->method('generate')
            ->willReturn('/tmp/report.pdf');

        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->expects($this->once())
            ->method('persist')
            ->with($this->callback(function ($entity) {
                return $entity instanceof Notification && $entity->getType() === 'report_completed';
            }));
        $entityManager->expects($this->atLeastOnce())->method('flush');

        $logger = $this->createMock(LoggerInterface::class);

        $messageBus = $this->createMock(MessageBusInterface::class);
        $messageBus->expects($this->once())
            ->method('dispatch')
            ->with($this->isInstanceOf(EmailNotificationMessage::class))
            ->willReturnCallback(static fn($message) => new Envelope($message));

        $handler = new GenerateReportHandler(
            $reportGenerator,
            $reportRepository,
            $entityManager,
            $logger,
            $messageBus,
            'http://localhost',
        );

        $handler(new GenerateReportMessage(10, 'maintenance', 'pdf'));

        $this->assertSame('completed', $report->getStatus());
        $this->assertSame('report.pdf', $report->getFileName());
        $this->assertInstanceOf(DateTimeImmutable::class, $report->getCompletedAt());
    }

    public function testReportGenerationFailure(): void {
        $report = $this->createReport();
        $this->setEntityId($report, 11);

        $reportRepository = $this->createMock(ReportRepository::class);
        $reportRepository->method('find')->willReturn($report);

        $reportGenerator = $this->createMock(ReportGenerator::class);
        $reportGenerator->expects($this->once())
            ->method('generate')
            ->willThrowException(new \RuntimeException('boom'));

        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->expects($this->once())
            ->method('persist')
            ->with($this->callback(function ($entity) {
                return $entity instanceof Notification && $entity->getType() === 'report_failed';
            }));
        $entityManager->expects($this->atLeastOnce())->method('flush');

        $logger = $this->createMock(LoggerInterface::class);

        $messageBus = $this->createMock(MessageBusInterface::class);
        $messageBus->expects($this->once())
            ->method('dispatch')
            ->with($this->isInstanceOf(EmailNotificationMessage::class))
            ->willReturnCallback(static fn($message) => new Envelope($message));

        $handler = new GenerateReportHandler(
            $reportGenerator,
            $reportRepository,
            $entityManager,
            $logger,
            $messageBus,
            'http://localhost',
        );

        try {
            $handler(new GenerateReportMessage(11, 'maintenance', 'pdf'));
            $this->fail('Expected exception was not thrown.');
        }
        catch (\RuntimeException $exception) {
            $this->assertSame('boom', $exception->getMessage());
        }

        $this->assertSame('failed', $report->getStatus());
        $this->assertSame('boom', $report->getErrorMessage());
    }

    private function createReport(): Report {
        $role = new UserRole();
        $role->setName('admin');

        $user = new User();
        $user->setEmail('admin@maintly.com');
        $user->setFirstName('Admin');
        $user->setLastName('User');
        $user->setPassword('secret');
        $user->setUserRole($role);

        $report = new Report();
        $report->setUser($user);
        $report->setReportType('maintenance');
        $report->setFormat('pdf');
        $report->setFilters(['status' => 'open']);

        return $report;
    }

    private function setEntityId(object $entity, int $id): void {
        $ref = new \ReflectionProperty($entity, 'id');
        $ref->setAccessible(true);
        $ref->setValue($entity, $id);
    }
}
