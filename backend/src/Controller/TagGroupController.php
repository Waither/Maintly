<?php

namespace App\Controller;

use App\Application\Command\TagGroup\CreateTagGroupCommand;
use App\Application\Command\TagGroup\DeleteTagGroupCommand;
use App\Application\Command\TagGroup\UpdateTagGroupCommand;
use App\Application\Query\TagGroup\GetAllTagGroupsQuery;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\HandledStamp;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/tag-groups', name: 'tag_groups_')]
class TagGroupController extends AbstractController {
    use ApiResponseTrait;

    public function __construct(
        private MessageBusInterface $commandBus,
        private MessageBusInterface $queryBus,
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
    #[IsGranted('EQUIPMENT_VIEW')]
    #[OA\Get(
        path: '/api/tag-groups',
        summary: 'Get all tag groups',
        tags: ['Tag Groups'],
    )]
    #[OA\Response(
        response: 200,
        description: 'Tag groups list retrieved successfully',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: \App\Entity\TagGroup::class)),
        ),
    )]
    public function index(): JsonResponse {
        $query = new GetAllTagGroupsQuery();

        $envelope = $this->queryBus->dispatch($query);
        $tagGroups = $envelope->last(HandledStamp::class)?->getResult();

        $data = array_map(fn ($group) => [
            'id' => $group->getId(),
            'name' => $group->getName(),
            'isRequired' => $group->isRequired(),
            'isSingleChoice' => $group->isSingleChoice(),
            'displayOrder' => $group->getDisplayOrder(),
            'tagsCount' => $group->getTags()->count(),
        ], $tagGroups);

        return $this->successResponse($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('EQUIPMENT_CREATE')]
    #[OA\Post(
        path: '/api/tag-groups',
        summary: 'Create a new tag group',
        tags: ['Tag Groups'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Lokalizacja'),
                    new OA\Property(property: 'isRequired', type: 'boolean', example: true),
                    new OA\Property(property: 'isSingleChoice', type: 'boolean', example: true),
                    new OA\Property(property: 'displayOrder', type: 'integer', example: 1),
                ],
            ),
        ),
    )]
    #[OA\Response(
        response: 201,
        description: 'Tag group created successfully',
        content: new OA\JsonContent(ref: new Model(type: \App\Entity\TagGroup::class)),
    )]
    #[OA\Response(response: 400, description: 'Bad request')]
    public function create(Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name'])) {
            return $this->errorResponse('Missing required field: name', 400);
        }

        $command = new CreateTagGroupCommand(
            name: $data['name'],
            isRequired: $data['isRequired'] ?? false,
            isSingleChoice: $data['isSingleChoice'] ?? false,
            displayOrder: $data['displayOrder'] ?? 0,
        );

        $envelope = $this->commandBus->dispatch($command);
        $tagGroup = $envelope->last(HandledStamp::class)?->getResult();

        return $this->successResponse([
            'id' => $tagGroup->getId(),
            'name' => $tagGroup->getName(),
            'isRequired' => $tagGroup->isRequired(),
            'isSingleChoice' => $tagGroup->isSingleChoice(),
            'displayOrder' => $tagGroup->getDisplayOrder(),
        ], 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    #[IsGranted('EQUIPMENT_EDIT')]
    #[OA\Put(
        path: '/api/tag-groups/{id}',
        summary: 'Update a tag group',
        tags: ['Tag Groups'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
    )]
    #[OA\Response(
        response: 200,
        description: 'Tag group updated successfully',
        content: new OA\JsonContent(ref: new Model(type: \App\Entity\TagGroup::class)),
    )]
    #[OA\Response(response: 404, description: 'Tag group not found')]
    public function update(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $command = new UpdateTagGroupCommand(
            id: $id,
            name: $data['name'] ?? null,
            isRequired: $data['isRequired'] ?? null,
            isSingleChoice: $data['isSingleChoice'] ?? null,
            displayOrder: $data['displayOrder'] ?? null,
        );

        try {
            $envelope = $this->commandBus->dispatch($command);
            $tagGroup = $envelope->last(HandledStamp::class)?->getResult();

            return $this->successResponse([
                'id' => $tagGroup->getId(),
                'name' => $tagGroup->getName(),
                'isRequired' => $tagGroup->isRequired(),
                'isSingleChoice' => $tagGroup->isSingleChoice(),
                'displayOrder' => $tagGroup->getDisplayOrder(),
            ]);
        }
        catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('EQUIPMENT_DELETE')]
    #[OA\Delete(
        path: '/api/tag-groups/{id}',
        summary: 'Delete a tag group',
        tags: ['Tag Groups'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 204, description: 'Tag group deleted successfully'),
            new OA\Response(response: 404, description: 'Tag group not found'),
        ],
    )]
    public function delete(int $id): JsonResponse {
        $command = new DeleteTagGroupCommand(id: $id);

        try {
            $this->commandBus->dispatch($command);

            return $this->successResponse(null, 204);
        }
        catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
}
