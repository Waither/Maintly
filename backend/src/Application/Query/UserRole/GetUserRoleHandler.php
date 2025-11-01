<?php

namespace App\Application\Query\UserRole;

use App\Entity\UserRole;
use App\Repository\UserRoleRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handler for GetUserRoleQuery
 * Returns single user role with users count
 */
#[AsMessageHandler(bus: 'query.bus')]
class GetUserRoleHandler {
    
    public function __construct(
        private UserRoleRepository $roleRepository
    ) {}
    
    public function __invoke(GetUserRoleQuery $query): ?UserRole {
        
        return $this->roleRepository->createQueryBuilder('r')
            ->leftJoin('r.users', 'u')
            ->addSelect('u')
            ->where('r.id = :id')
            ->setParameter('id', $query->id)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
