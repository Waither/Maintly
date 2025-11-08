<?php

namespace App\Application\Command\Tag;

use App\Entity\EquipmentTag;
use App\Entity\User;
use App\Repository\EquipmentRepository;
use App\Repository\TagRepository;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class AssignTagToEquipmentHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
        private EquipmentRepository $equipmentRepository,
        private TagRepository $tagRepository,
    ) {}

    public function __invoke(AssignTagToEquipmentCommand $command): EquipmentTag {
        $equipment = $this->equipmentRepository->find($command->equipmentId);
        if (!$equipment) {
            throw new RuntimeException('Equipment not found');
        }

        $tag = $this->tagRepository->find($command->tagId);
        if (!$tag) {
            throw new RuntimeException('Tag not found');
        }

        $user = $this->entityManager->getReference(User::class, $command->assignedBy);

        $equipmentTag = new EquipmentTag();
        $equipmentTag->setEquipment($equipment);
        $equipmentTag->setTag($tag);
        $equipmentTag->setAssignedBy($user);

        $this->entityManager->persist($equipmentTag);
        $this->entityManager->flush();

        return $equipmentTag;
    }
}
