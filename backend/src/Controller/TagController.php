<?php

namespace App\Controller;

use App\Application\Command\Tag\CreateTagCommand;
use App\Application\Command\Tag\DeleteTagCommand;
use App\Application\Command\Tag\UpdateTagCommand;
use App\Application\Query\Tag\GetAllTagsQuery;
use OpenApi\Attributes as OA;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\HandledStamp;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/tags', name: 'tags_')]
class TagController extends AbstractController {
    use ApiResponseTrait;

    public function __construct(
        private MessageBusInterface $commandBus,
        private MessageBusInterface $queryBus,
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
    #[IsGranted('EQUIPMENT_VIEW')]
    #[OA\Get(
        path: '/api/tags',
        summary: 'Get all tags',
        tags: ['Tags'],
        parameters: [
            new OA\Parameter(
                name: 'tagGroupId',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'integer'),
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Tags list retrieved successfully'),
            new OA\Response(response: 401, description: 'Unauthorized'),
        ],
    )]
    public function index(Request $request): JsonResponse {
        $tagGroupId = $request->query->get('tagGroupId');

        $query = new GetAllTagsQuery(
            tagGroupId: $tagGroupId ? (int) $tagGroupId : null,
        );

        $envelope = $this->queryBus->dispatch($query);
        $tags = $envelope->last(HandledStamp::class)?->getResult();

        $data = array_map(fn ($tag) => [
            'id' => $tag->getId(),
            'name' => $tag->getName(),
            'color' => $tag->getColor(),
            'tagGroupId' => $tag->getTagGroup()?->getId(),
            'tagGroupName' => $tag->getTagGroup()?->getName(),
        ], $tags);

        return $this->successResponse($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('EQUIPMENT_CREATE')]
    #[OA\Post(
        path: '/api/tags',
        summary: 'Create a new tag',
        tags: ['Tags'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Hydraulika'),
                    new OA\Property(property: 'color', type: 'string', example: '#FF5733'),
                    new OA\Property(property: 'tagGroupId', type: 'integer', example: 1),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 201, description: 'Tag created successfully'),
            new OA\Response(response: 400, description: 'Bad request'),
            new OA\Response(response: 401, description: 'Unauthorized'),
        ],
    )]
    public function create(Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name'])) {
            return $this->errorResponse('Missing required field: name', 400);
        }

        $command = new CreateTagCommand(
            name: $data['name'],
            color: $data['color'] ?? null,
            tagGroupId: $data['tagGroupId'] ?? null,
        );

        $envelope = $this->commandBus->dispatch($command);
        $tag = $envelope->last(HandledStamp::class)?->getResult();

        return $this->successResponse([
            'id' => $tag->getId(),
            'name' => $tag->getName(),
            'color' => $tag->getColor(),
            'tagGroupId' => $tag->getTagGroup()?->getId(),
        ], 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    #[IsGranted('EQUIPMENT_EDIT')]
    #[OA\Put(
        path: '/api/tags/{id}',
        summary: 'Update a tag',
        tags: ['Tags'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string'),
                    new OA\Property(property: 'color', type: 'string'),
                    new OA\Property(property: 'tagGroupId', type: 'integer'),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 200, description: 'Tag updated successfully'),
            new OA\Response(response: 404, description: 'Tag not found'),
        ],
    )]
    public function update(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $command = new UpdateTagCommand(
            id: $id,
            name: $data['name'] ?? null,
            color: $data['color'] ?? null,
            tagGroupId: $data['tagGroupId'] ?? null,
        );

        try {
            $envelope = $this->commandBus->dispatch($command);
            $tag = $envelope->last(HandledStamp::class)?->getResult();

            return $this->successResponse([
                'id' => $tag->getId(),
                'name' => $tag->getName(),
                'color' => $tag->getColor(),
                'tagGroupId' => $tag->getTagGroup()?->getId(),
            ]);
        }
        catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('EQUIPMENT_DELETE')]
    #[OA\Delete(
        path: '/api/tags/{id}',
        summary: 'Delete a tag',
        tags: ['Tags'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 204, description: 'Tag deleted successfully'),
            new OA\Response(response: 404, description: 'Tag not found'),
        ],
    )]
    public function delete(int $id): JsonResponse {
        $command = new DeleteTagCommand(id: $id);

        try {
            $this->commandBus->dispatch($command);

            return $this->successResponse(null, 204);
        }
        catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
}
