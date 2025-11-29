<?php

namespace App\MessageHandler;

use App\Message\EmailNotificationMessage;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Throwable;

/**
 * Handles async email sending
 * Processed by messenger:consume worker.
 */
#[AsMessageHandler]
final readonly class EmailNotificationHandler {
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly MailerInterface $mailer,
        #[Autowire('%env(MAILER_FROM_EMAIL)%')]
        private readonly string $fromEmail,
    ) {}

    public function __invoke(EmailNotificationMessage $message): void {
        $this->logger->info('Processing email notification', [
            'to' => $message->to,
            'subject' => $message->subject,
            'template' => $message->template ?? 'none',
        ]);

        try {
            if ($message->template) {
                // Send templated email (HTML from Twig)
                $email = (new TemplatedEmail())
                    ->from($this->fromEmail)
                    ->to($message->to)
                    ->subject($message->subject)
                    ->htmlTemplate($message->template)
                    ->context($message->context ?? []);
            }
            else {
                // Fallback: plain HTML body
                $email = (new TemplatedEmail())
                    ->from($this->fromEmail)
                    ->to($message->to)
                    ->subject($message->subject)
                    ->html($message->body ?? '');
            }

            $this->mailer->send($email);

            $this->logger->info('Email sent successfully', [
                'to' => $message->to,
                'subject' => $message->subject,
            ]);
        }
        catch (TransportExceptionInterface $e) {
            $this->logger->error('Failed to send email', [
                'to' => $message->to,
                'subject' => $message->subject,
                'error' => $e->getMessage(),
            ]);

            // Re-throw to trigger Messenger retry mechanism
            throw $e;
        }
        catch (Throwable $e) {
            $this->logger->error('Unexpected error while sending email', [
                'to' => $message->to,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
