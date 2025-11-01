<?php

namespace App\Application\Command\UserRole;

use App\Repository\UserRoleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handler for DeleteUserRoleCommand
 * Removes user role from database
 */
#[AsMessageHandler(bus: 'command.bus')]
class DeleteUserRoleHandler {
    
    public function __construct(
        private UserRoleRepository $roleRepository,
        private EntityManagerInterface $em
    ) {}
    
    public function __invoke(DeleteUserRoleCommand $command): void {
        
        $role = $this->roleRepository->find($command->id);
        if (!$role) {
            throw new \InvalidArgumentException("Role with ID {$command->id} not found");
        }
        
        // Check if role is assigned to any users
        if ($role->getUsers()->count() > 0) {
            throw new \InvalidArgumentException(
                "Cannot delete role '{$role->getName()}' - it is assigned to {$role->getUsers()->count()} user(s)"
            );
        }
        
        $this->em->remove($role);
        $this->em->flush();
    }
}
