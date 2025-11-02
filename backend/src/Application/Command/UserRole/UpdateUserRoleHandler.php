<?php

namespace App\Application\Command\UserRole;

use App\Entity\UserRole;
use App\Repository\UserRoleRepository;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handler for UpdateUserRoleCommand.
 * Updates user role data (name).
 */
#[AsMessageHandler(bus: 'command.bus')]
class UpdateUserRoleHandler {
    public function __construct(
        private UserRoleRepository $roleRepository,
        private EntityManagerInterface $em,
    ) {}

    public function __invoke(UpdateUserRoleCommand $command): UserRole {
        $role = $this->roleRepository->find($command->id);
        if (!$role) {
            throw new InvalidArgumentException("Role with ID {$command->id} not found");
        }

        // Update name if provided
        if ($command->name !== null) {
            // Check if new name is unique
            $existing = $this->roleRepository->findOneBy(['name' => $command->name]);
            if ($existing && $existing->getId() !== $role->getId()) {
                throw new InvalidArgumentException("Role name '{$command->name}' already exists");
            }

            if (strlen($command->name) > 50) {
                throw new InvalidArgumentException('Role name must not exceed 50 characters');
            }

            $role->setName($command->name);
        }

        $this->em->flush();

        return $role;
    }
}
