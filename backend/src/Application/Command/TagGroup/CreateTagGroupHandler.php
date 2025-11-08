<?php

namespace App\Application\Command\TagGroup;

use App\Entity\TagGroup;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class CreateTagGroupHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(CreateTagGroupCommand $command): TagGroup {
        $tagGroup = new TagGroup();
        $tagGroup->setName($command->name);
        $tagGroup->setIsRequired($command->isRequired);
        $tagGroup->setIsSingleChoice($command->isSingleChoice);
        $tagGroup->setDisplayOrder($command->displayOrder);

        $this->entityManager->persist($tagGroup);
        $this->entityManager->flush();

        return $tagGroup;
    }
}
