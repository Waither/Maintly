<?php

declare(strict_types=1);

namespace App\Tests\Unit\Service\Report\Formatter;

use App\Service\Report\Formatter\PdfReportFormatter;
use PHPUnit\Framework\TestCase;
use Twig\Environment;
use Twig\Loader\ArrayLoader;

class PdfReportFormatterTest extends TestCase {
    private PdfReportFormatter $formatter;

    protected function setUp(): void {
        $twig = new Environment(new ArrayLoader([
            'reports/maintenance.html.twig' => '<html><body><h1>{{ title }}</h1><table>{% for row in rows %}<tr><td>{{ row.id|default(\'\') }}</td></tr>{% endfor %}</table></body></html>',
        ]));

        $this->formatter = new PdfReportFormatter($twig);
    }

    public function testGetFormat(): void {
        $this->assertSame('pdf', $this->formatter->getFormat());
    }

    public function testGetExtension(): void {
        $this->assertSame('pdf', $this->formatter->getExtension());
    }

    public function testFormatCreatesPdfFile(): void {
        $outputPath = sys_get_temp_dir() . '/test_pdf_' . uniqid('', true) . '.pdf';

        $this->formatter->format([
            'title' => 'Maintenance Report',
            'columns' => ['ID'],
            'rows' => [
                ['id' => 1],
                ['id' => 2],
            ],
            'summary' => ['total' => 2],
        ], $outputPath);

        $this->assertFileExists($outputPath);
        $size = filesize($outputPath);
        $this->assertNotFalse($size);
        $this->assertGreaterThan(0, $size);

        unlink($outputPath);
    }

    public function testFormatWorksWithMinimalData(): void {
        $outputPath = sys_get_temp_dir() . '/test_pdf_min_' . uniqid('', true) . '.pdf';

        $this->formatter->format([], $outputPath);

        $this->assertFileExists($outputPath);

        unlink($outputPath);
    }
}
