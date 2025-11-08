<?php

declare(strict_types=1);

namespace App\Application\Query\Dashboard;

/**
 * Query to get dashboard statistics
 * Returns counts, metrics, and recent activities for dashboard view.
 */
final readonly class GetDashboardStatsQuery {
    public function __construct(
        public ?int $userId = null, // For provider role - filter by user
    ) {}
}
