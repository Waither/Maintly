<?php

namespace App\Application\Command\Equipment;

use App\Entity\Equipment;
use App\Entity\User;
use App\Repository\EquipmentRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class UpdateEquipmentHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
        private EquipmentRepository $equipmentRepository,
    ) {}

    public function __invoke(UpdateEquipmentCommand $command): Equipment {
        $equipment = $this->equipmentRepository->find($command->id);

        if (!$equipment) {
            throw new RuntimeException('Equipment not found');
        }

        if ($command->name !== null) {
            $equipment->setName($command->name);
        }

        if ($command->costCenter !== null) {
            $equipment->setCostCenter($command->costCenter);
        }

        if ($command->parentEquipmentId !== null) {
            $parent = $this->equipmentRepository->find($command->parentEquipmentId);
            $equipment->setParentEquipment($parent);
        }

        if ($command->updatedBy !== null) {
            $user = $this->entityManager->getReference(User::class, $command->updatedBy);
            $equipment->setUpdatedBy($user);
        }

        $equipment->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->flush();

        return $equipment;
    }
}
