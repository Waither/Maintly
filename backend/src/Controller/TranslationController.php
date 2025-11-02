<?php

namespace App\Controller;

use App\Repository\TranslationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/translations')]
class TranslationController extends AbstractController {
    public function __construct(
        private readonly TranslationRepository $translationRepository
    ) {}

    /**
     * Get all translations for a specific locale
     * Falls back to English if translation not found
     * 
     * @param string $locale Language code (e.g., 'en', 'pl', 'de')
     */
    #[Route('/{locale}', name: 'api_translations_get', methods: ['GET'])]
    public function getTranslations(string $locale): JsonResponse {
        try {
            $translations = $this->translationRepository->getAllForLocale($locale);

            return $this->json([
                'status' => 'success',
                'code' => 200,
                'data' => $translations
            ]);
        }
        catch (\Exception $e) {
            return $this->json([
                'status' => 'error',
                'code' => 500,
                'message' => 'translations.fetch_failed'
            ], 500);
        }
    }
}
