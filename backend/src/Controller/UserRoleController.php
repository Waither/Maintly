<?php

namespace App\Controller;

use App\Application\Command\UserRole\CreateUserRoleCommand;
use App\Application\Command\UserRole\UpdateUserRoleCommand;
use App\Application\Command\UserRole\DeleteUserRoleCommand;
use App\Application\Query\UserRole\GetUserRoleQuery;
use App\Application\Query\UserRole\GetUserRolesListQuery;
use App\Entity\UserRole;
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
        private MessageBusInterface $queryBus
    ) {}

    /**
     * Get simple roles list for select/dropdown (manager+)
     * Used in frontend forms when creating/editing users
     * Query: GetUserRolesListQuery
     */
    #[Route('/select', name: 'select', methods: ['GET'])]
    public function select(): JsonResponse {
        try {
            $query = new GetUserRolesListQuery();
            
            $envelope = $this->queryBus->dispatch($query);
            $roles = $envelope->last(HandledStamp::class)->getResult();
            
            // Simple format for <select> or dropdown
            $data = array_map(function(UserRole $role) {
                return [
                    'value' => $role->getId(),
                    'label' => $role->getName(),
                    'description' => $role->getDescription()
                ];
            }, $roles);

            return $this->json([
                'status' => 'success',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'status' => 'error',
                'message' => 'Failed to fetch roles: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get full list of all roles with details (admin only)
     * Query: GetUserRolesListQuery
     */
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(): JsonResponse {
        try {
            $query = new GetUserRolesListQuery();
            
            $envelope = $this->queryBus->dispatch($query);
            $roles = $envelope->last(HandledStamp::class)->getResult();
            
            $data = array_map(function(UserRole $role) {
                return [
                    'id' => $role->getId(),
                    'name' => $role->getName(),
                    'description' => $role->getDescription(),
                    'usersCount' => $role->getUsers()->count()
                ];
            }, $roles);

            return $this->json([
                'status' => 'success',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'status' => 'error',
                'message' => 'Failed to fetch roles: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new role
     * Command: CreateUserRoleCommand
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            if (empty($data['name'])) {
                return $this->json([
                    'status' => 'error',
                    'message' => 'Role name is required'
                ], 400);
            }

            $command = new CreateUserRoleCommand(
                name: $data['name'],
                description: $data['description'] ?? null
            );
            
            $envelope = $this->commandBus->dispatch($command);
            $role = $envelope->last(HandledStamp::class)->getResult();

            return $this->json([
                'status' => 'success',
                'message' => 'Role created successfully',
                'data' => [
                    'id' => $role->getId(),
                    'name' => $role->getName(),
                    'description' => $role->getDescription()
                ]
            ], 201);

        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        } catch (\Exception $e) {
            return $this->json([
                'status' => 'error',
                'message' => 'Failed to create role: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single role by ID
     * Query: GetUserRoleQuery
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
                    'message' => 'Role not found'
                ], 404);
            }

            return $this->json([
                'status' => 'success',
                'data' => [
                    'id' => $role->getId(),
                    'name' => $role->getName(),
                    'description' => $role->getDescription(),
                    'usersCount' => $role->getUsers()->count()
                ]
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'status' => 'error',
                'message' => 'Failed to fetch role: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update role
     * Command: UpdateUserRoleCommand
     */
    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            $command = new UpdateUserRoleCommand(
                id: $id,
                name: $data['name'] ?? null,
                description: $data['description'] ?? null
            );
            
            $envelope = $this->commandBus->dispatch($command);
            $role = $envelope->last(HandledStamp::class)->getResult();

            return $this->json([
                'status' => 'success',
                'message' => 'Role updated successfully',
                'data' => [
                    'id' => $role->getId(),
                    'name' => $role->getName(),
                    'description' => $role->getDescription()
                ]
            ]);

        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            return $this->json([
                'status' => 'error',
                'message' => 'Failed to update role: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete role
     * Command: DeleteUserRoleCommand
     */
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse {
        try {
            $command = new DeleteUserRoleCommand(id: $id);
            
            $this->commandBus->dispatch($command);

            return $this->json([
                'status' => 'success',
                'message' => 'Role deleted successfully'
            ]);

        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        } catch (\Exception $e) {
            return $this->json([
                'status' => 'error',
                'message' => 'Failed to delete role: ' . $e->getMessage()
            ], 500);
        }
    }
}
