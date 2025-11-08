<?php

namespace App\Application\Command\Tag;

use App\Entity\Tag;
use App\Repository\TagGroupRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class CreateTagHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TagGroupRepository $tagGroupRepository,
    ) {}

    public function __invoke(CreateTagCommand $command): Tag {
        $tag = new Tag();
        $tag->setName($command->name);
        $tag->setColor($command->color);

        if ($command->tagGroupId !== null) {
            $tagGroup = $this->tagGroupRepository->find($command->tagGroupId);
            if ($tagGroup) {
                $tag->setTagGroup($tagGroup);
            }
        }

        $this->entityManager->persist($tag);
        $this->entityManager->flush();

        return $tag;
    }
}
