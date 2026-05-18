<?php

declare(strict_types=1);

namespace App\Tests\Unit\Message;

use App\Message\GenerateReportMessage;
use PHPUnit\Framework\TestCase;

class GenerateReportMessageTest extends TestCase {
    public function testGetFileNameUsesFormatExtension(): void {
        $message = new GenerateReportMessage(1, 'maintenance', 'excel');

        $fileName = $message->getFileName();

        $this->assertStringContainsString('maintenance_report_', $fileName);
        $this->assertStringEndsWith('.xlsx', $fileName);
    }

    public function testGetFileNameUsesTxtForUnknownFormat(): void {
        $message = new GenerateReportMessage(1, 'maintenance', 'unknown');

        $fileName = $message->getFileName();

        $this->assertStringEndsWith('.txt', $fileName);
    }
}
