<?php

namespace App\Application\Command\EquipmentCustomField;

use App\Repository\EquipmentCustomFieldRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class DeleteCustomFieldHandler {
    public function __construct(
        private EntityManagerInterface $entityManager,
        private EquipmentCustomFieldRepository $customFieldRepository,
    ) {}

    public function __invoke(DeleteCustomFieldCommand $command): void {
        $customField = $this->customFieldRepository->find($command->id);

        if (!$customField) {
            throw new RuntimeException('Custom field not found');
        }

        // Soft delete
        $customField->setDeletedAt(new DateTimeImmutable());

        $this->entityManager->flush();
    }
}
