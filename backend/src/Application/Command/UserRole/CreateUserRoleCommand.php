<?php

namespace App\Application\Command\UserRole;

/**
 * Command to create a new user role.
 */
readonly class CreateUserRoleCommand {
    public function __construct(
        public string $name,
        public ?string $description = null,
    ) {}
}
