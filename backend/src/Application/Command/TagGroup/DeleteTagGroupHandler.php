<?php

namespace App\Application\Command\TagGroup;

use App\Repository\TagGroupRepository;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class DeleteTagGroupHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TagGroupRepository $tagGroupRepository,
    ) {}

    public function __invoke(DeleteTagGroupCommand $command): void {
        $tagGroup = $this->tagGroupRepository->find($command->id);

        if (!$tagGroup) {
            throw new RuntimeException('Tag group not found');
        }

        $this->entityManager->remove($tagGroup);
        $this->entityManager->flush();
    }
}
