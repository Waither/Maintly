<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\RateLimiter\RateLimiterFactory;

/**
 * Rate limiter for /api/login endpoint
 * Protects against bruteforce attacks
 * Limit: 5 attempts per 15 minutes per IP.
 */
#[AsEventListener(event: KernelEvents::REQUEST, priority: 10)]
class LoginRateLimiterListener {
    public function __construct(
        private RateLimiterFactory $loginLimiter,
    ) {}

    public function __invoke(RequestEvent $event): void {
        $request = $event->getRequest();

        // Only check /api/login POST requests
        if ($request->getPathInfo() !== '/api/login' || $request->getMethod() !== 'POST') {
            return;
        }

        // Check rate limit per IP (peek only - don't consume yet)
        $limiter = $this->loginLimiter->create($request->getClientIp());

        // Only block if limit exceeded (peek doesn't consume)
        if ($limiter->consume(0)->isAccepted() === false) {
            $response = new JsonResponse([
                'status' => 'error',
                'code' => 429,
                'message' => 'error.too_many_login_attempts',
            ], 429);

            $event->setResponse($response);
        }
    }
}
