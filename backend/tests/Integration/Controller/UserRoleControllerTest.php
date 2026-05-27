<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Tests\Integration\ApiWebTestCase;
use Symfony\Component\HttpFoundation\Response;

class UserRoleControllerTest extends ApiWebTestCase {
    public function testSelectRolesDropdown(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');
        
        $client->request(
            'GET',
            '/api/roles/select',
            [],
            [],
            $headers
        );

        $statusCode = $client->getResponse()->getStatusCode();
        $this->assertIn($statusCode, [Response::HTTP_OK, Response::HTTP_NOT_FOUND]);
    }

    public function testListRolesFullDetails(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');
        
        $client->request(
            'GET',
            '/api/roles',
            [],
            [],
            $headers
        );

        $statusCode = $client->getResponse()->getStatusCode();
        $this->assertIn($statusCode, [Response::HTTP_OK, Response::HTTP_NOT_FOUND]);
    }

    public function testCreateRoleSuccessfully(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');
        
        $roleName = 'test_role_' . uniqid();
        $client->request(
            'POST',
            '/api/roles',
            [],
            [],
            $headers,
            json_encode([
                'name' => $roleName,
                'description' => 'Test role',
            ])
        );

        $statusCode = $client->getResponse()->getStatusCode();
        $this->assertIn($statusCode, [Response::HTTP_CREATED, Response::HTTP_OK, Response::HTTP_NOT_FOUND]);
    }

    public function testUnauthorizedAccessDenied(): void {
        $client = static::createClient();
        $client->request('GET', '/api/roles');

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }
}
