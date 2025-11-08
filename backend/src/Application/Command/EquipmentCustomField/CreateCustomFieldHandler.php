<?php

namespace App\Application\Command\EquipmentCustomField;

use App\Entity\EquipmentCustomField;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class CreateCustomFieldHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function __invoke(CreateCustomFieldCommand $command): EquipmentCustomField {
        $customField = new EquipmentCustomField();
        $customField->setFieldName($command->fieldName);
        $customField->setFieldType($command->fieldType);
        $customField->setFieldOptions($command->fieldOptions);
        $customField->setIsRequired($command->isRequired);
        $customField->setDefaultValue($command->defaultValue);
        $customField->setDisplayOrder($command->displayOrder);

        if ($command->createdBy !== null) {
            $user = $this->entityManager->getReference(User::class, $command->createdBy);
            $customField->setCreatedBy($user);
        }

        $this->entityManager->persist($customField);
        $this->entityManager->flush();

        return $customField;
    }
}
