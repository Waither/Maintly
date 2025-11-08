<?php

namespace App\Controller;

use App\Application\Command\EquipmentCustomField\CreateCustomFieldCommand;
use App\Application\Command\EquipmentCustomField\DeleteCustomFieldCommand;
use App\Application\Command\EquipmentCustomValue\SetCustomValueCommand;
use App\Application\Query\EquipmentCustomField\GetAllCustomFieldsQuery;
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

#[Route('/api/equipment-custom-fields', name: 'equipment_custom_fields_')]
class EquipmentCustomFieldController extends AbstractController {
    use ApiResponseTrait;

    public function __construct(
        private MessageBusInterface $commandBus,
        private MessageBusInterface $queryBus,
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
    #[IsGranted('EQUIPMENT_VIEW')]
    #[OA\Get(
        path: '/api/equipment-custom-fields',
        summary: 'Get all custom fields',
        tags: ['Equipment Custom Fields'],
        parameters: [
            new OA\Parameter(
                name: 'onlyActive',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'boolean', default: true),
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Custom fields list retrieved successfully'),
        ],
    )]
    public function index(Request $request): JsonResponse {
        $onlyActive = $request->query->get('onlyActive', 'true') === 'true';

        $query = new GetAllCustomFieldsQuery(onlyActive: $onlyActive);

        $envelope = $this->queryBus->dispatch($query);
        $fields = $envelope->last(HandledStamp::class)?->getResult();

        $data = array_map(fn ($field) => [
            'id' => $field->getId(),
            'fieldName' => $field->getFieldName(),
            'fieldType' => $field->getFieldType(),
            'fieldOptions' => $field->getFieldOptions(),
            'isRequired' => $field->isRequired(),
            'defaultValue' => $field->getDefaultValue(),
            'displayOrder' => $field->getDisplayOrder(),
            'isActive' => $field->isActive(),
        ], $fields);

        return $this->successResponse($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('EQUIPMENT_CREATE')]
    #[OA\Post(
        path: '/api/equipment-custom-fields',
        summary: 'Create a new custom field',
        tags: ['Equipment Custom Fields'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['fieldName', 'fieldType'],
                properties: [
                    new OA\Property(property: 'fieldName', type: 'string', example: 'KLASA'),
                    new OA\Property(property: 'fieldType', type: 'string', enum: ['text', 'number', 'date', 'boolean', 'select']),
                    new OA\Property(property: 'fieldOptions', type: 'array', items: new OA\Items(type: 'string')),
                    new OA\Property(property: 'isRequired', type: 'boolean', example: false),
                    new OA\Property(property: 'defaultValue', type: 'string'),
                    new OA\Property(property: 'displayOrder', type: 'integer', example: 0),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 201, description: 'Custom field created successfully'),
            new OA\Response(response: 400, description: 'Bad request'),
        ],
    )]
    public function create(Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['fieldName']) || !isset($data['fieldType'])) {
            return $this->errorResponse('Missing required fields: fieldName, fieldType', 400);
        }

        /** @var User|null $user */
        $user = $this->getUser();

        $command = new CreateCustomFieldCommand(
            fieldName: $data['fieldName'],
            fieldType: $data['fieldType'],
            fieldOptions: $data['fieldOptions'] ?? null,
            isRequired: $data['isRequired'] ?? false,
            defaultValue: $data['defaultValue'] ?? null,
            displayOrder: $data['displayOrder'] ?? 0,
            createdBy: $user?->getId(),
        );

        $envelope = $this->commandBus->dispatch($command);
        $field = $envelope->last(HandledStamp::class)?->getResult();

        return $this->successResponse([
            'id' => $field->getId(),
            'fieldName' => $field->getFieldName(),
            'fieldType' => $field->getFieldType(),
            'fieldOptions' => $field->getFieldOptions(),
            'isRequired' => $field->isRequired(),
            'defaultValue' => $field->getDefaultValue(),
            'displayOrder' => $field->getDisplayOrder(),
        ], 201);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('EQUIPMENT_DELETE')]
    #[OA\Delete(
        path: '/api/equipment-custom-fields/{id}',
        summary: 'Delete (soft delete) a custom field',
        tags: ['Equipment Custom Fields'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 204, description: 'Custom field deleted successfully'),
            new OA\Response(response: 404, description: 'Custom field not found'),
        ],
    )]
    public function delete(int $id): JsonResponse {
        $command = new DeleteCustomFieldCommand(id: $id);

        try {
            $this->commandBus->dispatch($command);

            return $this->successResponse(null, 204);
        }
        catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    #[Route('/values', name: 'set_value', methods: ['POST'])]
    #[IsGranted('EQUIPMENT_EDIT')]
    #[OA\Post(
        path: '/api/equipment-custom-fields/values',
        summary: 'Set custom field value for equipment',
        tags: ['Equipment Custom Fields'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['equipmentId', 'customFieldId'],
                properties: [
                    new OA\Property(property: 'equipmentId', type: 'integer', example: 1),
                    new OA\Property(property: 'customFieldId', type: 'integer', example: 1),
                    new OA\Property(property: 'value', type: 'string', example: 'Klasa A'),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 200, description: 'Custom value set successfully'),
            new OA\Response(response: 400, description: 'Bad request'),
        ],
    )]
    public function setCustomValue(Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['equipmentId']) || !isset($data['customFieldId'])) {
            return $this->errorResponse('Missing required fields: equipmentId, customFieldId', 400);
        }

        $command = new SetCustomValueCommand(
            equipmentId: (int) $data['equipmentId'],
            customFieldId: (int) $data['customFieldId'],
            value: $data['value'] ?? null,
        );

        try {
            $envelope = $this->commandBus->dispatch($command);
            $customValue = $envelope->last(HandledStamp::class)?->getResult();

            return $this->successResponse([
                'id' => $customValue->getId(),
                'equipmentId' => $customValue->getEquipment()?->getId(),
                'customFieldId' => $customValue->getCustomField()?->getId(),
                'value' => $customValue->getValue(),
            ]);
        }
        catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
}
