<?php

namespace App\Application\Command\User;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Repository\UserRoleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Handler for UpdateUserCommand
 * Updates user data (email, password, name, role)
 */
#[AsMessageHandler(bus: 'command.bus')]
final readonly class UpdateUserHandler {
    
    public function __construct(
        private EntityManagerInterface $em,
        private UserRepository $userRepository,
        private UserRoleRepository $roleRepository,
        private UserPasswordHasherInterface $passwordHasher
    ) {}
    
    public function __invoke(UpdateUserCommand $command): User {
        $user = $this->userRepository->find($command->id);
        
        if (!$user) {
            throw new \InvalidArgumentException("User with ID {$command->id} not found");
        }
        
        // Update email if provided
        if ($command->email !== null) {
            $user->setEmail($command->email);
        }
        
        // Update password if provided
        if ($command->password !== null) {
            $hashedPassword = $this->passwordHasher->hashPassword($user, $command->password);
            $user->setPassword($hashedPassword);
        }
        
        // Update first name if provided
        if ($command->firstName !== null) {
            $user->setFirstName($command->firstName);
        }
        
        // Update last name if provided
        if ($command->lastName !== null) {
            $user->setLastName($command->lastName);
        }
        
        // Update role if provided
        if ($command->roleId !== null) {
            $role = $this->roleRepository->find($command->roleId);
            if (!$role) {
                throw new \InvalidArgumentException("Role with ID {$command->roleId} not found");
            }
            $user->setUserRole($role);
        }
        
        $this->em->flush();
        
        return $user;
    }
}
