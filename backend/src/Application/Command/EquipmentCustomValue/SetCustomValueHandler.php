<?php

namespace App\Application\Command\EquipmentCustomValue;

use App\Entity\EquipmentCustomValue;
use App\Repository\EquipmentCustomFieldRepository;
use App\Repository\EquipmentRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class SetCustomValueHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
        private EquipmentRepository $equipmentRepository,
        private EquipmentCustomFieldRepository $customFieldRepository,
    ) {}

    public function __invoke(SetCustomValueCommand $command): EquipmentCustomValue {
        $equipment = $this->equipmentRepository->find($command->equipmentId);
        if (!$equipment) {
            throw new RuntimeException('Equipment not found');
        }

        $customField = $this->customFieldRepository->find($command->customFieldId);
        if (!$customField) {
            throw new RuntimeException('Custom field not found');
        }

        // Check if value already exists
        $existingValue = null;
        foreach ($equipment->getCustomValues() as $cv) {
            if ($cv->getCustomField()?->getId() === $command->customFieldId) {
                $existingValue = $cv;
                break;
            }
        }

        if ($existingValue) {
            // Update existing value
            $existingValue->setValue($command->value);
            $existingValue->setUpdatedAt(new DateTimeImmutable());
        }
        else {
            // Create new value
            $customValue = new EquipmentCustomValue();
            $customValue->setEquipment($equipment);
            $customValue->setCustomField($customField);
            $customValue->setValue($command->value);

            $this->entityManager->persist($customValue);
            $existingValue = $customValue;
        }

        $this->entityManager->flush();

        return $existingValue;
    }
}
