<?php

namespace App\Controller;

use App\Application\Command\User\CreateUserCommand;
use App\Application\Command\User\UpdateUserCommand;
use App\Application\Command\User\DeleteUserCommand;
use App\Application\Query\User\GetUserQuery;
use App\Application\Query\User\GetUsersListQuery;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Repository\UserRoleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\HandledStamp;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[Route('/api/users', name: 'users_')]
class UserController extends AbstractController {
    
    use ApiResponseTrait;
    
    public function __construct(
        private MessageBusInterface $commandBus,
        private MessageBusInterface $queryBus,
        private UserRoleRepository $roleRepository,
        private UserRepository $userRepository
    ) {}

    /**
     * Get paginated list of users
     * Query: GetUsersListQuery
     */
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request): JsonResponse {
        try {
            $page = max(1, (int) $request->query->get('page', 1));
            $limit = min(100, max(1, (int) $request->query->get('limit', 20)));

            $query = new GetUsersListQuery(
                page: $page,
                limit: $limit
            );
            
            $envelope = $this->queryBus->dispatch($query);
            $result = $envelope->last(HandledStamp::class)->getResult();
            
            // Transform users to array
            $data = array_map(function(User $user) {
                return [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'role' => $user->getUserRole()?->getName(),
                    'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s')
                ];
            }, $result['users']);

            return $this->successResponse([
                'users' => $data,
                'pagination' => $result['pagination']
            ]);
        }
        catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to fetch users: ' . $e->getMessage());
        }
    }

    /**
     * Create new user
     * Command: CreateUserCommand
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            // Basic validation
            if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return $this->errorResponse('validation.email_required', 400);
            }

            if (empty($data['password']) || strlen($data['password']) < 8) {
                return $this->errorResponse('validation.password_min_length', 400);
            }

            if (empty($data['firstName']) || empty($data['lastName'])) {
                return $this->errorResponse('validation.name_required', 400);
            }

            // Check permission: can current user create user with this role?
            $roleId = $data['roleId'] ?? null;
            if ($roleId) {
                $targetRole = $this->roleRepository->find($roleId);
                if (!$targetRole) {
                    return $this->errorResponse('validation.invalid_role', 400);
                }

                // Voter check: USER_CREATE permission
                $this->denyAccessUnlessGranted('USER_CREATE', $targetRole);
            }

            $command = new CreateUserCommand(
                email: $data['email'],
                password: $data['password'],
                firstName: $data['firstName'],
                lastName: $data['lastName'],
                roleId: $roleId
            );
            
            $envelope = $this->commandBus->dispatch($command);
            $user = $envelope->last(HandledStamp::class)->getResult();

            return $this->createdResponse([
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'role' => $user->getUserRole()->getName(),
                'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s')
            ], 'user.created');
        }
        catch (AccessDeniedException $e) {
            return $this->forbiddenResponse('permission.create_user_denied');
        }
        catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
        catch (\Exception $e) {
            return $this->serverErrorResponse('error.create_user_failed');
        }
    }

    /**
     * Get single user by ID
     * Query: GetUserQuery
     */
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse {
        try {
            $query = new GetUserQuery(id: $id);
            
            $envelope = $this->queryBus->dispatch($query);
            $user = $envelope->last(HandledStamp::class)->getResult();

            if (!$user) {
                return $this->notFoundResponse('user.not_found');
            }

            $role = $user->getUserRole();

            return $this->successResponse([
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'role' => $role ? [
                    'id' => $role->getId(),
                    'name' => $role->getName(),
                    'description' => $role->getDescription()
                ] : null,
                'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s')
            ]);
        }
        catch (\Exception $e) {
            return $this->serverErrorResponse('error.fetch_user_failed');
        }
    }

    /**
     * Update user
     * Command: UpdateUserCommand
     */
    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            // Validate email if provided
            if (isset($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return $this->errorResponse('validation.email_invalid', 400);
            }

            // Validate password length if provided
            if (isset($data['password']) && strlen($data['password']) < 8) {
                return $this->errorResponse('validation.password_min_length', 400);
            }

            $command = new UpdateUserCommand(
                id: $id,
                email: $data['email'] ?? null,
                password: $data['password'] ?? null,
                firstName: $data['firstName'] ?? null,
                lastName: $data['lastName'] ?? null,
                roleId: $data['roleId'] ?? null
            );
            
            $envelope = $this->commandBus->dispatch($command);
            $user = $envelope->last(HandledStamp::class)->getResult();

            return $this->successResponse([
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'role' => $user->getUserRole()->getName(),
                'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s')
            ], 200, 'user.updated');
        }
        catch (\InvalidArgumentException $e) {
            return $this->notFoundResponse('user.not_found');
        }
        catch (\Exception $e) {
            return $this->serverErrorResponse('error.update_user_failed');
        }
    }

    /**
     * Delete user
     * Command: DeleteUserCommand
     */
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse {
        try {
            // Get user to check permissions
            $user = $this->userRepository->find($id);
            if (!$user) {
                return $this->notFoundResponse('user.not_found');
            }

            // Voter check: USER_DELETE permission
            $this->denyAccessUnlessGranted('USER_DELETE', $user);

            $command = new DeleteUserCommand(id: $id);
            
            $this->commandBus->dispatch($command);

            return $this->successResponse(null, 200, 'user.deleted');
        }
        catch (AccessDeniedException $e) {
            return $this->forbiddenResponse('permission.delete_user_denied');
        }
        catch (\InvalidArgumentException $e) {
            return $this->notFoundResponse('user.not_found');
        }
        catch (\Exception $e) {
            return $this->serverErrorResponse('error.delete_user_failed');
        }
    }
}
