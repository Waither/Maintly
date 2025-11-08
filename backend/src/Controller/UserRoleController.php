<?php

namespace App\Controller;

use App\Application\Command\UserRole\CreateUserRoleCommand;
use App\Application\Command\UserRole\DeleteUserRoleCommand;
use App\Application\Command\UserRole\UpdateUserRoleCommand;
use App\Application\Query\UserRole\GetUserRoleQuery;
use App\Application\Query\UserRole\GetUserRolesListQuery;
use App\Entity\UserRole;
use Exception;
use InvalidArgumentException;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\HandledStamp;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/roles', name: 'roles_')]
class UserRoleController extends AbstractController {
    public function __construct(
        private MessageBusInterface $commandBus,
        private MessageBusInterface $queryBus,
    ) {}

    /**
     * Get simple roles list for select/dropdown (manager+)
     * Used in frontend forms when creating/editing users
     * Query: GetUserRolesListQuery.
     */
    #[Route('/select', name: 'select', methods: ['GET'])]
    #[OA\Get(
        path: '/api/roles/select',
        summary: 'Get simplified roles list for dropdowns',
        description: 'Returns a simplified list of roles formatted for select/dropdown components',
        tags: ['User Roles'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Roles list retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'value', type: 'integer', example: 1),
                                    new OA\Property(property: 'label', type: 'string', example: 'admin'),
                                ],
                            ),
                        ),
                    ],
                ),
            ),
            new OA\Response(response: 500, description: 'Server error'),
        ],
    )]
    public function select(): JsonResponse {
        try {
            $query = new GetUserRolesListQuery();

            $envelope = $this->queryBus->dispatch($query);
            $roles = $envelope->last(HandledStamp::class)->getResult();

            // Simple format for <select> or dropdown
            $data = array_map(function (UserRole $role) {
                return [
                    'value' => $role->getId(),
                    'label' => $role->getName(),
                ];
            }, $roles);

            return $this->json([
                'status' => 'success',
                'data' => $data,
            ]);
        }
        catch (Exception $e) {
            return $this->json([
                'status' => 'error',
                'code' => 500,
                'message' => 'error.fetch_roles_failed',
            ], 500);
        }
    }

    /**
     * Get full list of all roles with details (admin only)
     * Query: GetUserRolesListQuery.
     */
    #[Route('', name: 'list', methods: ['GET'])]
    #[OA\Get(
        path: '/api/roles',
        summary: 'Get all user roles',
        description: 'Returns complete list of all roles with user counts',
        tags: ['User Roles'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Roles list retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'id', type: 'integer', example: 1),
                                    new OA\Property(property: 'name', type: 'string', example: 'admin'),
                                    new OA\Property(property: 'usersCount', type: 'integer', example: 5),
                                ],
                            ),
                        ),
                    ],
                ),
            ),
            new OA\Response(response: 500, description: 'Server error'),
        ],
    )]
    public function list(): JsonResponse {
        try {
            $query = new GetUserRolesListQuery();

            $envelope = $this->queryBus->dispatch($query);
            $roles = $envelope->last(HandledStamp::class)->getResult();

            $data = array_map(function (UserRole $role) {
                return [
                    'id' => $role->getId(),
                    'name' => $role->getName(),
                    'usersCount' => $role->getUsers()->count(),
                ];
            }, $roles);

            return $this->json([
                'status' => 'success',
                'data' => $data,
            ]);
        }
        catch (Exception $e) {
            return $this->json([
                'status' => 'error',
                'code' => 500,
                'message' => 'error.fetch_roles_failed',
            ], 500);
        }
    }

    /**
     * Create new role
     * Command: CreateUserRoleCommand.
     */
    #[Route('', name: 'create', methods: ['POST'])]
    #[OA\Post(
        path: '/api/roles',
        summary: 'Create a new user role',
        description: 'Creates a new role in the system',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'supervisor', description: 'Unique role name'),
                ],
            ),
        ),
        tags: ['User Roles'],
        responses: [
            new OA\Response(
                response: 201,
                description: 'Role created successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(property: 'code', type: 'integer', example: 201),
                        new OA\Property(property: 'message', type: 'string', example: 'role.created'),
                        new OA\Property(
                            property: 'data',
                            properties: [
                                new OA\Property(property: 'id', type: 'integer', example: 6),
                                new OA\Property(property: 'name', type: 'string', example: 'supervisor'),
                            ],
                            type: 'object',
                        ),
                    ],
                ),
            ),
            new OA\Response(response: 400, description: 'Validation error'),
            new OA\Response(response: 500, description: 'Server error'),
        ],
    )]
    public function create(Request $request): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            if (empty($data['name'])) {
                return $this->json([
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'validation.role_name_required',
                ], 400);
            }

            $command = new CreateUserRoleCommand(
                name: $data['name'],
            );

            $envelope = $this->commandBus->dispatch($command);
            $role = $envelope->last(HandledStamp::class)->getResult();

            return $this->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'role.created',
                'data' => [
                    'id' => $role->getId(),
                    'name' => $role->getName(),
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
                'message' => 'error.create_role_failed',
            ], 500);
        }
    }

    /**
     * Get single role by ID
     * Query: GetUserRoleQuery.
     */
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    #[OA\Get(
        path: '/api/roles/{id}',
        summary: 'Get role by ID',
        description: 'Returns details of a specific role',
        tags: ['User Roles'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                description: 'Role ID',
                schema: new OA\Schema(type: 'integer'),
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Role retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(
                            property: 'data',
                            properties: [
                                new OA\Property(property: 'id', type: 'integer', example: 1),
                                new OA\Property(property: 'name', type: 'string', example: 'admin'),
                                new OA\Property(property: 'usersCount', type: 'integer', example: 5),
                            ],
                            type: 'object',
                        ),
                    ],
                ),
            ),
            new OA\Response(response: 404, description: 'Role not found'),
            new OA\Response(response: 500, description: 'Server error'),
        ],
    )]
    public function show(int $id): JsonResponse {
        try {
            $query = new GetUserRoleQuery(id: $id);

            $envelope = $this->queryBus->dispatch($query);
            $role = $envelope->last(HandledStamp::class)->getResult();

            if (!$role) {
                return $this->json([
                    'status' => 'error',
                    'code' => 404,
                    'message' => 'role.not_found',
                ], 404);
            }

            return $this->json([
                'status' => 'success',
                'data' => [
                    'id' => $role->getId(),
                    'name' => $role->getName(),
                    'usersCount' => $role->getUsers()->count(),
                ],
            ]);
        }
        catch (Exception $e) {
            return $this->json([
                'status' => 'error',
                'code' => 500,
                'message' => 'error.fetch_role_failed',
            ], 500);
        }
    }

    /**
     * Update role
     * Command: UpdateUserRoleCommand.
     */
    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    #[OA\Put(
        path: '/api/roles/{id}',
        summary: 'Update a role',
        description: 'Updates role name',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'senior_technician'),
                ],
            ),
        ),
        tags: ['User Roles'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                description: 'Role ID',
                schema: new OA\Schema(type: 'integer'),
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Role updated successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(property: 'code', type: 'integer', example: 200),
                        new OA\Property(property: 'message', type: 'string', example: 'role.updated'),
                        new OA\Property(
                            property: 'data',
                            properties: [
                                new OA\Property(property: 'id', type: 'integer', example: 3),
                                new OA\Property(property: 'name', type: 'string', example: 'senior_technician'),
                            ],
                            type: 'object',
                        ),
                    ],
                ),
            ),
            new OA\Response(response: 404, description: 'Role not found'),
            new OA\Response(response: 500, description: 'Server error'),
        ],
    )]
    public function update(int $id, Request $request): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            $command = new UpdateUserRoleCommand(
                id: $id,
                name: $data['name'] ?? null,
            );

            $envelope = $this->commandBus->dispatch($command);
            $role = $envelope->last(HandledStamp::class)->getResult();

            return $this->json([
                'status' => 'success',
                'code' => 200,
                'message' => 'role.updated',
                'data' => [
                    'id' => $role->getId(),
                    'name' => $role->getName(),
                ],
            ]);
        }
        catch (InvalidArgumentException $e) {
            return $this->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'role.not_found',
            ], 404);
        }
        catch (Exception $e) {
            return $this->json([
                'status' => 'error',
                'code' => 500,
                'message' => 'error.update_role_failed',
            ], 500);
        }
    }

    /**
     * Delete role
     * Command: DeleteUserRoleCommand.
     */
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[OA\Delete(
        path: '/api/roles/{id}',
        summary: 'Delete a role',
        description: 'Deletes a role from the system. Cannot delete if role has assigned users.',
        tags: ['User Roles'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                description: 'Role ID',
                schema: new OA\Schema(type: 'integer'),
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Role deleted successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(property: 'code', type: 'integer', example: 200),
                        new OA\Property(property: 'message', type: 'string', example: 'role.deleted'),
                    ],
                ),
            ),
            new OA\Response(response: 400, description: 'Cannot delete role with assigned users'),
            new OA\Response(response: 500, description: 'Server error'),
        ],
    )]
    public function delete(int $id): JsonResponse {
        try {
            $command = new DeleteUserRoleCommand(id: $id);

            $this->commandBus->dispatch($command);

            return $this->json([
                'status' => 'success',
                'code' => 200,
                'message' => 'role.deleted',
            ]);
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
                'message' => 'error.delete_role_failed',
            ], 500);
        }
    }
}
