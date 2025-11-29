<?php

declare(strict_types=1);

namespace App\MessageHandler;

use App\Entity\Report;
use App\Message\GenerateReportMessage;
use App\Repository\ReportRepository;
use App\Service\Report\ReportGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles asynchronous report generation.
 * Processes GenerateReportMessage and delegates to ReportGenerator service.
 */
#[AsMessageHandler]
final readonly class GenerateReportHandler
{
    public function __construct(
        private ReportGenerator $reportGenerator,
        private ReportRepository $reportRepository,
        private EntityManagerInterface $entityManager,
        private LoggerInterface $logger,
    ) {
    }

    public function __invoke(GenerateReportMessage $message): void
    {
        // Load Report entity
        $report = $this->reportRepository->find($message->reportId);
        
        if (!$report) {
            $this->logger->error('Report entity not found', ['reportId' => $message->reportId]);
            return;
        }

        $this->logger->info('Starting report generation', [
            'reportId' => $report->getId(),
            'type' => $message->reportType,
            'format' => $message->format,
            'user' => $report->getUser()->getEmail(),
        ]);

        // Update status to processing
        $report->setStatus('processing');
        $this->entityManager->flush();

        try {
            $filePath = $this->reportGenerator->generate(
                reportType: $message->reportType,
                format: $message->format,
                filters: $message->filters,
                outputPath: $message->outputPath,
            );

            // Update report as completed
            $report->setStatus('completed');
            $report->setFileName(basename($filePath));
            $report->setCompletedAt(new \DateTimeImmutable());
            $this->entityManager->flush();

            $this->logger->info('Report generated successfully', [
                'reportId' => $report->getId(),
                'fileName' => $report->getFileName(),
                'filePath' => $filePath,
            ]);

            // TODO: Send push notification or email
            // $this->commandBus->dispatch(new SendPushNotificationMessage(
            //     userId: $report->getUser()->getId(),
            //     title: 'notification.report_ready.title',
            //     body: 'notification.report_ready.body',
            //     data: ['reportId' => $report->getId()]
            // ));

        } catch (\Exception $e) {
            // Update report as failed
            $report->setStatus('failed');
            $report->setErrorMessage($e->getMessage());
            $this->entityManager->flush();

            $this->logger->error('Report generation failed', [
                'reportId' => $report->getId(),
                'type' => $message->reportType,
                'format' => $message->format,
                'error' => $e->getMessage(),
            ]);

            // TODO: Send error notification
            // $this->commandBus->dispatch(new SendPushNotificationMessage(
            //     userId: $report->getUser()->getId(),
            //     title: 'notification.report_failed.title',
            //     body: 'notification.report_failed.body',
            //     data: ['reportId' => $report->getId(), 'error' => $e->getMessage()]
            // ));

            throw $e; // Re-throw to trigger Messenger retry mechanism
        }
    }
}
