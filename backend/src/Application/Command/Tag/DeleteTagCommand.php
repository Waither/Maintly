<?php

namespace App\Application\Command\Tag;

/**
 * Command to delete a tag.
 */
final readonly class DeleteTagCommand {
    public function __construct(
        public int $id,
    ) {}
}
