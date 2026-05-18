<?php

declare(strict_types=1);

namespace App\Tests\Unit\Message;

use App\Message\EmailNotificationMessage;
use PHPUnit\Framework\TestCase;

class EmailNotificationMessageTest extends TestCase {
    public function testStoresValues(): void {
        $message = new EmailNotificationMessage(
            'to@example.com',
            'Test Subject',
            'Body',
            'emails/test.html.twig',
            ['name' => 'Test'],
        );

        $this->assertSame('to@example.com', $message->to);
        $this->assertSame('Test Subject', $message->subject);
        $this->assertSame('Body', $message->body);
        $this->assertSame('emails/test.html.twig', $message->template);
        $this->assertSame(['name' => 'Test'], $message->context);
    }
}
