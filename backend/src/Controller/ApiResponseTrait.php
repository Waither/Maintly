<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Trait for standardized API responses.
 *
 * All responses include:
 * - status: "success" or "error"
 * - code: HTTP status code (200, 201, 400, 403, 404, 500, etc.)
 * - data/message: payload or error message
 */
trait ApiResponseTrait {
    /**
     * Success response with data.
     */
    protected function successResponse(mixed $data, int $code = 200, ?string $message = null): JsonResponse {
        $response = [
            'status' => 'success',
            'code' => $code,
            'data' => $data,
        ];

        if ($message !== null) {
            $response['message'] = $message;
        }

        return new JsonResponse($response, $code);
    }

    /**
     * Error response with message.
     */
    protected function errorResponse(string $message, int $code = 400, ?array $errors = null): JsonResponse {
        $response = [
            'status' => 'error',
            'code' => $code,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return new JsonResponse($response, $code);
    }

    /**
     * Created response (201).
     */
    protected function createdResponse(mixed $data, ?string $message = null): JsonResponse {
        return $this->successResponse($data, 201, $message ?? 'Resource created successfully');
    }

    /**
     * Not found response (404).
     */
    protected function notFoundResponse(string $message = 'Resource not found'): JsonResponse {
        return $this->errorResponse($message, 404);
    }

    /**
     * Forbidden response (403).
     */
    protected function forbiddenResponse(string $message = 'Access denied'): JsonResponse {
        return $this->errorResponse($message, 403);
    }

    /**
     * Unauthorized response (401).
     */
    protected function unauthorizedResponse(string $message = 'Unauthorized'): JsonResponse {
        return $this->errorResponse($message, 401);
    }

    /**
     * Validation error response (422).
     */
    protected function validationErrorResponse(string $message, array $errors): JsonResponse {
        return $this->errorResponse($message, 422, $errors);
    }

    /**
     * Server error response (500).
     */
    protected function serverErrorResponse(string $message = 'Internal server error'): JsonResponse {
        return $this->errorResponse($message, 500);
    }
}
