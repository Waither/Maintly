<?php

namespace App\Application\Query\User;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handler for GetUserQuery
 * Returns single user with role data.
 */
#[AsMessageHandler(bus: 'query.bus')]
final readonly class GetUserHandler {
    public function __construct(
        private UserRepository $userRepository,
    ) {}

    public function __invoke(GetUserQuery $query): ?User {
        return $this->userRepository->createQueryBuilder('u')
            ->leftJoin('u.userRole', 'r')
            ->addSelect('r')
            ->where('u.id = :id')
            ->setParameter('id', $query->id)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
