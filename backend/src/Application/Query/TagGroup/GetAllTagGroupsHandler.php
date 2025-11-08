<?php

namespace App\Application\Query\TagGroup;

use App\Repository\TagGroupRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class GetAllTagGroupsHandler {
    public function __construct(
        private TagGroupRepository $tagGroupRepository,
    ) {}

    /**
     * @return array<int, \App\Entity\TagGroup>
     */
    public function __invoke(GetAllTagGroupsQuery $query): array {
        return $this->tagGroupRepository->findBy([], ['displayOrder' => 'ASC']);
    }
}
