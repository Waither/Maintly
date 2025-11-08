<?php

namespace App\Application\Query\Equipment;

use App\Entity\Equipment;
use App\Repository\EquipmentRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class GetEquipmentByIdHandler {
    public function __construct(
        private EquipmentRepository $equipmentRepository,
    ) {}

    public function __invoke(GetEquipmentByIdQuery $query): ?Equipment {
        return $this->equipmentRepository->find($query->id);
    }
}
