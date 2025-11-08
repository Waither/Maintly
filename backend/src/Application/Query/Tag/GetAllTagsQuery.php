<?php

namespace App\Application\Query\Tag;

/**
 * Query to get all tags.
 */
final readonly class GetAllTagsQuery {
    public function __construct(
        public ?int $tagGroupId = null,
    ) {}
}
