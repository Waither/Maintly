<?php

declare(strict_types=1);

namespace App\Service\Report\Formatter;

/**
 * CSV report formatter using native PHP functions.
 */
final class CsvReportFormatter implements ReportFormatterInterface
{
    public function getFormat(): string
    {
        return 'csv';
    }

    public function getExtension(): string
    {
        return 'csv';
    }

    /**
     * @param array<string, mixed> $data
     * @param string $outputPath
     * @param array<string, mixed> $options
     */
    public function format(array $data, string $outputPath, array $options = []): void
    {
        $handle = fopen($outputPath, 'w');
        if ($handle === false) {
            throw new \RuntimeException("Could not open file for writing: {$outputPath}");
        }

        try {
            // Write UTF-8 BOM for Excel compatibility
            fwrite($handle, "\xEF\xBB\xBF");

            // Write title
            fputcsv($handle, [$data['title'] ?? 'Report']);
            
            // Write generation date
            $generatedAt = $options['generatedAt'] ?? new \DateTimeImmutable();
            fputcsv($handle, ['Generated: ' . $generatedAt->format('Y-m-d H:i:s')]);
            
            // Empty line
            fputcsv($handle, []);

            // Write column headers
            $columns = $data['columns'] ?? [];
            if (!empty($columns)) {
                fputcsv($handle, $columns);
            }

            // Write data rows
            $rows = $data['rows'] ?? [];
            foreach ($rows as $row) {
                fputcsv($handle, array_values($row));
            }

            // Add summary
            $summary = $data['summary'] ?? [];
            if (!empty($summary)) {
                fputcsv($handle, []); // Empty line
                fputcsv($handle, ['Summary']);
                fputcsv($handle, ['Total Records', $summary['total'] ?? 0]);
                
                if (!empty($summary['filters'])) {
                    fputcsv($handle, []); // Empty line
                    fputcsv($handle, ['Applied Filters']);
                    foreach ($summary['filters'] as $key => $value) {
                        fputcsv($handle, [$key, $value]);
                    }
                }
            }

        } finally {
            fclose($handle);
        }
    }
}
