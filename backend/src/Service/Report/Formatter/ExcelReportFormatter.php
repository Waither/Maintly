<?php

declare(strict_types=1);

namespace App\Service\Report\Formatter;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

/**
 * Excel report formatter using PhpSpreadsheet.
 */
final class ExcelReportFormatter implements ReportFormatterInterface
{
    public function getFormat(): string
    {
        return 'excel';
    }

    public function getExtension(): string
    {
        return 'xlsx';
    }

    /**
     * @param array<string, mixed> $data
     * @param string $outputPath
     * @param array<string, mixed> $options
     */
    public function format(array $data, string $outputPath, array $options = []): void
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Set title
        $title = $data['title'] ?? 'Report';
        $sheet->setTitle(substr($title, 0, 31)); // Excel max 31 chars for sheet name

        // Add report header
        $sheet->setCellValue('A1', $title);
        $sheet->mergeCells('A1:' . $this->getColumnLetter(count($data['columns'] ?? []) - 1) . '1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Add generation date
        $generatedAt = $options['generatedAt'] ?? new \DateTimeImmutable();
        $sheet->setCellValue('A2', 'Generated: ' . $generatedAt->format('Y-m-d H:i:s'));
        $sheet->mergeCells('A2:' . $this->getColumnLetter(count($data['columns'] ?? []) - 1) . '2');

        // Add column headers (row 4)
        $currentRow = 4;
        $columns = $data['columns'] ?? [];
        foreach ($columns as $index => $columnName) {
            $cellRef = $this->getColumnLetter($index) . $currentRow;
            $sheet->setCellValue($cellRef, $columnName);
            $sheet->getStyle($cellRef)->getFont()->setBold(true);
            $sheet->getStyle($cellRef)->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()->setRGB('4472C4');
            $sheet->getStyle($cellRef)->getFont()->getColor()->setRGB('FFFFFF');
            $sheet->getStyle($cellRef)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        }

        // Add data rows
        $currentRow++;
        $rows = $data['rows'] ?? [];
        foreach ($rows as $row) {
            $columnIndex = 0;
            foreach ($row as $value) {
                $cellRef = $this->getColumnLetter($columnIndex) . $currentRow;
                $sheet->setCellValue($cellRef, $value);
                $columnIndex++;
            }
            $currentRow++;
        }

        // Add borders to data range
        if (!empty($rows)) {
            $dataRange = 'A4:' . $this->getColumnLetter(count($columns) - 1) . ($currentRow - 1);
            $sheet->getStyle($dataRange)->getBorders()->getAllBorders()
                ->setBorderStyle(Border::BORDER_THIN);
        }

        // Auto-size columns
        foreach (range(0, count($columns) - 1) as $columnIndex) {
            $sheet->getColumnDimension($this->getColumnLetter($columnIndex))
                ->setAutoSize(true);
        }

        // Add summary section
        $summary = $data['summary'] ?? [];
        if (!empty($summary)) {
            $currentRow += 2;
            $sheet->setCellValue('A' . $currentRow, 'Summary');
            $sheet->getStyle('A' . $currentRow)->getFont()->setBold(true);
            $currentRow++;

            $sheet->setCellValue('A' . $currentRow, 'Total Records:');
            $sheet->setCellValue('B' . $currentRow, $summary['total'] ?? 0);
        }

        // Write to file
        $writer = new Xlsx($spreadsheet);
        $writer->save($outputPath);
    }

    private function getColumnLetter(int $index): string
    {
        $letter = '';
        while ($index >= 0) {
            $letter = chr($index % 26 + 65) . $letter;
            $index = intval($index / 26) - 1;
        }
        return $letter;
    }
}
