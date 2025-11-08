<?php

namespace App\Application\Command\Equipment;

use App\Entity\Equipment;
use App\Entity\User;
use App\Repository\EquipmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class CreateEquipmentHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
        private EquipmentRepository $equipmentRepository,
    ) {}

    public function __invoke(CreateEquipmentCommand $command): Equipment {
        $equipment = new Equipment();
        $equipment->setName($command->name);
        $equipment->setCostCenter($command->costCenter);

        // Set parent equipment if provided
        if ($command->parentEquipmentId !== null) {
            $parent = $this->equipmentRepository->find($command->parentEquipmentId);
            if ($parent) {
                $equipment->setParentEquipment($parent);
            }
        }

        // Set created by user
        if ($command->createdBy !== null) {
            $user = $this->entityManager->getReference(User::class, $command->createdBy);
            $equipment->setCreatedBy($user);
        }

        $this->entityManager->persist($equipment);
        $this->entityManager->flush();

        return $equipment;
    }
}
