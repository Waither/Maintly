<?php

namespace App\Command;

use App\Entity\Report;
use App\Entity\User;
use App\Message\GenerateReportMessage;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsCommand(
    name: 'app:test-notifications',
    description: 'Test complete notification + email flow (creates Report entity, dispatches to queue, worker processes)',
)]
class TestNotificationsCommand extends Command {
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly MessageBusInterface $messageBus,
        private readonly UserRepository $userRepository,
        private readonly string $reportsDir,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int {
        $io = new SymfonyStyle($input, $output);

        $io->title('Testing Notifications + Email Flow');

        // 1. Get test user
        $user = $this->userRepository->find(1); // admin@maintly.com

        if (!$user) {
            $io->error('User with ID 1 not found. Please create a user first.');

            return Command::FAILURE;
        }

        $io->info("Using test user: {$user->getEmail()}");

        // 2. Create Report entity
        $report = new Report();
        $report->setUser($user);
        $report->setReportType('maintenance');
        $report->setFormat('pdf');
        $report->setFilters(['status' => 'completed', 'dateFrom' => '2025-01-01']);
        $report->setStatus('pending');

        $this->entityManager->persist($report);
        $this->entityManager->flush();

        $io->success("Created Report entity with ID: {$report->getId()}");

        // 3. Dispatch GenerateReportMessage to async queue
        $this->messageBus->dispatch(new GenerateReportMessage(
            reportId: $report->getId(),
            reportType: 'maintenance',
            format: 'pdf',
            filters: ['status' => 'completed', 'dateFrom' => '2025-01-01'],
            outputPath: $this->reportsDir . '/test_notification_' . time() . '.pdf',
        ));

        $io->success('Dispatched GenerateReportMessage to async queue');

        // 4. Instructions
        $io->section('What happens next:');
        $io->listing([
            'Worker will pick up the message from async transport',
            'GenerateReportHandler will generate the PDF',
            'Report status will be updated to "completed"',
            'Notification entity will be created in database',
            'Email will be sent via Mailhog',
        ]);

        $io->info('Check Mailhog UI: http://localhost:8025');
        $io->info('Check Report status: SELECT * FROM reports WHERE id = ' . $report->getId());
        $io->info('Check Notifications: SELECT * FROM notifications WHERE user_id = ' . $user->getId());

        return Command::SUCCESS;
    }
}
