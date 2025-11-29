<?php

declare(strict_types=1);

namespace App\Command;

use App\Service\Report\ReportGenerator;
use Exception;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:generate-report',
    description: 'Generate a report in PDF, Excel or CSV format',
)]
class GenerateReportCommand extends Command {
    public function __construct(
        private readonly ReportGenerator $reportGenerator,
    ) {
        parent::__construct();
    }

    protected function configure(): void {
        $this
            ->addArgument('type', InputArgument::REQUIRED, 'Report type (maintenance, equipment, users)')
            ->addArgument('format', InputArgument::REQUIRED, 'Output format (pdf, excel, csv)')
            ->addOption('status', 's', InputOption::VALUE_OPTIONAL, 'Filter by status')
            ->addOption('date-from', null, InputOption::VALUE_OPTIONAL, 'Filter by date from (Y-m-d)')
            ->addOption('date-to', null, InputOption::VALUE_OPTIONAL, 'Filter by date to (Y-m-d)')
            ->addOption('equipment-id', null, InputOption::VALUE_OPTIONAL, 'Filter by equipment ID')
            ->addOption('cost-center', null, InputOption::VALUE_OPTIONAL, 'Filter by cost center (equipment only)')
            ->addOption('role', null, InputOption::VALUE_OPTIONAL, 'Filter by role (users only)')
            ->addOption('output', 'o', InputOption::VALUE_OPTIONAL, 'Output directory path')
            ->setHelp(
                <<<'HELP'
This command generates reports in various formats.

Examples:
  # Generate PDF maintenance report
  php bin/console app:generate-report maintenance pdf

  # Generate Excel equipment report
  php bin/console app:generate-report equipment excel

  # Generate CSV users report
  php bin/console app:generate-report users csv

  # Generate maintenance report with filters
  php bin/console app:generate-report maintenance pdf --status=completed --date-from=2025-01-01 --date-to=2025-12-31

  # Generate report to custom directory
  php bin/console app:generate-report maintenance excel -o C:/temp/reports
HELP
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int {
        $io = new SymfonyStyle($input, $output);

        $reportType = $input->getArgument('type');
        $format = $input->getArgument('format');

        // Validate report type
        if (!in_array($reportType, ['maintenance', 'equipment', 'users'], true)) {
            $io->error('Invalid report type. Allowed: maintenance, equipment, users');

            return Command::FAILURE;
        }

        // Validate format
        if (!in_array($format, ['pdf', 'excel', 'csv'], true)) {
            $io->error('Invalid format. Allowed: pdf, excel, csv');

            return Command::FAILURE;
        }

        // Prepare filters
        $filters = [];
        if ($status = $input->getOption('status')) {
            $filters['status'] = $status;
        }
        if ($dateFrom = $input->getOption('date-from')) {
            $filters['dateFrom'] = $dateFrom;
        }
        if ($dateTo = $input->getOption('date-to')) {
            $filters['dateTo'] = $dateTo;
        }
        if ($equipmentId = $input->getOption('equipment-id')) {
            $filters['equipmentId'] = $equipmentId;
        }
        if ($costCenter = $input->getOption('cost-center')) {
            $filters['costCenter'] = $costCenter;
        }
        if ($role = $input->getOption('role')) {
            $filters['role'] = $role;
        }

        $io->title('Report Generator');
        $io->section('Configuration');
        $io->definitionList(
            ['Type' => $reportType],
            ['Format' => strtoupper($format)],
            ['Filters' => !empty($filters) ? json_encode($filters, JSON_PRETTY_PRINT) : 'None'],
        );

        $io->section('Generating Report');

        try {
            $filePath = $this->reportGenerator->generate(
                reportType: $reportType,
                format: $format,
                filters: $filters,
                outputPath: $input->getOption('output'),
            );

            $io->success([
                'Report generated successfully!',
                '',
                'File: ' . $filePath,
                'Size: ' . $this->formatBytes(filesize($filePath)),
            ]);

            return Command::SUCCESS;
        }
        catch (Exception $e) {
            $io->error([
                'Report generation failed!',
                '',
                'Error: ' . $e->getMessage(),
            ]);

            if ($output->isVerbose()) {
                $io->block($e->getTraceAsString(), 'TRACE', 'fg=red', ' ', true);
            }

            return Command::FAILURE;
        }
    }

    private function formatBytes(int $bytes): string {
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        }
        if ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        }

        return $bytes . ' B';
    }
}
