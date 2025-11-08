<?php

namespace App\Application\Command\Tag;

use App\Repository\TagRepository;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class DeleteTagHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TagRepository $tagRepository,
    ) {}

    public function __invoke(DeleteTagCommand $command): void {
        $tag = $this->tagRepository->find($command->id);

        if (!$tag) {
            throw new RuntimeException('Tag not found');
        }

        $this->entityManager->remove($tag);
        $this->entityManager->flush();
    }
}
