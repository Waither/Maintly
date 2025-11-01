<?php

namespace App\Application\Command\UserRole;

/**
 * Command to update an existing user role
 */
readonly class UpdateUserRoleCommand {
    
    public function __construct(
        public int $id,
        public ?string $name = null,
        public ?string $description = null
    ) {}
}
