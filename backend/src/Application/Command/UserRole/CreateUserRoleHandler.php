<?php

namespace App\Application\Command\UserRole;

use App\Entity\UserRole;
use App\Repository\UserRoleRepository;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handler for CreateUserRoleCommand
 * Creates a new user role with validation.
 */
#[AsMessageHandler(bus: 'command.bus')]
class CreateUserRoleHandler {
    public function __construct(
        private EntityManagerInterface $em,
        private UserRoleRepository $roleRepository,
    ) {}

    public function __invoke(CreateUserRoleCommand $command): UserRole {
        // Check if role name already exists
        $existing = $this->roleRepository->findOneBy(['name' => $command->name]);
        if ($existing) {
            throw new InvalidArgumentException("Role '{$command->name}' already exists");
        }

        // Validate name length
        if (strlen($command->name) > 50) {
            throw new InvalidArgumentException('Role name must not exceed 50 characters');
        }

        $role = new UserRole();
        $role->setName($command->name);

        $this->em->persist($role);
        $this->em->flush();

        return $role;
    }
}
