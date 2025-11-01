<?php

namespace App\Controller;

use App\Application\Command\User\CreateUserCommand;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\HandledStamp;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_security_')]
class SecurityController extends AbstractController {
    
    public function __construct(
        private UserRepository $userRepository,
        private MessageBusInterface $commandBus
    ) {}

    /**
     * Register new user
     * Command: CreateUserCommand (default role: reporter)
     */
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            // Validate required fields
            if (empty($data['email']) || empty($data['password']) || 
                empty($data['firstName']) || empty($data['lastName'])) {
                return $this->json([
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'validation.missing_fields'
                ], 400);
            }

            // Validate email format
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return $this->json([
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'validation.email_invalid'
                ], 400);
            }

            // Validate password length
            if (strlen($data['password']) < 8) {
                return $this->json([
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'validation.password_min_length'
                ], 400);
            }

            // Check if email already exists
            $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
            if ($existingUser) {
                return $this->json([
                    'status' => 'error',
                    'code' => 409,
                    'message' => 'user.email_exists'
                ], 409);
            }

            // Use CreateUserCommand (CQRS)
            $command = new CreateUserCommand(
                email: $data['email'],
                password: $data['password'],
                firstName: $data['firstName'],
                lastName: $data['lastName'],
                roleId: null // null = default role (reporter)
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
                    'role' => $user->getUserRole()->getName()
                ]
            ], 201);

        }
        catch (\InvalidArgumentException $e) {
            return $this->json([
                'status' => 'error',
                'code' => 400,
                'message' => $e->getMessage()
            ], 400);
        }
        catch (\Exception $e) {
            return $this->json([
                'status' => 'error',
                'code' => 500,
                'message' => 'error.register_user_failed'
            ], 500);
        }
    }

    /**
     * Login endpoint - handled by security.yaml (json_login firewall)
     * This route is required for Symfony routing, but the actual authentication
     * is handled by Lexik JWT Bundle through security.yaml configuration.
     * 
     * POST /api/login
     * Body: {"username": "email@example.com", "password": "password123"}
     * Returns: {"token": "JWT_TOKEN_HERE"}
     */
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(): never {
        // This code is never executed - security.yaml intercepts the request
        // and Lexik JWT Bundle handles authentication
        throw new \LogicException('This method should never be called. Check security.yaml configuration.');
    }

    /**
     * Get current authenticated user info
     */
    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(): JsonResponse {
        try {
            $user = $this->getUser();

            if (!$user instanceof User) {
                return $this->json([
                    'status' => 'error',
                    'code' => 401,
                    'message' => 'permission.not_authenticated'
                ], 401);
            }

            return $this->json([
                'status' => 'success',
                'data' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'role' => $user->getUserRole()?->getName(),
                    'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s')
                ]
            ]);

        }
        catch (\Exception $e) {
            return $this->json([
                'status' => 'error',
                'code' => 500,
                'message' => 'error.fetch_user_info_failed'
            ], 500);
        }
    }
}
