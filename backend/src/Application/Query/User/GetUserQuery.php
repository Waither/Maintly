<?php

namespace App\Application\Query\User;

/**
 * Query to get a single user by ID.
 */
final readonly class GetUserQuery {
    public function __construct(
        public int $id,
    ) {}
}
