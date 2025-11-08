<?php

namespace App\Application\Query\Tag;

use App\Repository\TagRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class GetAllTagsHandler {
    public function __construct(
        private TagRepository $tagRepository,
    ) {}

    /**
     * @return array<int, \App\Entity\Tag>
     */
    public function __invoke(GetAllTagsQuery $query): array {
        if ($query->tagGroupId !== null) {
            return $this->tagRepository->findBy(['tagGroup' => $query->tagGroupId]);
        }

        return $this->tagRepository->findAll();
    }
}
