<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Event Listener that converts exceptions to JSON responses for API routes
 * This ensures frontend always gets proper JSON with status codes
 */
#[AsEventListener(event: 'kernel.exception', priority: 10)]
class ApiExceptionListener {
    public function __invoke(ExceptionEvent $event): void {
        $request = $event->getRequest();

        // Only handle API routes (starting with /api)
        if (!str_starts_with($request->getPathInfo(), '/api')) {
            return;
        }

        $exception = $event->getThrowable();
        $statusCode = 500;
        $message = $exception->getMessage();

        // Handle different exception types
        if ($exception instanceof AccessDeniedException) {
            $statusCode = 403;
            $message = $message ?: 'Access Denied';
        }
        elseif ($exception instanceof HttpExceptionInterface) {
            $statusCode = $exception->getStatusCode();
        }

        // Create JSON response
        $response = new JsonResponse([
            'status' => 'error',
            'message' => $message,
            'code' => $statusCode
        ], $statusCode);

        $event->setResponse($response);
    }
}
