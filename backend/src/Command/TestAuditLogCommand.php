<?php

declare(strict_types=1);

namespace App\Command;

use App\Service\AuditLogger;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:test-audit-log',
    description: 'Create sample audit log entries for testing',
)]
class TestAuditLogCommand extends Command {
    public function __construct(
        private readonly AuditLogger $auditLogger,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int {
        $io = new SymfonyStyle($input, $output);
        $io->title('Creating Sample Audit Log Entries');

        // Sample actions
        $actions = [
            ['action' => 'work_order.created', 'entityType' => 'WorkOrder', 'entityId' => 1, 'changes' => ['title' => 'New work order', 'status' => 'open']],
            ['action' => 'work_order.updated', 'entityType' => 'WorkOrder', 'entityId' => 1, 'changes' => ['status' => ['from' => 'open', 'to' => 'in_progress']]],
            ['action' => 'work_order.deleted', 'entityType' => 'WorkOrder', 'entityId' => 2, 'metadata' => ['reason' => 'duplicate']],
            ['action' => 'equipment.created', 'entityType' => 'Equipment', 'entityId' => 5, 'changes' => ['name' => 'New CNC Machine']],
            ['action' => 'user.login', 'metadata' => ['success' => true]],
            ['action' => 'user.logout', 'metadata' => []],
            ['action' => 'report.generated', 'entityType' => 'Report', 'entityId' => 3, 'metadata' => ['type' => 'maintenance', 'format' => 'pdf']],
            ['action' => 'settings.updated', 'changes' => ['theme' => ['from' => 'light', 'to' => 'dark']]],
        ];

        foreach ($actions as $data) {
            $this->auditLogger->log(
                action: $data['action'],
                entityType: $data['entityType'] ?? null,
                entityId: $data['entityId'] ?? null,
                changes: $data['changes'] ?? null,
                metadata: $data['metadata'] ?? null,
            );

            $io->success("Created: {$data['action']}");
        }

        $io->success('All sample audit log entries created!');

        return Command::SUCCESS;
    }
}
