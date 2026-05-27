<?php

declare(strict_types=1);

namespace App\Service;

use DateTimeImmutable;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

final readonly class RealtimePublisher {
    public function __construct(
        private LoggerInterface $logger,
        #[Autowire('%env(default::REALTIME_WS_BROADCAST_URL)%')]
        private ?string $broadcastUrl,
        #[Autowire('%env(default::REALTIME_WS_BROADCAST_TOKEN)%')]
        private ?string $broadcastToken,
    ) {}

    /**
     * @param array<string, mixed> $payload
     */
    public function publish(string $type, array $payload = []): void {
        if ($this->broadcastUrl === null || trim($this->broadcastUrl) === '') {
            return;
        }

        $event = [
            'type' => $type,
            'ts' => (new DateTimeImmutable())->format(DATE_ATOM),
        ];

        if (!empty($payload)) {
            $event['payload'] = $payload;
        }

        $body = json_encode($event);
        if ($body === false) {
            $this->logger->warning('Realtime broadcast JSON encoding failed.', [
                'type' => $type,
            ]);
            return;
        }

        $headers = [
            'Content-Type: application/json',
        ];

        if ($this->broadcastToken !== null && $this->broadcastToken !== '') {
            $headers[] = 'Authorization: Bearer ' . $this->broadcastToken;
        }

        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => implode("\r\n", $headers),
                'content' => $body,
                'timeout' => 1.0,
                'ignore_errors' => true,
            ],
        ]);

        $result = @file_get_contents($this->broadcastUrl, false, $context);
        if ($result === false) {
            $this->logger->debug('Realtime broadcast failed.', [
                'type' => $type,
                'url' => $this->broadcastUrl,
            ]);
            return;
        }

        if (isset($http_response_header[0]) && !str_contains($http_response_header[0], ' 2')) {
            $this->logger->debug('Realtime broadcast returned non-2xx response.', [
                'type' => $type,
                'status' => $http_response_header[0],
            ]);
        }
    }
}
