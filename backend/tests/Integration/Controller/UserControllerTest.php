<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Entity\UserRole;
use App\Tests\Integration\ApiWebTestCase;
use Symfony\Component\HttpFoundation\Response;

class UserControllerTest extends ApiWebTestCase {
    public function testUserCrudAndToggle(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request('GET', '/api/users', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request(
            'POST',
            '/api/users',
            [],
            [],
            $headers,
            json_encode([
                'email' => 'bad-email',
                'password' => 'short',
                'firstName' => 'Test',
                'lastName' => 'User',
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);

        $em = $this->getEntityManager();
        $role = $em->getRepository(UserRole::class)->findOneBy(['name' => 'reporter']);
        $this->assertNotNull($role);

        $email = 'user+' . uniqid() . '@example.com';
        $client->request(
            'POST',
            '/api/users',
            [],
            [],
            $headers,
            json_encode([
                'email' => $email,
                'password' => 'SecurePass123',
                'firstName' => 'Test',
                'lastName' => 'User',
                'roleId' => $role->getId(),
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($payload);
        $userId = $payload['data']['id'] ?? null;
        $this->assertNotEmpty($userId);

        $client->request('GET', '/api/users/' . $userId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request(
            'PUT',
            '/api/users/' . $userId,
            [],
            [],
            $headers,
            json_encode([
                'email' => 'invalid',
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);

        $client->request(
            'PUT',
            '/api/users/' . $userId,
            [],
            [],
            $headers,
            json_encode([
                'lastName' => 'Updated',
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('PATCH', '/api/users/' . $userId . '/toggle-status', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('DELETE', '/api/users/' . $userId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }
}
