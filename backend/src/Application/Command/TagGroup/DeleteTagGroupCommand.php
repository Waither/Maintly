<?php

namespace App\Application\Command\TagGroup;

/**
 * Command to delete a tag group.
 */
final readonly class DeleteTagGroupCommand {
    public function __construct(
        public int $id,
    ) {}
}
