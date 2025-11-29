<?php

declare(strict_types=1);

namespace App\Message;

/**
 * Asynchronous message for generating reports in various formats.
 * Processed by GenerateReportHandler in the background.
 */
readonly class GenerateReportMessage
{
    /**
     * @param int $reportId ID of Report entity to track status
     * @param string $reportType Type of report (e.g., 'maintenance', 'equipment', 'users')
     * @param string $format Output format: 'pdf', 'excel', 'csv'
     * @param array<string, mixed> $filters Filtering criteria (e.g., date range, status, user ID)
     * @param string|null $outputPath Optional custom output path (defaults to /var/reports/)
     */
    public function __construct(
        public int $reportId,
        public string $reportType,
        public string $format,
        public array $filters = [],
        public ?string $outputPath = null,
    ) {
    }

    public function getFileName(): string
    {
        $timestamp = date('Y-m-d_His');
        return "{$this->reportType}_report_{$timestamp}.{$this->getExtension()}";
    }

    private function getExtension(): string
    {
        return match ($this->format) {
            'pdf' => 'pdf',
            'excel' => 'xlsx',
            'csv' => 'csv',
            default => 'txt',
        };
    }
}
