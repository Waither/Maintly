<?php

namespace App\Application\Command\User;

/**
 * Command to update an existing user.
 */
final readonly class UpdateUserCommand {
    public function __construct(
        public int $id,
        public ?string $email = null,
        public ?string $password = null,
        public ?string $firstName = null,
        public ?string $lastName = null,
        public ?string $phone = null,
        public ?bool $isActive = null,
        public ?int $roleId = null,
    ) {}
}
