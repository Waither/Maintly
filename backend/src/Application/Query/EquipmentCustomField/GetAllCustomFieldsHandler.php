<?php

namespace App\Application\Query\EquipmentCustomField;

use App\Repository\EquipmentCustomFieldRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class GetAllCustomFieldsHandler {
    public function __construct(
        private EquipmentCustomFieldRepository $customFieldRepository,
    ) {}

    /**
     * @return array<int, \App\Entity\EquipmentCustomField>
     */
    public function __invoke(GetAllCustomFieldsQuery $query): array {
        $criteria = ['deletedAt' => null];

        if ($query->onlyActive) {
            $criteria['isActive'] = true;
        }

        return $this->customFieldRepository->findBy($criteria, ['displayOrder' => 'ASC']);
    }
}
