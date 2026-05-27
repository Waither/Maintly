<?php

declare(strict_types=1);

namespace App\Tests\Unit\Service\Report\Formatter;

use App\Service\Report\Formatter\ExcelReportFormatter;
use PHPUnit\Framework\TestCase;
use RuntimeException;

class ExcelReportFormatterTest extends TestCase {
    private ExcelReportFormatter $formatter;

    protected function setUp(): void {
        $this->formatter = new ExcelReportFormatter();
    }

    public function testGetFormat(): void {
        $this->assertSame('excel', $this->formatter->getFormat());
    }

    public function testGetExtension(): void {
        $this->assertSame('xlsx', $this->formatter->getExtension());
    }

    public function testFormatWithSimpleData(): void {
        $outputPath = sys_get_temp_dir() . '/test_report_' . uniqid() . '.xlsx';

        try {
            $data = [
                'title' => 'Test Report',
                'columns' => ['ID', 'Name', 'Status'],
                'rows' => [
                    ['id' => 1, 'name' => 'Item 1', 'status' => 'Active'],
                    ['id' => 2, 'name' => 'Item 2', 'status' => 'Inactive'],
                ],
                'summary' => [
                    'total' => 2,
                    'filters' => [],
                ],
            ];

            $this->formatter->format($data, $outputPath);

            $this->assertFileExists($outputPath);
            $this->assertGreaterThan(0, filesize($outputPath));
        } finally {
            if (file_exists($outputPath)) {
                unlink($outputPath);
            }
        }
    }

    public function testFormatWithComplexData(): void {
        $outputPath = sys_get_temp_dir() . '/test_report_' . uniqid() . '.xlsx';

        try {
            $data = [
                'title' => 'Complex Report',
                'columns' => ['ID', 'Equipment', 'Status', 'Priority', 'Cost'],
                'rows' => [
                    ['id' => 1, 'equipment' => 'Pump A', 'status' => 'Done', 'priority' => 'High', 'cost' => '500.00'],
                    ['id' => 2, 'equipment' => 'Pump B', 'status' => 'In Progress', 'priority' => 'Medium', 'cost' => '750.00'],
                    ['id' => 3, 'equipment' => 'Valve C', 'status' => 'Pending', 'priority' => 'Low', 'cost' => '200.00'],
                ],
                'summary' => [
                    'total' => 3,
                    'filters' => [
                        'equipment_type' => 'pumps',
                        'date_from' => '2026-01-01',
                    ],
                ],
            ];

            $this->formatter->format($data, $outputPath);

            $this->assertFileExists($outputPath);
        } finally {
            if (file_exists($outputPath)) {
                unlink($outputPath);
            }
        }
    }

    public function testFormatThrowsExceptionOnInvalidPath(): void {
        $this->expectException(RuntimeException::class);

        $invalidPath = '/nonexistent_directory/invalid/path/report.xlsx';

        $data = [
            'title' => 'Test',
            'columns' => ['Col1'],
            'rows' => [],
        ];

        $this->formatter->format($data, $invalidPath);
    }

    public function testFormatWithEmptyRows(): void {
        $outputPath = sys_get_temp_dir() . '/test_report_' . uniqid() . '.xlsx';

        try {
            $data = [
                'title' => 'Empty Report',
                'columns' => ['Column1', 'Column2'],
                'rows' => [],
                'summary' => ['total' => 0],
            ];

            $this->formatter->format($data, $outputPath);

            $this->assertFileExists($outputPath);
        } finally {
            if (file_exists($outputPath)) {
                unlink($outputPath);
            }
        }
    }

    public function testFormatWithSpecialCharacters(): void {
        $outputPath = sys_get_temp_dir() . '/test_report_' . uniqid() . '.xlsx';

        try {
            $data = [
                'title' => 'Raport z danymi specjalnymi',
                'columns' => ['ID', 'Opis', 'Status'],
                'rows' => [
                    ['id' => 1, 'description' => 'Element z "cudzysłowami"', 'status' => 'Aktywny'],
                    ['id' => 2, 'description' => 'Element z znkami specjalnymi: ąęćłńóśźż', 'status' => 'Nieaktywny'],
                ],
            ];

            $this->formatter->format($data, $outputPath);

            $this->assertFileExists($outputPath);
        } finally {
            if (file_exists($outputPath)) {
                unlink($outputPath);
            }
        }
    }
}
