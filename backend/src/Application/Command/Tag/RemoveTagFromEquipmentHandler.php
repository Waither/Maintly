<?php

namespace App\Application\Command\Tag;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class RemoveTagFromEquipmentHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(RemoveTagFromEquipmentCommand $command): void {
        $dql = 'DELETE FROM App\Entity\EquipmentTag et 
				WHERE et.equipment = :equipmentId AND et.tag = :tagId';

        $query = $this->entityManager->createQuery($dql);
        $query->setParameter('equipmentId', $command->equipmentId);
        $query->setParameter('tagId', $command->tagId);
        $query->execute();
    }
}
