<?php

namespace App\Application\Command\TagGroup;

use App\Entity\TagGroup;
use App\Repository\TagGroupRepository;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class UpdateTagGroupHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TagGroupRepository $tagGroupRepository,
    ) {}

    public function __invoke(UpdateTagGroupCommand $command): TagGroup {
        $tagGroup = $this->tagGroupRepository->find($command->id);

        if (!$tagGroup) {
            throw new RuntimeException('Tag group not found');
        }

        if ($command->name !== null) {
            $tagGroup->setName($command->name);
        }

        if ($command->isRequired !== null) {
            $tagGroup->setIsRequired($command->isRequired);
        }

        if ($command->isSingleChoice !== null) {
            $tagGroup->setIsSingleChoice($command->isSingleChoice);
        }

        if ($command->displayOrder !== null) {
            $tagGroup->setDisplayOrder($command->displayOrder);
        }

        $this->entityManager->flush();

        return $tagGroup;
    }
}
