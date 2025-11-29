<?php

declare(strict_types=1);

namespace App\Service\Report\Formatter;

use Dompdf\Dompdf;
use Dompdf\Options;
use Twig\Environment;

/**
 * PDF report formatter using Dompdf and Twig templates.
 */
final readonly class PdfReportFormatter implements ReportFormatterInterface
{
    public function __construct(
        private Environment $twig,
    ) {
    }

    public function getFormat(): string
    {
        return 'pdf';
    }

    public function getExtension(): string
    {
        return 'pdf';
    }

    /**
     * @param array<string, mixed> $data
     * @param string $outputPath
     * @param array<string, mixed> $options
     */
    public function format(array $data, string $outputPath, array $options = []): void
    {
        // Render Twig template to HTML
        $html = $this->twig->render('reports/maintenance.html.twig', [
            'title' => $data['title'] ?? 'Report',
            'columns' => $data['columns'] ?? [],
            'rows' => $data['rows'] ?? [],
            'summary' => $data['summary'] ?? [],
            'generatedAt' => $options['generatedAt'] ?? new \DateTimeImmutable(),
            'filters' => $options['filters'] ?? [],
        ]);

        // Configure Dompdf
        $pdfOptions = new Options();
        $pdfOptions->set('defaultFont', 'DejaVu Sans');
        $pdfOptions->set('isRemoteEnabled', true);
        $pdfOptions->set('isHtml5ParserEnabled', true);

        // Generate PDF
        $dompdf = new Dompdf($pdfOptions);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'landscape'); // landscape for wider tables
        $dompdf->render();

        // Save to file
        file_put_contents($outputPath, $dompdf->output());
    }
}
