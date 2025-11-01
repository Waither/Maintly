<?php

namespace App\Application\Command\User;

/**
 * Command to delete a user
 */
final readonly class DeleteUserCommand {
    public function __construct(
        public int $id
    ) {}
}
