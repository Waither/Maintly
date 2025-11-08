<?php

namespace App\Application\Command\Tag;

use App\Entity\Tag;
use App\Repository\TagGroupRepository;
use App\Repository\TagRepository;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class UpdateTagHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TagRepository $tagRepository,
        private TagGroupRepository $tagGroupRepository,
    ) {}

    public function __invoke(UpdateTagCommand $command): Tag {
        $tag = $this->tagRepository->find($command->id);

        if (!$tag) {
            throw new RuntimeException('Tag not found');
        }

        if ($command->name !== null) {
            $tag->setName($command->name);
        }

        if ($command->color !== null) {
            $tag->setColor($command->color);
        }

        if ($command->tagGroupId !== null) {
            $tagGroup = $this->tagGroupRepository->find($command->tagGroupId);
            $tag->setTagGroup($tagGroup);
        }

        $this->entityManager->flush();

        return $tag;
    }
}
