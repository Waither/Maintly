<?php

namespace App\Application\Command\User;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handler for DeleteUserCommand
 * Removes user from database
 */
#[AsMessageHandler(bus: 'command.bus')]
final readonly class DeleteUserHandler {
    
    public function __construct(
        private EntityManagerInterface $em,
        private UserRepository $userRepository
    ) {}
    
    public function __invoke(DeleteUserCommand $command): void {
        $user = $this->userRepository->find($command->id);
        
        if (!$user) {
            throw new \InvalidArgumentException("User with ID {$command->id} not found");
        }
        
        $this->em->remove($user);
        $this->em->flush();
    }
}
