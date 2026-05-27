<?php

declare(strict_types=1);

namespace App\Tests\Unit\MessageHandler;

use App\Message\EmailNotificationMessage;
use App\MessageHandler\EmailNotificationHandler;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;

class EmailNotificationHandlerTest extends TestCase {
    public function testSendsTemplatedEmail(): void {
        $logger = $this->createMock(LoggerInterface::class);
        $mailer = $this->createMock(MailerInterface::class);
        $mailer->expects($this->once())
            ->method('send')
            ->with($this->isInstanceOf(TemplatedEmail::class));

        $handler = new EmailNotificationHandler($logger, $mailer, 'no-reply@example.com');

        $handler(new EmailNotificationMessage(
            'to@example.com',
            'Subject',
            null,
            'emails/test.html.twig',
            ['name' => 'Test'],
        ));
    }

    public function testSendsHtmlBodyEmail(): void {
        $logger = $this->createMock(LoggerInterface::class);
        $mailer = $this->createMock(MailerInterface::class);
        $mailer->expects($this->once())
            ->method('send')
            ->with($this->isInstanceOf(TemplatedEmail::class));

        $handler = new EmailNotificationHandler($logger, $mailer, 'no-reply@example.com');

        $handler(new EmailNotificationMessage(
            'to@example.com',
            'Subject',
            '<p>Hello</p>',
            null,
        ));
    }

    public function testRethrowsTransportException(): void {
        $logger = $this->createMock(LoggerInterface::class);
        $mailer = $this->createMock(MailerInterface::class);

        $exception = new \Symfony\Component\Mailer\Exception\TransportException('fail');
        $mailer->method('send')->willThrowException($exception);

        $handler = new EmailNotificationHandler($logger, $mailer, 'no-reply@example.com');

        $this->expectException(TransportExceptionInterface::class);

        $handler(new EmailNotificationMessage(
            'to@example.com',
            'Subject',
            '<p>Hello</p>',
            null,
        ));
    }
}
