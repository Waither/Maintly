<?php

namespace App\Controller;

use App\Repository\TranslationRepository;
use Exception;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/translations')]
class TranslationController extends AbstractController {
    public function __construct(
        private readonly TranslationRepository $translationRepository,
    ) {}

    /**
     * Get all translations for a specific locale
     * Falls back to English if translation not found.
     *
     * @param string $locale Language code (e.g., 'en', 'pl', 'de')
     */
    #[Route('/{locale}', name: 'api_translations_get', methods: ['GET'])]
    #[OA\Get(
        path: '/api/translations/{locale}',
        summary: 'Get all translations for a locale',
        description: 'Returns all translation keys and values for the specified language. Falls back to English if translation not found.',
        tags: ['Translations'],
        parameters: [
            new OA\Parameter(
                name: 'locale',
                in: 'path',
                required: true,
                description: 'Language code (ISO 639-1)',
                schema: new OA\Schema(type: 'string', example: 'pl'),
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Translations retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'success'),
                        new OA\Property(property: 'code', type: 'integer', example: 200),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            example: [
                                'app.title' => 'Maintly CMMS',
                                'login.button' => 'Zaloguj się',
                                'error.not_found' => 'Nie znaleziono',
                            ],
                        ),
                    ],
                ),
            ),
            new OA\Response(response: 500, description: 'Server error'),
        ],
    )]
    public function getTranslations(string $locale): JsonResponse {
        try {
            $translations = $this->translationRepository->getAllForLocale($locale);

            return $this->json([
                'status' => 'success',
                'code' => 200,
                'data' => $translations,
            ], 200, [
                'Content-Type' => 'application/json; charset=utf-8',
            ], [
                'json_encode_options' => JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES,
            ]);
        }
        catch (Exception $e) {
            return $this->json([
                'status' => 'error',
                'code' => 500,
                'message' => 'translations.fetch_failed',
            ], 500);
        }
    }
}
