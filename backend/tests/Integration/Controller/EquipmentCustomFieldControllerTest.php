<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Tests\Integration\ApiWebTestCase;
use Symfony\Component\HttpFoundation\Response;

class EquipmentCustomFieldControllerTest extends ApiWebTestCase {
    public function testListCustomFields(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');
        
        $client->request(
            'GET',
            '/api/equipment-custom-fields',
            [],
            [],
            $headers
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testCreateCustomFieldSuccessfully(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');
        
        $fieldName = 'custom_field_' . uniqid();
        $client->request(
            'POST',
            '/api/equipment-custom-fields',
            [],
            [],
            $headers,
            json_encode([
                'name' => $fieldName,
                'type' => 'text',
                'required' => false,
            ])
        );

        $statusCode = $client->getResponse()->getStatusCode();
        $this->assertIn($statusCode, [Response::HTTP_CREATED, Response::HTTP_OK, Response::HTTP_NO_CONTENT]);
    }

    public function testCreateCustomFieldInvalidType(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request(
            'POST',
            '/api/equipment-custom-fields',
            [],
            [],
            $headers,
            json_encode([
                'name' => 'test_field',
                'type' => 'invalid_type',
            ])
        );

        $statusCode = $client->getResponse()->getStatusCode();
        $this->assertIn($statusCode, [Response::HTTP_BAD_REQUEST, Response::HTTP_UNPROCESSABLE_ENTITY]);
    }

    public function testUnauthorizedAccessDenied(): void {
        $client = static::createClient();
        $client->request('GET', '/api/equipment-custom-fields');

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }
}
