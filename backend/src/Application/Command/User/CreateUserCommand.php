<?php

namespace App\Application\Command\User;

/**
 * Command to create a new user
 */
final readonly class CreateUserCommand {
    public function __construct(
        public string $email,
        public string $password,
        public string $firstName,
        public string $lastName,
        public ?int $roleId = null
    ) {}
}
