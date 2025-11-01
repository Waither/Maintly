<?php

namespace App\Application\Query\UserRole;

use App\Entity\UserRole;
use App\Repository\UserRoleRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handler for GetUserRolesListQuery
 * Returns all user roles with users count
 */
#[AsMessageHandler(bus: 'query.bus')]
class GetUserRolesListHandler {
    
    public function __construct(
        private UserRoleRepository $roleRepository
    ) {}
    
    public function __invoke(GetUserRolesListQuery $query): array {
        
        return $this->roleRepository->createQueryBuilder('r')
            ->leftJoin('r.users', 'u')
            ->addSelect('u')
            ->getQuery()
            ->getResult();
    }
}
