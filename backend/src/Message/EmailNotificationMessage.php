<?php

namespace App\Message;

/**
 * Async message for sending email notifications
 * Will be processed by EmailNotificationHandler in background worker.
 */
final readonly class EmailNotificationMessage {
    /**
     * @param array<string, mixed> $context
     */
    public function __construct(
        public string $to,
        public string $subject,
        public string $body,
        public ?string $templateName = null,
        public array $context = [],
    ) {}
}
