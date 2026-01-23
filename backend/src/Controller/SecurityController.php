<?php

namespace App\Controller;

use App\Application\Command\User\CreateUserCommand;
use App\Entity\User;
use App\Repository\UserRepository;
use Exception;
use InvalidArgumentException;
use LogicException;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\HandledStamp;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_security_')]
class SecurityController extends AbstractController {
    public function __construct(
        private UserRepository $userRepository,
        private MessageBusInterface $commandBus,
        private UserPasswordHasherInterface $passwordHasher,
    ) {}

    /**
     * Register new user (Manager/Admin only)
     * Command: CreateUserCommand (default role: reporter)
     * Only managers and admins can create new user accounts.
     */
    #[Route('/register', name: 'register', methods: ['POST'])]
    #[OA\Post(
        path: '/api/register',
        summary: 'Register a new user (Manager+ only)',
        description: 'Creates a new user account with default reporter role. Requires ROLE_MANAGER or ROLE_ADMIN.',
        security: [['Bearer' => []]],
        tags: ['Manager+'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password', 'firstName', 'lastName'],
                properties: [
                    new OA\Property(
                        property: 'email',
                        type: 'string',
                        format: 'email',
                        example: 'john.doe@example.com',
                    ),
                    new OA\Property(
                        property: 'password',
                        type: 'string',
                        format: 'password',
                        minLength: 8,
                        example: 'SecurePass123',
                    ),
                    new OA\Property(
                        property: 'firstName',
                        type: 'string',
                        example: 'John',
                    ),
                    new OA\Property(
                        property: 'lastName',
                        type: 'string',
                        example: 'Doe',
                    ),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'User registered successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(property: 'code', type: 'integer', example: 201),
                        new OA\Property(property: 'message', type: 'string', example: 'user.registered'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'id', type: 'integer', example: 1),
                                new OA\Property(property: 'email', type: 'string', example: 'john.doe@example.com'),
                                new OA\Property(property: 'firstName', type: 'string', example: 'John'),
                                new OA\Property(property: 'lastName', type: 'string', example: 'Doe'),
                                new OA\Property(property: 'role', type: 'string', example: 'reporter'),
                            ],
                        ),
                    ],
                ),
            ),
            new OA\Response(
                response: 400,
                description: 'Validation error',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'error'),
                        new OA\Property(property: 'code', type: 'integer', example: 400),
                        new OA\Property(property: 'message', type: 'string', example: 'validation.missing_fields'),
                    ],
                ),
            ),
            new OA\Response(
                response: 409,
                description: 'Email already exists',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'error'),
                        new OA\Property(property: 'code', type: 'integer', example: 409),
                        new OA\Property(property: 'message', type: 'string', example: 'user.email_exists'),
                    ],
                ),
            ),
            new OA\Response(response: 500, description: 'Internal server error'),
        ],
    )]
    public function register(Request $request): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            // Validate required fields
            if (empty($data['email']) || empty($data['password'])
                || empty($data['firstName']) || empty($data['lastName'])) {
                return $this->json([
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'validation.missing_fields',
                ], 400);
            }

            // Validate email format
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return $this->json([
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'validation.email_invalid',
                ], 400);
            }

            // Validate password length
            if (strlen($data['password']) < 8) {
                return $this->json([
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'validation.password_min_length',
                ], 400);
            }

            // Check if email already exists
            $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
            if ($existingUser) {
                return $this->json([
                    'status' => 'error',
                    'code' => 409,
                    'message' => 'user.email_exists',
                ], 409);
            }

            // Use CreateUserCommand (CQRS)
            $command = new CreateUserCommand(
                email: $data['email'],
                password: $data['password'],
                firstName: $data['firstName'],
                lastName: $data['lastName'],
                roleId: null, // null = default role (reporter)
            );

            $envelope = $this->commandBus->dispatch($command);
            $user = $envelope->last(HandledStamp::class)->getResult();

            return $this->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'user.registered',
                'data' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'role' => $user->getUserRole()->getName(),
                ],
            ], 201);
        }
        catch (InvalidArgumentException $e) {
            return $this->json([
                'status' => 'error',
                'code' => 400,
                'message' => $e->getMessage(),
            ], 400);
        }
        catch (Exception $e) {
            return $this->json([
                'status' => 'error',
                'code' => 500,
                'message' => 'error.register_user_failed',
            ], 500);
        }
    }

    /**
     * Login endpoint - handled by security.yaml (json_login firewall)
     * This route is required for Symfony routing, but the actual authentication
     * is handled by Lexik JWT Bundle through security.yaml configuration.
     */
    #[Route('/login', name: 'login', methods: ['POST'])]
    #[OA\Post(
        path: '/api/login',
        summary: 'Login with email and password',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'admin@maintly.com'),
                    new OA\Property(property: 'password', type: 'string', example: 'MaintlyAdmin!@#'),
                ],
            ),
        ),
        tags: ['Public'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Login successful',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'token', type: 'string', example: 'eyJ0eXAiOiJKV1QiLCJhbGc...'),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Invalid credentials'),
        ],
    )]
    public function login(): never {
        // This code is never executed - security.yaml intercepts the request
        // and Lexik JWT Bundle handles authentication
        throw new LogicException('This method should never be called. Check security.yaml configuration.');
    }

    /**
     * Get current authenticated user info.
     */
    #[Route('/me', name: 'me', methods: ['GET'])]
    #[OA\Get(
        path: '/api/me',
        summary: 'Get current authenticated user info',
        tags: ['Authenticated'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'User info retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'id', type: 'integer', example: 1),
                                new OA\Property(property: 'email', type: 'string', example: 'user@example.com'),
                                new OA\Property(property: 'firstName', type: 'string', example: 'John'),
                                new OA\Property(property: 'lastName', type: 'string', example: 'Doe'),
                                new OA\Property(property: 'role', type: 'string', example: 'ROLE_USER'),
                                new OA\Property(property: 'createdAt', type: 'string', example: '2023-01-01 12:00:00'),
                            ],
                        ),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Invalid credentials'),
            new OA\Response(response: 500, description: 'Internal server error'),
        ],
    )]
    public function me(): JsonResponse {
        try {
            $user = $this->getUser();

            if (!$user instanceof User) {
                return $this->json([
                    'status' => 'error',
                    'code' => 401,
                    'message' => 'permission.not_authenticated',
                ], 401);
            }

            return $this->json([
                'status' => 'success',
                'data' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'phone' => $user->getPhone(),
                    'role' => $user->getUserRole()?->getName(),
                    'fullName' => $user->getFirstName() . ' ' . $user->getLastName(),
                    'isActive' => $user->isActive(),
                    'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s'),
                    'lastLoginAt' => $user->getLastLoginAt()?->format('Y-m-d H:i:s'),
                ],
            ]);
        }
        catch (Exception $e) {
            return $this->json([
                'status' => 'error',
                'code' => 500,
                'message' => 'error.fetch_user_info_failed',
            ], 500);
        }
    }

    /**
     * Change current user's password
     */
    #[Route('/me/password', name: 'me_password', methods: ['PATCH'])]
    #[OA\Patch(
        path: '/api/me/password',
        summary: 'Change current user password',
        tags: ['Authenticated'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['currentPassword', 'newPassword'],
                properties: [
                    new OA\Property(property: 'currentPassword', type: 'string'),
                    new OA\Property(property: 'newPassword', type: 'string', minLength: 8),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 200, description: 'Password changed successfully'),
            new OA\Response(response: 400, description: 'Invalid current password'),
            new OA\Response(response: 401, description: 'Not authenticated'),
        ],
    )]
    public function changePassword(Request $request): JsonResponse {
        try {
            $user = $this->getUser();

            if (!$user instanceof User) {
                return $this->json([
                    'status' => 'error',
                    'code' => 401,
                    'message' => 'permission.not_authenticated',
                ], 401);
            }

            $data = json_decode($request->getContent(), true);
            $currentPassword = $data['currentPassword'] ?? '';
            $newPassword = $data['newPassword'] ?? '';

            // Validate new password length
            if (strlen($newPassword) < 8) {
                return $this->json([
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'validation.password_min_length',
                ], 400);
            }

            // Verify current password
            if (!$this->passwordHasher->isPasswordValid($user, $currentPassword)) {
                return $this->json([
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'validation.wrong_current_password',
                ], 400);
            }

            // Hash and save new password
            $hashedPassword = $this->passwordHasher->hashPassword($user, $newPassword);
            $user->setPassword($hashedPassword);
            $this->userRepository->save($user);

            return $this->json([
                'status' => 'success',
                'message' => 'password.changed_successfully',
            ]);
        }
        catch (Exception $e) {
            return $this->json([
                'status' => 'error',
                'code' => 500,
                'message' => 'error.password_change_failed',
            ], 500);
        }
    }
}
