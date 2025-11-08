<?php

namespace App\Application\Command\Equipment;

use App\Repository\EquipmentRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class DeleteEquipmentHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
        private EquipmentRepository $equipmentRepository,
    ) {}

    public function __invoke(DeleteEquipmentCommand $command): void {
        $equipment = $this->equipmentRepository->find($command->id);

        if (!$equipment) {
            throw new RuntimeException('Equipment not found');
        }

        // Soft delete
        $equipment->setDeletedAt(new DateTimeImmutable());

        $this->entityManager->flush();
    }
}
