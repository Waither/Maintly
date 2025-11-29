<?php

declare(strict_types=1);

namespace App\Command;

use App\Repository\EquipmentRepository;
use App\Repository\UserRepository;
use App\Repository\WorkOrderRepository;
use App\Service\Report\Formatter\CsvReportFormatter;
use App\Service\Report\Formatter\ExcelReportFormatter;
use App\Service\Report\Formatter\PdfReportFormatter;
use DateTimeImmutable;
use Exception;
use InvalidArgumentException;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:test-report',
    description: 'Generate a test report with real database data',
)]
class TestReportCommand extends Command {
    public function __construct(
        private readonly PdfReportFormatter $pdfFormatter,
        private readonly ExcelReportFormatter $excelFormatter,
        private readonly CsvReportFormatter $csvFormatter,
        private readonly WorkOrderRepository $workOrderRepository,
        private readonly EquipmentRepository $equipmentRepository,
        private readonly UserRepository $userRepository,
        private readonly string $projectDir,
    ) {
        parent::__construct();
    }

    protected function configure(): void {
        $this
            ->addArgument('format', InputArgument::OPTIONAL, 'Output format (pdf, excel, csv)', 'pdf')
            ->addArgument('type', InputArgument::OPTIONAL, 'Report type (maintenance, equipment, users)', 'maintenance')
            ->setHelp(
                <<<'HELP'
This command generates a test report with real data from database.

Examples:
  # Generate work orders PDF report
  php bin/console app:test-report pdf maintenance

  # Generate equipment Excel report
  php bin/console app:test-report excel equipment

  # Generate users CSV report
  php bin/console app:test-report csv users
HELP
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int {
        $io = new SymfonyStyle($input, $output);
        /** @var string $format */
        $format = $input->getArgument('format');
        /** @var string $reportType */
        $reportType = $input->getArgument('type');

        // Validate format
        if (!in_array($format, ['pdf', 'excel', 'csv'], true)) {
            $io->error('Invalid format. Allowed: pdf, excel, csv');

            return Command::FAILURE;
        }

        // Validate report type
        if (!in_array($reportType, ['maintenance', 'equipment', 'users'], true)) {
            $io->error('Invalid report type. Allowed: maintenance, equipment, users');

            return Command::FAILURE;
        }

        $io->title('Test Report Generator');
        $io->section('Configuration');
        $io->definitionList(
            ['Format' => strtoupper($format)],
            ['Type' => ucfirst($reportType)],
            ['Data Source' => 'Real database data'],
        );

        $io->section('Generating Test Report');

        try {
            // Get real data from database
            $data = $this->getReportData($reportType);

            if (empty($data['rows'])) {
                $io->warning('No data found in database for report type: ' . $reportType);

                return Command::FAILURE;
            }

            // Get formatter based on format
            if ($format === 'pdf') {
                $formatter = $this->pdfFormatter;
            }
            elseif ($format === 'excel') {
                $formatter = $this->excelFormatter;
            }
            else { // csv
                $formatter = $this->csvFormatter;
            }

            // Prepare output path
            $reportsDir = $this->projectDir . '/var/reports';
            if (!is_dir($reportsDir)) {
                mkdir($reportsDir, 0755, true);
            }

            $timestamp = date('Y-m-d_His');
            $filePath = $reportsDir . "/test_{$reportType}_{$timestamp}.{$formatter->getExtension()}";

            // Generate report
            $formatter->format($data, $filePath, [
                'reportType' => $reportType,
                'filters' => [],
                'generatedAt' => new DateTimeImmutable(),
            ]);

            $io->success([
                'Test report generated successfully!',
                '',
                'Type: ' . ucfirst($reportType),
                'File: ' . $filePath,
                'Size: ' . $this->formatBytes(filesize($filePath)),
                'Rows: ' . count($data['rows']),
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

    /**
     * Get real data from database based on report type.
     *
     * @return array<string, mixed>
     */
    private function getReportData(string $reportType): array {
        return match ($reportType) {
            'maintenance' => $this->getWorkOrdersData(),
            'equipment' => $this->getEquipmentData(),
            'users' => $this->getUsersData(),
            default => throw new InvalidArgumentException("Unknown report type: {$reportType}"),
        };
    }

    /**
     * @return array<string, mixed>
     */
    private function getWorkOrdersData(): array {
        $workOrders = $this->workOrderRepository->findAllActive();

        $rows = [];
        foreach ($workOrders as $wo) {
            $rows[] = [
                'id' => $wo->getId(),
                'code' => $wo->getUniqueCode() ?? 'N/A',
                'title' => $wo->getTitle(),
                'description' => $wo->getDescription(),
                'equipment' => $wo->getEquipment()->getName() ?? 'N/A',
                'status' => $wo->getStatus()->getName(),
                'priority' => $wo->getPriority()->getName(),
                'plannedStart' => $wo->getPlannedStartDate()?->format('Y-m-d H:i') ?? 'N/A',
                'plannedEnd' => $wo->getPlannedEndDate()?->format('Y-m-d H:i') ?? 'N/A',
                'actualStart' => $wo->getActualStartDate()?->format('Y-m-d H:i') ?? 'N/A',
                'actualEnd' => $wo->getActualEndDate()?->format('Y-m-d H:i') ?? 'N/A',
                'createdAt' => $wo->getCreatedAt()->format('Y-m-d H:i'),
            ];
        }

        return [
            'title' => 'Work Orders Report',
            'columns' => ['ID', 'Code', 'Title', 'Equipment', 'Status', 'Priority', 'Planned Start', 'Planned End', 'Created At'],
            'rows' => $rows,
            'summary' => [
                'total' => count($rows),
                'filters' => [],
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function getEquipmentData(): array {
        $equipment = $this->equipmentRepository->findAll();

        $rows = [];
        foreach ($equipment as $eq) {
            $rows[] = [
                'id' => $eq->getId(),
                'name' => $eq->getName() ?? 'N/A',
                'costCenter' => $eq->getCostCenter(),
                'parentEquipment' => $eq->getParentEquipment()?->getName() ?? 'None',
                'directWorkTime' => $eq->getDirectWorkTime() . ' min',
                'totalWorkTime' => $eq->getTotalWorkTime() . ' min',
                'qrCode' => $eq->getQrCodeData() ?? 'N/A',
                'createdAt' => $eq->getCreatedAt()?->format('Y-m-d H:i') ?? 'N/A',
            ];
        }

        return [
            'title' => 'Equipment Report',
            'columns' => ['ID', 'Name', 'Cost Center', 'Parent Equipment', 'Direct Work Time', 'Total Work Time', 'QR Code', 'Created At'],
            'rows' => $rows,
            'summary' => [
                'total' => count($rows),
                'filters' => [],
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function getUsersData(): array {
        $users = $this->userRepository->findAll();

        $rows = [];
        foreach ($users as $user) {
            $rows[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName() ?? 'N/A',
                'lastName' => $user->getLastName() ?? 'N/A',
                'role' => $user->getUserRole()?->getName() ?? 'N/A',
                'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i') ?? 'N/A',
            ];
        }

        return [
            'title' => 'Users Report',
            'columns' => ['ID', 'Email', 'First Name', 'Last Name', 'Role', 'Created At'],
            'rows' => $rows,
            'summary' => [
                'total' => count($rows),
                'filters' => [],
            ],
        ];
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
