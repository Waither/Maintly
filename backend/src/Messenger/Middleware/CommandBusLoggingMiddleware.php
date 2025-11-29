<?php

namespace App\Messenger\Middleware;

use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\Middleware\MiddlewareInterface;
use Symfony\Component\Messenger\Middleware\StackInterface;
use Symfony\Component\Messenger\Stamp\ReceivedStamp;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Middleware for logging all Command and Query messages in CQRS pattern
 * Logs: message class, user, timestamp, parameters, execution time
 */
final class CommandBusLoggingMiddleware implements MiddlewareInterface
{
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly TokenStorageInterface $tokenStorage,
    ) {
    }

    public function handle(Envelope $envelope, StackInterface $stack): Envelope
    {
        // Skip logging for received messages (already logged when dispatched)
        if ($envelope->last(ReceivedStamp::class)) {
            return $stack->next()->handle($envelope, $stack);
        }

        $message = $envelope->getMessage();
        $messageClass = get_class($message);
        
        // Get current user (if authenticated)
        $user = null;
        $token = $this->tokenStorage->getToken();
        if ($token && $token->getUser()) {
            $user = $token->getUser();
            $userId = method_exists($user, 'getId') ? $user->getId() : null;
            $userEmail = method_exists($user, 'getUserIdentifier') ? $user->getUserIdentifier() : null;
        }

        // Extract message data (public readonly properties)
        $messageData = $this->extractMessageData($message);

        // Log command/query dispatch
        $this->logger->info('Message dispatched', [
            'message' => $messageClass,
            'user_id' => $userId ?? null,
            'user_email' => $userEmail ?? null,
            'data' => $messageData,
            'timestamp' => (new \DateTimeImmutable())->format('Y-m-d H:i:s'),
        ]);

        $startTime = microtime(true);

        try {
            // Continue to next middleware/handler
            $envelope = $stack->next()->handle($envelope, $stack);

            $executionTime = round((microtime(true) - $startTime) * 1000, 2); // ms

            // Log success
            $this->logger->info('Message handled successfully', [
                'message' => $messageClass,
                'execution_time_ms' => $executionTime,
            ]);

            return $envelope;

        } catch (\Throwable $e) {
            $executionTime = round((microtime(true) - $startTime) * 1000, 2);

            // Log failure
            $this->logger->error('Message handling failed', [
                'message' => $messageClass,
                'user_id' => $userId ?? null,
                'data' => $messageData,
                'execution_time_ms' => $executionTime,
                'error' => $e->getMessage(),
                'exception' => get_class($e),
            ]);

            throw $e;
        }
    }

    /**
     * Extract public properties from message for logging
     * @return array<string, mixed>
     */
    private function extractMessageData(object $message): array
    {
        $data = [];
        
        try {
            $reflection = new \ReflectionClass($message);
            
            foreach ($reflection->getProperties(\ReflectionProperty::IS_PUBLIC) as $property) {
                $name = $property->getName();
                $value = $property->getValue($message);
                
                // Sanitize sensitive data
                if (in_array(strtolower($name), ['password', 'token', 'secret', 'key'])) {
                    $data[$name] = '***REDACTED***';
                } elseif (is_object($value) && method_exists($value, 'getId')) {
                    // For entity objects, log just the ID
                    $data[$name] = get_class($value) . '#' . $value->getId();
                } elseif (is_array($value)) {
                    $data[$name] = count($value) . ' items';
                } else {
                    // Log scalar values directly
                    $data[$name] = $value;
                }
            }
        } catch (\ReflectionException $e) {
            $data['_error'] = 'Could not extract message data';
        }

        return $data;
    }
}
