<?php

namespace App\Controller;

use App\Application\Command\Equipment\CreateEquipmentCommand;
use App\Application\Command\Equipment\DeleteEquipmentCommand;
use App\Application\Command\Equipment\UpdateEquipmentCommand;
use App\Application\Command\Tag\AssignTagToEquipmentCommand;
use App\Application\Command\Tag\RemoveTagFromEquipmentCommand;
use App\Application\Query\Equipment\GetAllEquipmentQuery;
use App\Application\Query\Equipment\GetEquipmentByIdQuery;
use App\Entity\User;
use OpenApi\Attributes as OA;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\HandledStamp;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/equipment', name: 'equipment_')]
class EquipmentController extends AbstractController {
    use ApiResponseTrait;

    public function __construct(
        private MessageBusInterface $commandBus,
        private MessageBusInterface $queryBus,
    ) {}

    /**
     * Get all equipment.
     */
    #[Route('', name: 'list', methods: ['GET'])]
    #[IsGranted('EQUIPMENT_VIEW')]
    #[OA\Get(
        path: '/api/equipment',
        summary: 'Get all equipment',
        tags: ['Equipment'],
        parameters: [
            new OA\Parameter(
                name: 'includeDeleted',
                in: 'query',
                description: 'Include soft-deleted equipment',
                required: false,
                schema: new OA\Schema(type: 'boolean', default: false),
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Equipment list retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'id', type: 'integer'),
                                    new OA\Property(property: 'name', type: 'string'),
                                    new OA\Property(property: 'costCenter', type: 'integer'),
                                    new OA\Property(property: 'qrCodeData', type: 'string', nullable: true),
                                    new OA\Property(property: 'parentEquipmentId', type: 'integer', nullable: true),
                                    new OA\Property(property: 'directWorkTime', type: 'integer'),
                                    new OA\Property(property: 'totalWorkTime', type: 'integer'),
                                ],
                            ),
                        ),
                    ],
                ),
            ),
        ],
    )]
    public function list(Request $request): JsonResponse {
        $includeDeleted = $request->query->getBoolean('includeDeleted', false);

        $query = new GetAllEquipmentQuery($includeDeleted);
        $envelope = $this->queryBus->dispatch($query);
        $equipment = $envelope->last(HandledStamp::class)->getResult();

        $data = array_map(fn ($eq) => [
            'id' => $eq->getId(),
            'name' => $eq->getName(),
            'costCenter' => $eq->getCostCenter(),
            'qrCodeData' => $eq->getQrCodeData(),
            'parentEquipmentId' => $eq->getParentEquipment()?->getId(),
            'directWorkTime' => $eq->getDirectWorkTime(),
            'totalWorkTime' => $eq->getTotalWorkTime(),
            'createdAt' => $eq->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updatedAt' => $eq->getUpdatedAt()?->format('Y-m-d H:i:s'),
        ], $equipment);

        return $this->successResponse($data);
    }

    /**
     * Get equipment by ID.
     */
    #[Route('/{id}', name: 'get', methods: ['GET'], requirements: ['id' => '\d+'])]
    #[IsGranted('EQUIPMENT_VIEW')]
    #[OA\Get(
        path: '/api/equipment/{id}',
        summary: 'Get equipment by ID',
        tags: ['Equipment'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                description: 'Equipment ID',
                required: true,
                schema: new OA\Schema(type: 'integer'),
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Equipment retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(
                            property: 'data',
                            properties: [
                                new OA\Property(property: 'id', type: 'integer'),
                                new OA\Property(property: 'name', type: 'string'),
                                new OA\Property(property: 'costCenter', type: 'integer'),
                                new OA\Property(property: 'qrCodeData', type: 'string'),
                                new OA\Property(property: 'parentEquipmentId', type: 'integer', nullable: true),
                                new OA\Property(property: 'directWorkTime', type: 'integer'),
                                new OA\Property(property: 'totalWorkTime', type: 'integer'),
                                new OA\Property(property: 'tags', type: 'array', items: new OA\Items(type: 'object')),
                                new OA\Property(property: 'files', type: 'array', items: new OA\Items(type: 'object')),
                            ],
                        ),
                    ],
                ),
            ),
            new OA\Response(response: 404, description: 'Equipment not found'),
        ],
    )]
    public function get(int $id): JsonResponse {
        $query = new GetEquipmentByIdQuery($id);
        $envelope = $this->queryBus->dispatch($query);
        $equipment = $envelope->last(HandledStamp::class)->getResult();

        if (!$equipment) {
            return $this->errorResponse('Equipment not found', 404);
        }

        $data = [
            'id' => $equipment->getId(),
            'name' => $equipment->getName(),
            'costCenter' => $equipment->getCostCenter(),
            'qrCodeData' => $equipment->getQrCodeData(),
            'parentEquipmentId' => $equipment->getParentEquipment()?->getId(),
            'directWorkTime' => $equipment->getDirectWorkTime(),
            'totalWorkTime' => $equipment->getTotalWorkTime(),
            'createdAt' => $equipment->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updatedAt' => $equipment->getUpdatedAt()?->format('Y-m-d H:i:s'),
            'tags' => array_map(fn ($et) => [
                'id' => $et->getTag()->getId(),
                'name' => $et->getTag()->getName(),
                'color' => $et->getTag()->getColor(),
            ], $equipment->getEquipmentTags()->toArray()),
            'files' => array_map(fn ($file) => [
                'id' => $file->getId(),
                'fileName' => $file->getFileName(),
                'fileType' => $file->getFileType(),
                'fileSize' => $file->getFileSize(),
                'uploadedAt' => $file->getUploadedAt()?->format('Y-m-d H:i:s'),
            ], $equipment->getFiles()->toArray()),
        ];

        return $this->successResponse($data);
    }

    /**
     * Create new equipment.
     */
    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('EQUIPMENT_CREATE')]
    #[OA\Post(
        path: '/api/equipment',
        summary: 'Create new equipment',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Prasa hydrauliczna'),
                    new OA\Property(property: 'costCenter', type: 'integer', example: 489330),
                    new OA\Property(property: 'parentEquipmentId', type: 'integer', nullable: true),
                ],
                required: ['name', 'costCenter'],
            ),
        ),
        tags: ['Equipment'],
        responses: [
            new OA\Response(
                response: 201,
                description: 'Equipment created successfully',
            ),
            new OA\Response(response: 400, description: 'Invalid input'),
        ],
    )]
    public function create(Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name']) || !isset($data['costCenter'])) {
            return $this->errorResponse('Missing required fields: name, costCenter', 400);
        }

        /** @var User|null $user */
        $user = $this->getUser();

        $command = new CreateEquipmentCommand(
            name: $data['name'],
            costCenter: (int) $data['costCenter'],
            parentEquipmentId: $data['parentEquipmentId'] ?? null,
            createdBy: $user?->getId(),
        );

        $envelope = $this->commandBus->dispatch($command);
        $equipment = $envelope->last(HandledStamp::class)->getResult();

        return $this->successResponse([
            'id' => $equipment->getId(),
            'qrCodeData' => $equipment->getQrCodeData(),
        ], 201);
    }

    /**
     * Update equipment.
     */
    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'], requirements: ['id' => '\d+'])]
    #[IsGranted('EQUIPMENT_EDIT')]
    #[OA\Put(
        path: '/api/equipment/{id}',
        summary: 'Update equipment (full update)',
        description: 'Updates equipment data. Use PUT for full update or PATCH for partial update.',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Prasa hydrauliczna H-500'),
                    new OA\Property(property: 'costCenter', type: 'integer', example: 489330),
                    new OA\Property(property: 'parentEquipmentId', type: 'integer', nullable: true, example: 12),
                ],
            ),
        ),
        tags: ['Equipment'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                description: 'Equipment ID',
                schema: new OA\Schema(type: 'integer'),
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Equipment updated successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(
                            property: 'data',
                            properties: [
                                new OA\Property(property: 'id', type: 'integer', example: 1),
                            ],
                            type: 'object',
                        ),
                    ],
                ),
            ),
            new OA\Response(response: 404, description: 'Equipment not found'),
            new OA\Response(response: 401, description: 'Unauthorized'),
            new OA\Response(response: 403, description: 'Forbidden - insufficient permissions'),
        ],
    )]
    #[OA\Patch(
        path: '/api/equipment/{id}',
        summary: 'Update equipment (partial update)',
        description: 'Partially updates equipment data. Only provided fields will be updated.',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Prasa hydrauliczna H-500'),
                    new OA\Property(property: 'costCenter', type: 'integer', example: 489330),
                    new OA\Property(property: 'parentEquipmentId', type: 'integer', nullable: true, example: 12),
                ],
            ),
        ),
        tags: ['Equipment'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                description: 'Equipment ID',
                schema: new OA\Schema(type: 'integer'),
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Equipment updated successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(
                            property: 'data',
                            properties: [
                                new OA\Property(property: 'id', type: 'integer', example: 1),
                            ],
                            type: 'object',
                        ),
                    ],
                ),
            ),
            new OA\Response(response: 404, description: 'Equipment not found'),
            new OA\Response(response: 401, description: 'Unauthorized'),
            new OA\Response(response: 403, description: 'Forbidden - insufficient permissions'),
        ],
    )]
    public function update(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        /** @var User|null $user */
        $user = $this->getUser();

        $command = new UpdateEquipmentCommand(
            id: $id,
            name: $data['name'] ?? null,
            costCenter: isset($data['costCenter']) ? (int) $data['costCenter'] : null,
            parentEquipmentId: $data['parentEquipmentId'] ?? null,
            updatedBy: $user?->getId(),
        );

        try {
            $envelope = $this->commandBus->dispatch($command);
            $equipment = $envelope->last(HandledStamp::class)->getResult();

            return $this->successResponse(['id' => $equipment->getId()]);
        }
        catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    /**
     * Delete equipment (soft delete).
     */
    #[Route('/{id}', name: 'delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    #[IsGranted('EQUIPMENT_DELETE')]
    #[OA\Delete(
        path: '/api/equipment/{id}',
        summary: 'Delete equipment (soft delete)',
        tags: ['Equipment'],
        responses: [
            new OA\Response(response: 204, description: 'Equipment deleted'),
            new OA\Response(response: 404, description: 'Equipment not found'),
        ],
    )]
    public function delete(int $id): JsonResponse {
        $command = new DeleteEquipmentCommand($id);

        try {
            $this->commandBus->dispatch($command);

            return $this->successResponse(null, 204);
        }
        catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    /**
     * Assign tag to equipment.
     */
    #[Route('/{id}/tags', name: 'assign_tag', methods: ['POST'], requirements: ['id' => '\d+'])]
    #[IsGranted('EQUIPMENT_EDIT')]
    #[OA\Post(
        path: '/api/equipment/{id}/tags',
        summary: 'Assign tag to equipment',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'tagId', type: 'integer', example: 1),
                ],
                required: ['tagId'],
            ),
        ),
        tags: ['Equipment'],
        responses: [
            new OA\Response(response: 201, description: 'Tag assigned'),
            new OA\Response(response: 400, description: 'Invalid input'),
        ],
    )]
    public function assignTag(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['tagId'])) {
            return $this->errorResponse('Missing required field: tagId', 400);
        }

        /** @var User|null $user */
        $user = $this->getUser();

        $command = new AssignTagToEquipmentCommand(
            equipmentId: $id,
            tagId: (int) $data['tagId'],
            assignedBy: $user?->getId(),
        );

        try {
            $this->commandBus->dispatch($command);

            return $this->successResponse(null, 201);
        }
        catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Remove tag from equipment.
     */
    #[Route('/{equipmentId}/tags/{tagId}', name: 'remove_tag', methods: ['DELETE'], requirements: ['equipmentId' => '\d+', 'tagId' => '\d+'])]
    #[IsGranted('EQUIPMENT_EDIT')]
    #[OA\Delete(
        path: '/api/equipment/{equipmentId}/tags/{tagId}',
        summary: 'Remove tag from equipment',
        tags: ['Equipment'],
        responses: [
            new OA\Response(response: 204, description: 'Tag removed'),
        ],
    )]
    public function removeTag(int $equipmentId, int $tagId): JsonResponse {
        $command = new RemoveTagFromEquipmentCommand(
            equipmentId: $equipmentId,
            tagId: $tagId,
        );

        $this->commandBus->dispatch($command);

        return $this->successResponse(null, 204);
    }
}
