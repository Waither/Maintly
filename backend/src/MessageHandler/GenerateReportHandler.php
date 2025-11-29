<?php

declare(strict_types=1);

namespace App\MessageHandler;

use App\Entity\Notification;
use App\Entity\Report;
use App\Message\EmailNotificationMessage;
use App\Message\GenerateReportMessage;
use App\Repository\ReportRepository;
use App\Service\Report\ReportGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\MessageBusInterface;

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
        private MessageBusInterface $messageBus,
        #[Autowire('%env(DEFAULT_URI)%')]
        private string $appUrl,
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

        $user = $report->getUser();

        $this->logger->info('Starting report generation', [
            'reportId' => $report->getId(),
            'type' => $message->reportType,
            'format' => $message->format,
            'user' => $user->getEmail(),
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

            // Create in-app notification
            $notification = new Notification();
            $notification->setUser($user);
            $notification->setType('report_completed');
            $notification->setTitle('Raport został wygenerowany');
            $notification->setMessage(sprintf(
                'Raport "%s" w formacie %s jest gotowy do pobrania.',
                $this->translateReportType($message->reportType),
                strtoupper($message->format)
            ));
            $notification->setData([
                'reportId' => $report->getId(),
                'reportType' => $message->reportType,
                'format' => $message->format,
                'fileName' => $report->getFileName(),
            ]);

            $this->entityManager->persist($notification);
            $this->entityManager->flush();

            // Send email notification
            $downloadUrl = $this->appUrl . '/api/reports/' . $report->getId() . '/download';
            
            $this->messageBus->dispatch(new EmailNotificationMessage(
                to: $user->getEmail(),
                subject: 'Raport został wygenerowany - Maintly',
                template: 'emails/report_completed.html.twig',
                context: [
                    'userName' => $user->getFirstName() . ' ' . $user->getLastName(),
                    'reportType' => $this->translateReportType($message->reportType),
                    'reportFormat' => $message->format,
                    'completedAt' => $report->getCompletedAt(),
                    'filters' => $message->filters,
                    'downloadUrl' => $downloadUrl,
                ],
            ));

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

            // Create in-app notification for failure
            $notification = new Notification();
            $notification->setUser($user);
            $notification->setType('report_failed');
            $notification->setTitle('Błąd generowania raportu');
            $notification->setMessage(sprintf(
                'Nie udało się wygenerować raportu "%s". Błąd: %s',
                $this->translateReportType($message->reportType),
                $e->getMessage()
            ));
            $notification->setData([
                'reportId' => $report->getId(),
                'reportType' => $message->reportType,
                'format' => $message->format,
                'error' => $e->getMessage(),
            ]);

            $this->entityManager->persist($notification);
            $this->entityManager->flush();

            // Send error email notification
            $this->messageBus->dispatch(new EmailNotificationMessage(
                to: $user->getEmail(),
                subject: 'Błąd generowania raportu - Maintly',
                template: 'emails/report_failed.html.twig',
                context: [
                    'userName' => $user->getFirstName() . ' ' . $user->getLastName(),
                    'reportType' => $this->translateReportType($message->reportType),
                    'reportFormat' => $message->format,
                    'attemptedAt' => new \DateTimeImmutable(),
                    'errorMessage' => $e->getMessage(),
                    'appUrl' => $this->appUrl,
                ],
            ));

            throw $e; // Re-throw to trigger Messenger retry mechanism
        }
    }

    /**
     * Translate report type to human-readable Polish name
     */
    private function translateReportType(string $type): string
    {
        return match ($type) {
            'maintenance' => 'Raport zleceń konserwacji',
            'equipment' => 'Raport sprzętu',
            'users' => 'Raport użytkowników',
            default => ucfirst($type),
        };
    }
}
