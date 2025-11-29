<?php

declare(strict_types=1);

namespace App\Service\Report\Formatter;

/**
 * Interface for report formatters.
 * Each implementation handles specific output format (PDF, Excel, CSV).
 */
interface ReportFormatterInterface
{
    /**
     * Get format identifier (e.g., 'pdf', 'excel', 'csv').
     */
    public function getFormat(): string;

    /**
     * Get file extension for this format.
     */
    public function getExtension(): string;

    /**
     * Format data and save to file.
     *
     * @param array<string, mixed> $data Report data with 'title', 'columns', 'rows', 'summary'
     * @param string $outputPath Absolute path where file should be saved
     * @param array<string, mixed> $options Additional formatting options
     */
    public function format(array $data, string $outputPath, array $options = []): void;
}
