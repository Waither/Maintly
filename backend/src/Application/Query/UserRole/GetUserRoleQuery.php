<?php

namespace App\Application\Query\UserRole;

/**
 * Query to get a single user role by ID
 */
readonly class GetUserRoleQuery {
    
    public function __construct(
        public int $id
    ) {}
}
