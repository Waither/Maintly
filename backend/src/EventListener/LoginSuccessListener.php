<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\RateLimiter\RateLimiterFactory;

/**
 * Handles login rate limiting:
 * - Consumes 1 token on failed login (4xx/5xx)
 * - Resets counter on successful login (200)
 * This prevents legitimate users from being locked out after failed attempts.
 */
#[AsEventListener(event: KernelEvents::RESPONSE, priority: 0)]
class LoginSuccessListener {
    public function __construct(
        private RateLimiterFactory $loginLimiter,
    ) {}

    public function __invoke(ResponseEvent $event): void {
        $request = $event->getRequest();
        $response = $event->getResponse();

        // Only process /api/login POST requests
        if ($request->getPathInfo() !== '/api/login' || $request->getMethod() !== 'POST') {
            return;
        }

        $clientIp = $request->getClientIp();
        $limiter = $this->loginLimiter->create($clientIp);
        $statusCode = $response->getStatusCode();

        if ($statusCode === 200) {
            // Reset rate limiter on successful login
            $limiter->reset();
        }
        elseif ($statusCode >= 400 && $statusCode < 500) {
            // Consume 1 token on failed login (client errors)
            $limiter->consume(1);
        }
    }
}
