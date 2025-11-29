<?php

namespace App\EventSubscriber;

use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Logs all HTTP API requests with user, IP, method, endpoint, response status, execution time
 * Saves to api.log (separate from general logs).
 */
class ApiRequestLoggingSubscriber implements EventSubscriberInterface {
    /**
     * @var array<string, float>
     */
    private array $requestStartTimes = [];

    public function __construct(
        private readonly LoggerInterface $apiLogger,
        private readonly TokenStorageInterface $tokenStorage,
    ) {}

    public static function getSubscribedEvents(): array {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 10],
            KernelEvents::RESPONSE => ['onKernelResponse', -10],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();

        // Skip non-API routes (assets, _profiler, etc.)
        if (!$this->shouldLog($request)) {
            return;
        }

        // Store start time for calculating execution time
        $requestId = spl_object_hash($request);
        $this->requestStartTimes[$requestId] = microtime(true);
    }

    public function onKernelResponse(ResponseEvent $event): void {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $response = $event->getResponse();

        if (!$this->shouldLog($request)) {
            return;
        }

        $requestId = spl_object_hash($request);
        $executionTime = isset($this->requestStartTimes[$requestId])
            ? round((microtime(true) - $this->requestStartTimes[$requestId]) * 1000, 2)
            : null;

        // Get authenticated user
        $user = null;
        $userId = null;
        $userEmail = null;

        $token = $this->tokenStorage->getToken();
        if ($token && $token->getUser()) {
            $user = $token->getUser();
            $userId = method_exists($user, 'getId') ? $user->getId() : null;
            $userEmail = $user->getUserIdentifier();
        }

        // Extract request data
        $method = $request->getMethod();
        $uri = $request->getRequestUri();
        $route = $request->attributes->get('_route');
        $controller = $request->attributes->get('_controller');
        $statusCode = $response->getStatusCode();
        $ipAddress = $request->getClientIp();
        $userAgent = $request->headers->get('User-Agent');

        // Get request body size (for POST/PUT/PATCH)
        $requestSize = $request->getContent() ? strlen($request->getContent()) : 0;

        // Get response size
        $responseSize = $response->headers->get('Content-Length')
            ?? strlen($response->getContent());

        // Log the request
        $context = [
            'method' => $method,
            'uri' => $uri,
            'route' => $route,
            'controller' => $this->shortenController($controller),
            'status' => $statusCode,
            'user_id' => $userId,
            'user_email' => $userEmail,
            'ip_address' => $ipAddress,
            'execution_time_ms' => $executionTime,
            'request_size_bytes' => $requestSize,
            'response_size_bytes' => $responseSize,
            'user_agent' => substr($userAgent, 0, 100), // Truncate long user agents
        ];

        // Log level based on status code
        if ($statusCode >= 500) {
            $this->apiLogger->error("API Request: $method $uri", $context);
        }
        elseif ($statusCode >= 400) {
            $this->apiLogger->warning("API Request: $method $uri", $context);
        }
        else {
            $this->apiLogger->info("API Request: $method $uri", $context);
        }

        // Cleanup
        unset($this->requestStartTimes[$requestId]);
    }

    /**
     * Determine if request should be logged.
     */
    private function shouldLog(Request $request): bool {
        $uri = $request->getRequestUri();

        // Skip profiler, assets, health checks
        $skipPatterns = [
            '/_profiler',
            '/_wdt',
            '/assets/',
            '/bundles/',
            '/favicon.ico',
            '/health',
            '/ping',
        ];

        foreach ($skipPatterns as $pattern) {
            if (str_starts_with($uri, $pattern)) {
                return false;
            }
        }

        // Only log /api/* routes (or adjust as needed)
        return str_starts_with($uri, '/api/');
    }

    /**
     * Shorten controller name for readability.
     */
    private function shortenController(?string $controller): ?string {
        if (!$controller) {
            return null;
        }

        // Convert "App\Controller\WorkOrderController::index" to "WorkOrderController::index"
        if (preg_match('/Controller\\\\(\w+Controller)::\w+/', $controller, $matches)) {
            return $matches[0];
        }

        return $controller;
    }
}
