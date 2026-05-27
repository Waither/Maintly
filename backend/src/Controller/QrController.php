<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repository\EquipmentRepository;
use App\Repository\WorkOrderRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/qr', name: 'api_qr_')]
class QrController extends AbstractController
{
    public function __construct(
        private readonly EquipmentRepository $equipmentRepository,
        private readonly WorkOrderRepository $workOrderRepository,
    ) {}

    /**
     * Resolve a QR code (EQ-000001 or WO-000001) to an entity redirect URL.
     *
     * GET /api/qr/resolve?code=EQ-000001
     *
     * Returns: { type: "equipment"|"work_order", id: 5, url: "/equipment/5" }
     */
    #[Route('/resolve', name: 'resolve', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function resolve(Request $request): JsonResponse
    {
        $code = trim((string) $request->query->get('code', ''));

        if ($code === '') {
            return $this->json(['error' => 'Missing code parameter'], 400);
        }

        $code = strtoupper($code);

        if (str_starts_with($code, 'EQ-')) {
            $equipment = $this->equipmentRepository->findOneBy(['qrCodeData' => $code]);

            if ($equipment === null || $equipment->getDeletedAt() !== null) {
                return $this->json(['error' => 'Equipment not found'], 404);
            }

            return $this->json([
                'type' => 'equipment',
                'id'   => $equipment->getId(),
                'code' => $equipment->getQrCodeData(),
                'name' => $equipment->getName(),
                'url'  => '/equipment/' . $equipment->getId(),
            ]);
        }

        if (str_starts_with($code, 'WO-')) {
            $workOrder = $this->workOrderRepository->findOneBy(['uniqueCode' => $code]);

            if ($workOrder === null || $workOrder->getDeletedAt() !== null) {
                return $this->json(['error' => 'Work order not found'], 404);
            }

            return $this->json([
                'type'  => 'work_order',
                'id'    => $workOrder->getId(),
                'code'  => $workOrder->getUniqueCode(),
                'title' => $workOrder->getTitle(),
                'url'   => '/work-orders/' . $workOrder->getId(),
            ]);
        }

        return $this->json(['error' => 'Unknown code prefix. Expected EQ- or WO-'], 400);
    }
}
