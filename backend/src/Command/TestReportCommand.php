<?php

declare(strict_types=1);

namespace App\Command;

use App\Service\Report\Formatter\CsvReportFormatter;
use App\Service\Report\Formatter\ExcelReportFormatter;
use App\Service\Report\Formatter\PdfReportFormatter;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:test-report',
    description: 'Generate a test report with sample data (no database required)',
)]
class TestReportCommand extends Command
{
    public function __construct(
        private readonly PdfReportFormatter $pdfFormatter,
        private readonly ExcelReportFormatter $excelFormatter,
        private readonly CsvReportFormatter $csvFormatter,
        private readonly string $projectDir,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('format', InputArgument::OPTIONAL, 'Output format (pdf, excel, csv)', 'pdf')
            ->setHelp(<<<'HELP'
This command generates a test report with sample data (no database connection needed).

Examples:
  # Generate test PDF report
  php bin/console app:test-report pdf

  # Generate test Excel report
  php bin/console app:test-report excel

  # Generate test CSV report
  php bin/console app:test-report csv
HELP
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $format = $input->getArgument('format');

        // Validate format
        if (!in_array($format, ['pdf', 'excel', 'csv'], true)) {
            $io->error('Invalid format. Allowed: pdf, excel, csv');
            return Command::FAILURE;
        }

        $io->title('Test Report Generator');
        $io->section('Configuration');
        $io->definitionList(
            ['Format' => strtoupper($format)],
            ['Data' => 'Sample data (no database)'],
        );

        $io->section('Generating Test Report');

        try {
            // Prepare sample data
            $sampleData = $this->getSampleData();
            
            // Get formatter based on format
            $formatter = match ($format) {
                'pdf' => $this->pdfFormatter,
                'excel' => $this->excelFormatter,
                'csv' => $this->csvFormatter,
                default => throw new \InvalidArgumentException("Unsupported format: {$format}"),
            };

            // Prepare output path
            $reportsDir = $this->projectDir . '/var/reports';
            if (!is_dir($reportsDir)) {
                mkdir($reportsDir, 0755, true);
            }

            $timestamp = date('Y-m-d_His');
            $filePath = $reportsDir . "/test_report_{$timestamp}.{$formatter->getExtension()}";

            // Generate report
            $formatter->format($sampleData, $filePath, [
                'reportType' => 'test',
                'filters' => [],
                'generatedAt' => new \DateTimeImmutable(),
            ]);

            $io->success([
                'Test report generated successfully!',
                '',
                'File: ' . $filePath,
                'Size: ' . $this->formatBytes(filesize($filePath)),
            ]);

            return Command::SUCCESS;

        } catch (\Exception $e) {
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

    private function getSampleData(): array
    {
        return [
            'title' => 'Sample Work Orders Report',
            'columns' => ['ID', 'Code', 'Title', 'Equipment', 'Status', 'Priority', 'Planned Start', 'Planned End'],
            'rows' => [
                [
                    'id' => 1,
                    'code' => 'WO-2025-001',
                    'title' => 'Regular maintenance of CNC Machine #1',
                    'equipment' => 'CNC Machine Haas VF-2',
                    'status' => 'Completed',
                    'priority' => 'Normal',
                    'plannedStart' => '2025-01-15 08:00',
                    'plannedEnd' => '2025-01-15 12:00',
                ],
                [
                    'id' => 2,
                    'code' => 'WO-2025-002',
                    'title' => 'Emergency repair - hydraulic system leak',
                    'equipment' => 'Hydraulic Press HP-300',
                    'status' => 'In Progress',
                    'priority' => 'High',
                    'plannedStart' => '2025-02-10 06:00',
                    'plannedEnd' => '2025-02-10 18:00',
                ],
                [
                    'id' => 3,
                    'code' => 'WO-2025-003',
                    'title' => 'Annual inspection and calibration',
                    'equipment' => 'Coordinate Measuring Machine CMM-500',
                    'status' => 'Scheduled',
                    'priority' => 'Normal',
                    'plannedStart' => '2025-03-05 09:00',
                    'plannedEnd' => '2025-03-05 16:00',
                ],
                [
                    'id' => 4,
                    'code' => 'WO-2025-004',
                    'title' => 'Belt replacement and alignment check',
                    'equipment' => 'Conveyor Belt System CB-A1',
                    'status' => 'Completed',
                    'priority' => 'Low',
                    'plannedStart' => '2025-01-20 14:00',
                    'plannedEnd' => '2025-01-20 16:00',
                ],
                [
                    'id' => 5,
                    'code' => 'WO-2025-005',
                    'title' => 'Software update and controller diagnostics',
                    'equipment' => 'Robot Arm Kuka KR-10',
                    'status' => 'Pending',
                    'priority' => 'Normal',
                    'plannedStart' => '2025-04-01 10:00',
                    'plannedEnd' => '2025-04-01 14:00',
                ],
                [
                    'id' => 6,
                    'code' => 'WO-2025-006',
                    'title' => 'Critical failure - motor replacement',
                    'equipment' => 'Industrial Fan IF-220',
                    'status' => 'In Progress',
                    'priority' => 'Critical',
                    'plannedStart' => '2025-02-28 00:00',
                    'plannedEnd' => '2025-02-28 08:00',
                ],
            ],
            'summary' => [
                'total' => 6,
                'filters' => [],
            ],
        ];
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        }
        return $bytes . ' B';
    }
}
