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
