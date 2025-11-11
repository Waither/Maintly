<?php

namespace App\Controller;

use App\Application\Command\User\CreateUserCommand;
use App\Application\Command\User\DeleteUserCommand;
use App\Application\Command\User\UpdateUserCommand;
use App\Application\Query\User\GetUserQuery;
use App\Application\Query\User\GetUsersListQuery;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Repository\UserRoleRepository;
use Exception;
use InvalidArgumentException;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
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
        private UserRepository $userRepository,
    ) {}

    /**
     * Get paginated list of users
     * Query: GetUsersListQuery.
     */
    #[Route('', name: 'list', methods: ['GET'])]
    #[OA\Get(
        path: '/api/users',
        summary: 'Get paginated list of users',
        tags: ['Users'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'User list retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(property: 'code', type: 'integer', example: 200),
                        new OA\Property(property: 'message', type: 'string', example: 'user.list.retrieved'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(
                                    property: 'users',
                                    type: 'array',
                                    items: new OA\Items(ref: new Model(type: User::class)),
                                ),
                                new OA\Property(
                                    property: 'pagination',
                                    type: 'object',
                                    properties: [
                                        new OA\Property(property: 'currentPage', type: 'integer', example: 1),
                                        new OA\Property(property: 'totalPages', type: 'integer', example: 5),
                                        new OA\Property(property: 'totalItems', type: 'integer', example: 50),
                                        new OA\Property(property: 'itemsPerPage', type: 'integer', example: 10),
                                    ],
                                ),
                            ],
                        ),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'error.fetch_users_failed'),
        ],
    )]
    public function list(Request $request): JsonResponse {
        try {
            $page = max(1, (int) $request->query->get('page', 1));
            $limit = min(100, max(1, (int) $request->query->get('limit', 20)));

            $query = new GetUsersListQuery(
                page: $page,
                limit: $limit,
            );

            $envelope = $this->queryBus->dispatch($query);
            $result = $envelope->last(HandledStamp::class)->getResult();

            // Transform users to array
            $data = array_map(function (User $user) {
                return [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'role' => $user->getUserRole()?->getName(),
                    'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s'),
                ];
            }, $result['users']);

            return $this->successResponse([
                'users' => $data,
                'pagination' => $result['pagination'],
            ]);
        }
        catch (Exception $e) {
            return $this->serverErrorResponse('error.fetch_users_failed');
        }
    }

    /**
     * Create new user
     * Command: CreateUserCommand.
     */
    #[Route('', name: 'create', methods: ['POST'])]
    #[OA\Post(
        path: '/api/users',
        summary: 'Create a new user',
        tags: ['Users'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'john.doe@example.com'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'SecurePass123'),
                    new OA\Property(property: 'firstName', type: 'string', example: 'John'),
                    new OA\Property(property: 'lastName', type: 'string', example: 'Doe'),
                    new OA\Property(property: 'roleId', type: 'integer', example: 2),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'User created successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(property: 'code', type: 'integer', example: 201),
                        new OA\Property(property: 'message', type: 'string', example: 'user.created'),
                        new OA\Property(
                            property: 'user',
                            ref: new Model(type: User::class),
                        ),
                    ],
                ),
            ),
            new OA\Response(response: '400-1', description: 'validation.email_required'),
            new OA\Response(response: '400-2', description: 'validation.password_min_length'),
            new OA\Response(response: '400-3', description: 'validation.name_required'),
            new OA\Response(response: 403, description: 'permission.create_user_denied'),
            new OA\Response(response: '400-4', description: 'validation.invalid_role'),
            new OA\Response(response: 500, description: 'error.create_user_failed'),
        ],
    )]
    public function create(Request $request): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            // Basic validation
            if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return $this->errorResponse('validation.email_required');
            }

            if (empty($data['password']) || strlen($data['password']) < 8) {
                return $this->errorResponse('validation.password_min_length');
            }

            if (empty($data['firstName']) || empty($data['lastName'])) {
                return $this->errorResponse('validation.name_required');
            }

            // Check permission: can current user create user with this role?
            $roleId = $data['roleId'] ?? null;
            if ($roleId) {
                $targetRole = $this->roleRepository->find($roleId);
                if (!$targetRole) {
                    return $this->errorResponse('validation.invalid_role');
                }

                // Voter check: USER_CREATE permission
                $this->denyAccessUnlessGranted('USER_CREATE', $targetRole);
            }

            $command = new CreateUserCommand(
                email: $data['email'],
                password: $data['password'],
                firstName: $data['firstName'],
                lastName: $data['lastName'],
                roleId: $roleId,
            );

            $envelope = $this->commandBus->dispatch($command);
            $user = $envelope->last(HandledStamp::class)->getResult();

            return $this->createdResponse([
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'role' => $user->getUserRole()->getName(),
                'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s'),
            ], 'user.created');
        }
        catch (AccessDeniedException $e) {
            return $this->forbiddenResponse('permission.create_user_denied');
        }
        catch (InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage());
        }
        catch (Exception $e) {
            return $this->serverErrorResponse('error.create_user_failed');
        }
    }

    /**
     * Get single user by ID
     * Query: GetUserQuery.
     */
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    #[OA\Get(
        path: '/api/users/{id}',
        summary: 'Get user by ID',
        tags: ['Users'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'User retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(property: 'code', type: 'integer', example: 200),
                        new OA\Property(property: 'message', type: 'string', example: 'user.created'),
                        new OA\Property(
                            property: 'user',
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
            new OA\Response(response: 404, description: 'user.not_found'),
            new OA\Response(response: 500, description: 'error.fetch_user_failed'),
        ],
    )]
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
                ] : null,
                'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s'),
            ]);
        }
        catch (Exception $e) {
            return $this->serverErrorResponse('error.fetch_user_failed');
        }
    }

    /**
     * Update user
     * Command: UpdateUserCommand.
     */
    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    #[OA\Put(
        path: '/api/users/{id}',
        summary: 'Update user by ID',
        tags: ['Users'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'john.doe@example.com'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'SecurePass123'),
                    new OA\Property(property: 'firstName', type: 'string', example: 'John'),
                    new OA\Property(property: 'lastName', type: 'string', example: 'Doe'),
                    new OA\Property(property: 'roleId', type: 'integer', example: 2),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'User updated successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(property: 'code', type: 'integer', example: 200),
                        new OA\Property(property: 'message', type: 'string', example: 'user.updated'),
                        new OA\Property(
                            property: 'user',
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
            new OA\Response(response: '400-1', description: 'validation.email_invalid'),
            new OA\Response(response: '400-2', description: 'validation.password_min_length'),
            new OA\Response(response: 404, description: 'user.not_found'),
            new OA\Response(response: 500, description: 'error.update_user_failed'),
        ],
    )]
    public function update(int $id, Request $request): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            // Validate email if provided
            if (isset($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return $this->errorResponse('validation.email_invalid');
            }

            // Validate password length if provided
            if (isset($data['password']) && strlen($data['password']) < 8) {
                return $this->errorResponse('validation.password_min_length');
            }

            $command = new UpdateUserCommand(
                id: $id,
                email: $data['email'] ?? null,
                password: $data['password'] ?? null,
                firstName: $data['firstName'] ?? null,
                lastName: $data['lastName'] ?? null,
                roleId: $data['roleId'] ?? null,
            );

            $envelope = $this->commandBus->dispatch($command);
            $user = $envelope->last(HandledStamp::class)->getResult();

            return $this->successResponse([
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'role' => $user->getUserRole()->getName(),
                'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s'),
            ], 200, 'user.updated');
        }
        catch (InvalidArgumentException $e) {
            return $this->notFoundResponse('user.not_found');
        }
        catch (Exception $e) {
            return $this->serverErrorResponse('error.update_user_failed');
        }
    }

    /**
     * Delete user
     * Command: DeleteUserCommand.
     */
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[OA\Delete(
        path: '/api/users/{id}',
        summary: 'Delete user by ID',
        tags: ['Users'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'ID', type: 'integer', example: 1),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'User deleted successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(property: 'code', type: 'integer', example: 200),
                        new OA\Property(property: 'message', type: 'string', example: 'user.deleted'),
                        new OA\Property(property: 'data', type: 'object', example: null),
                    ],
                ),
            ),
            new OA\Response(response: 403, description: 'permission.delete_user_denied'),
            new OA\Response(response: 404, description: 'user.not_found'),
            new OA\Response(response: 500, description: 'error.delete_user_failed'),
        ],
    )]
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
        catch (InvalidArgumentException $e) {
            return $this->notFoundResponse('user.not_found');
        }
        catch (Exception $e) {
            return $this->serverErrorResponse('error.delete_user_failed');
        }
    }
}
