<?php

declare(strict_types=1);

namespace App\Service\Report;

use App\Service\Report\Formatter\ReportFormatterInterface;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;

/**
 * Main service for generating reports in various formats.
 * Coordinates data fetching and formatting delegation.
 */
class ReportGenerator {
    /** @var array<string, ReportFormatterInterface> */
    private array $formatters;

    /**
     * @param iterable<ReportFormatterInterface> $formatters
     */
    public function __construct(
        private EntityManagerInterface $entityManager,
        private string $reportsDir,
        iterable $formatters,
    ) {
        $formatterArray = [];
        foreach ($formatters as $formatter) {
            $formatterArray[$formatter->getFormat()] = $formatter;
        }
        $this->formatters = $formatterArray;
    }

    /**
     * Generate a report and save to file.
     *
     * @param string $reportType Type of report (maintenance, equipment, users, etc.)
     * @param string $format Output format (pdf, excel, csv)
     * @param array<string, mixed> $filters Filtering criteria
     * @param string|null $outputPath Custom output directory
     *
     * @throws InvalidArgumentException If format is not supported
     *
     * @return string Absolute path to generated file
     */
    public function generate(
        string $reportType,
        string $format,
        array $filters = [],
        ?string $outputPath = null,
    ): string {
        if (!isset($this->formatters[$format])) {
            throw new InvalidArgumentException("Unsupported format: {$format}");
        }

        // Fetch data based on report type
        $data = $this->fetchReportData($reportType, $filters);

        // Get formatter
        $formatter = $this->formatters[$format];

        // Prepare output path
        $outputDir = $outputPath ?? $this->reportsDir;
        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        $timestamp = date('Y-m-d_His');
        $fileName = "{$reportType}_report_{$timestamp}.{$formatter->getExtension()}";
        $filePath = $outputDir . '/' . $fileName;

        // Generate report
        $formatter->format($data, $filePath, [
            'reportType' => $reportType,
            'filters' => $filters,
            'generatedAt' => new DateTimeImmutable(),
        ]);

        return $filePath;
    }

    /**
     * Fetch data for specific report type.
     *
     * @param array<string, mixed> $filters
     *
     * @return array<string, mixed>
     */
    private function fetchReportData(string $reportType, array $filters): array {
        return match ($reportType) {
            'maintenance' => $this->fetchWorkOrdersData($filters),
            'equipment' => $this->fetchEquipmentData($filters),
            'users' => $this->fetchUsersData($filters),
            default => throw new InvalidArgumentException("Unknown report type: {$reportType}"),
        };
    }

    /**
     * @param array<string, mixed> $filters
     *
     * @return array<string, mixed>
     */
    private function fetchWorkOrdersData(array $filters): array {
        $qb = $this->entityManager->createQueryBuilder();
        $qb->select('w', 'e', 's', 'p')
            ->from('App\Entity\WorkOrder', 'w')
            ->leftJoin('w.equipment', 'e')
            ->leftJoin('w.status', 's')
            ->leftJoin('w.priority', 'p');

        // Apply filters
        if (isset($filters['status'])) {
            $qb->andWhere('s.name = :status')
                ->setParameter('status', $filters['status']);
        }

        if (isset($filters['dateFrom'])) {
            $qb->andWhere('w.plannedStartDate >= :dateFrom')
                ->setParameter('dateFrom', new DateTime($filters['dateFrom']));
        }

        if (isset($filters['dateTo'])) {
            $qb->andWhere('w.plannedStartDate <= :dateTo')
                ->setParameter('dateTo', new DateTime($filters['dateTo']));
        }

        if (isset($filters['equipmentId'])) {
            $qb->andWhere('e.id = :equipmentId')
                ->setParameter('equipmentId', $filters['equipmentId']);
        }

        $workOrders = $qb->getQuery()->getResult();

        return [
            'title' => 'Work Orders Report',
            'columns' => ['ID', 'Code', 'Title', 'Equipment', 'Status', 'Priority', 'Planned Start', 'Planned End'],
            'rows' => array_map(function ($workOrder) {
                return [
                    'id' => $workOrder->getId(),
                    'code' => $workOrder->getUniqueCode() ?? 'N/A',
                    'title' => $workOrder->getTitle(),
                    'equipment' => $workOrder->getEquipment()?->getName() ?? 'N/A',
                    'status' => $workOrder->getStatus()?->getName() ?? 'N/A',
                    'priority' => $workOrder->getPriority()?->getName() ?? 'N/A',
                    'plannedStart' => $workOrder->getPlannedStartDate()?->format('Y-m-d H:i') ?? 'N/A',
                    'plannedEnd' => $workOrder->getPlannedEndDate()?->format('Y-m-d H:i') ?? 'N/A',
                ];
            }, $workOrders),
            'summary' => [
                'total' => count($workOrders),
                'filters' => $filters,
            ],
        ];
    }

    /**
     * @param array<string, mixed> $filters
     *
     * @return array<string, mixed>
     */
    private function fetchEquipmentData(array $filters): array {
        $qb = $this->entityManager->createQueryBuilder();
        $qb->select('e', 'p', 'c')
            ->from('App\Entity\Equipment', 'e')
            ->leftJoin('e.parentEquipment', 'p')
            ->leftJoin('e.createdBy', 'c');

        // Apply filters
        if (isset($filters['costCenter'])) {
            $qb->andWhere('e.costCenter = :costCenter')
                ->setParameter('costCenter', $filters['costCenter']);
        }

        $equipment = $qb->getQuery()->getResult();

        return [
            'title' => 'Equipment Report',
            'columns' => ['ID', 'Name', 'Cost Center', 'Parent Equipment', 'QR Code', 'Created By'],
            'rows' => array_map(function ($item) {
                return [
                    'id' => $item->getId(),
                    'name' => $item->getName(),
                    'costCenter' => $item->getCostCenter() ?? 'N/A',
                    'parent' => $item->getParentEquipment()?->getName() ?? 'None',
                    'qrCode' => $item->getQrCodeData() ?? 'N/A',
                    'createdBy' => $item->getCreatedBy()?->getEmail() ?? 'N/A',
                ];
            }, $equipment),
            'summary' => [
                'total' => count($equipment),
                'filters' => $filters,
            ],
        ];
    }

    /**
     * @param array<string, mixed> $filters
     *
     * @return array<string, mixed>
     */
    private function fetchUsersData(array $filters): array {
        $qb = $this->entityManager->createQueryBuilder();
        $qb->select('u', 'r')
            ->from('App\Entity\User', 'u')
            ->leftJoin('u.userRole', 'r');

        if (isset($filters['role'])) {
            $qb->andWhere('r.name = :role')
                ->setParameter('role', $filters['role']);
        }

        $users = $qb->getQuery()->getResult();

        return [
            'title' => 'Users Report',
            'columns' => ['ID', 'Email', 'First Name', 'Last Name', 'Role', 'Created At'],
            'rows' => array_map(function ($user) {
                return [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'firstName' => $user->getFirstName() ?? 'N/A',
                    'lastName' => $user->getLastName() ?? 'N/A',
                    'role' => $user->getUserRole()?->getName() ?? 'N/A',
                    'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s') ?? 'N/A',
                ];
            }, $users),
            'summary' => [
                'total' => count($users),
                'filters' => $filters,
            ],
        ];
    }
}
