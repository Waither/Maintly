<?php

namespace App\Application\Query\User;

/**
 * Query to get paginated list of users.
 */
final readonly class GetUsersListQuery {
    public function __construct(
        public int $page = 1,
        public int $limit = 20,
    ) {}
}
