<?php

declare(strict_types=1);

namespace App\Tests\Unit\Service\Report\Formatter;

use App\Service\Report\Formatter\CsvReportFormatter;
use DateTimeImmutable;
use PHPUnit\Framework\TestCase;
use RuntimeException;

class CsvReportFormatterTest extends TestCase {
    private CsvReportFormatter $formatter;
    private string $tmpFile;

    protected function setUp(): void {
        $this->formatter = new CsvReportFormatter();
        $this->tmpFile = sys_get_temp_dir() . '/test_report_' . uniqid() . '.csv';
    }

    protected function tearDown(): void {
        if (file_exists($this->tmpFile)) {
            unlink($this->tmpFile);
        }
    }

    public function testGetFormat(): void {
        $this->assertSame('csv', $this->formatter->getFormat());
    }

    public function testGetExtension(): void {
        $this->assertSame('csv', $this->formatter->getExtension());
    }

    public function testWritesUtf8BomAtStart(): void {
        $this->formatter->format(['title' => 'Test'], $this->tmpFile);

        $content = file_get_contents($this->tmpFile);
        $this->assertStringStartsWith("\xEF\xBB\xBF", $content);
    }

    public function testWritesTitleAndHeaders(): void {
        $data = [
            'title' => 'Equipment Report',
            'columns' => ['ID', 'Name', 'Status'],
            'rows' => [
                ['id' => 1, 'name' => 'Pump A', 'status' => 'active'],
                ['id' => 2, 'name' => 'Motor B', 'status' => 'inactive'],
            ],
        ];

        $this->formatter->format($data, $this->tmpFile);

        $content = file_get_contents($this->tmpFile);
        $this->assertStringContainsString('Equipment Report', $content);
        $this->assertStringContainsString('ID', $content);
        $this->assertStringContainsString('Name', $content);
        $this->assertStringContainsString('Pump A', $content);
        $this->assertStringContainsString('Motor B', $content);
    }

    public function testWritesSummarySection(): void {
        $data = [
            'title' => 'Report',
            'columns' => ['ID'],
            'rows' => [['id' => 1]],
            'summary' => [
                'total' => 1,
                'filters' => ['status' => 'active'],
            ],
        ];

        $this->formatter->format($data, $this->tmpFile);

        $content = file_get_contents($this->tmpFile);
        $this->assertStringContainsString('Summary', $content);
        $this->assertStringContainsString('Total Records', $content);
        $this->assertStringContainsString('Applied Filters', $content);
        $this->assertStringContainsString('active', $content);
    }

    public function testGeneratedAtIsIncluded(): void {
        $date = new DateTimeImmutable('2025-01-15 10:00:00');
        $this->formatter->format(['title' => 'R'], $this->tmpFile, ['generatedAt' => $date]);

        $content = file_get_contents($this->tmpFile);
        $this->assertStringContainsString('2025-01-15 10:00:00', $content);
    }

    public function testThrowsOnInvalidPath(): void {
        $this->expectException(RuntimeException::class);
        $this->formatter->format(['title' => 'R'], '/nonexistent_dir/report.csv');
    }

    public function testEmptyDataRendersWithoutError(): void {
        $this->formatter->format([], $this->tmpFile);
        $this->assertFileExists($this->tmpFile);
    }
}
