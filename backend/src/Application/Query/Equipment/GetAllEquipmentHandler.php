<?php

namespace App\Application\Query\Equipment;

use App\Repository\EquipmentRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class GetAllEquipmentHandler {
    public function __construct(
        private EquipmentRepository $equipmentRepository,
    ) {}

    /**
     * @return array<int, \App\Entity\Equipment>
     */
    public function __invoke(GetAllEquipmentQuery $query): array {
        if ($query->includeDeleted) {
            return $this->equipmentRepository->findAll();
        }

        return $this->equipmentRepository->findBy(['deletedAt' => null]);
    }
}
