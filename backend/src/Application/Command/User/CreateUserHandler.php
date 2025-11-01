<?php

namespace App\Application\Command\User;

use App\Entity\User;
use App\Repository\UserRoleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Handler for CreateUserCommand
 * Creates a new user with hashed password and assigns role
 */
#[AsMessageHandler(bus: 'command.bus')]
final readonly class CreateUserHandler {
    
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher,
        private UserRoleRepository $roleRepository
    ) {}
    
    public function __invoke(CreateUserCommand $command): User {
        $user = new User();
        $user->setEmail($command->email);
        $user->setFirstName($command->firstName);
        $user->setLastName($command->lastName);
        
        // Hash password
        $hashedPassword = $this->passwordHasher->hashPassword($user, $command->password);
        $user->setPassword($hashedPassword);
        
        // Assign role
        if ($command->roleId) {
            $role = $this->roleRepository->find($command->roleId);
            if (!$role) {
                throw new \InvalidArgumentException("Role with ID {$command->roleId} not found");
            }
            $user->setUserRole($role);
        }
        else {
            // Default role: reporter (production worker)
            $defaultRole = $this->roleRepository->findOneBy(['name' => 'reporter']);
            if (!$defaultRole) {
                throw new \RuntimeException('Default role "reporter" not found in database');
            }
            $user->setUserRole($defaultRole);
        }
        
        $this->em->persist($user);
        $this->em->flush();
        
        return $user;
    }
}
