<?php

namespace App\Application\Command\UserRole;

/**
 * Command to delete a user role.
 */
readonly class DeleteUserRoleCommand {
    public function __construct(
        public int $id,
    ) {}
}
