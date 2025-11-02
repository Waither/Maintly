<?php

namespace App\MessageHandler;

use App\Message\EmailNotificationMessage;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles async email sending
 * Processed by messenger:consume worker.
 */
#[AsMessageHandler]
final readonly class EmailNotificationHandler {
    public function __construct(
        private LoggerInterface $logger,
        // TODO: Inject MailerInterface when ready to send real emails
        // private MailerInterface $mailer
    ) {}

    public function __invoke(EmailNotificationMessage $message): void {
        $this->logger->info('Processing email notification', [
            'to' => $message->to,
            'subject' => $message->subject,
        ]);

        // TODO: Replace with actual email sending
        // $email = (new Email())
        //     ->from('noreply@maintly.com')
        //     ->to($message->to)
        //     ->subject($message->subject)
        //     ->html($message->body);
        // $this->mailer->send($email);

        // For now, just log (mock)
        $this->logger->info('Email sent successfully (mocked)', [
            'to' => $message->to,
        ]);
    }
}
