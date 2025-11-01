<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class TestController extends AbstractController {
    #[Route('/api/test', name: 'api_test', methods: ['GET'])]
    public function test(): JsonResponse {
        return $this->json([
            'message' => 'Routing działa!',
            'timestamp' => time()
        ]);
    }

    #[Route('/api/test/{id}', name: 'api_test_show', methods: ['GET'])]
    public function show(int $id): JsonResponse {
        return $this->json([
            'id' => $id,
            'message' => 'Pobrano element o ID: ' . $id
        ]);
    }
}
