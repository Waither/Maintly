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

    public function testGetUserNotFound(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request('GET', '/api/users/99999', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testListUsersWithPagination(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request('GET', '/api/users?page=1&limit=10', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('data', $data);
        $this->assertIsArray($data['data']);
    }

    public function testCreateUserWithMinimalFields(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $em = $this->getEntityManager();
        $role = $em->getRepository(UserRole::class)->findOneBy(['name' => 'reporter']);

        $email = 'newuser+' . uniqid() . '@example.com';
        $client->request(
            'POST',
            '/api/users',
            [],
            [],
            $headers,
            json_encode([
                'email' => $email,
                'password' => 'SecurePass123!',
                'firstName' => 'John',
                'lastName' => 'Doe',
                'roleId' => $role->getId(),
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('data', $data);
        $this->assertSame($email, $data['data']['email']);
    }

    public function testUpdateUserEmail(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $em = $this->getEntityManager();
        $role = $em->getRepository(UserRole::class)->findOneBy(['name' => 'reporter']);

        // Create user
        $email = 'user+' . uniqid() . '@example.com';
        $client->request(
            'POST',
            '/api/users',
            [],
            [],
            $headers,
            json_encode([
                'email' => $email,
                'password' => 'SecurePass123!',
                'firstName' => 'Test',
                'lastName' => 'User',
                'roleId' => $role->getId(),
            ])
        );

        $payload = json_decode($client->getResponse()->getContent(), true);
        $userId = $payload['data']['id'];

        // Update with new email
        $newEmail = 'updated+' . uniqid() . '@example.com';
        $client->request(
            'PUT',
            '/api/users/' . $userId,
            [],
            [],
            $headers,
            json_encode([
                'email' => $newEmail,
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $updated = json_decode($client->getResponse()->getContent(), true);
        $this->assertSame($newEmail, $updated['data']['email']);
    }

    public function testUpdateUserProfile(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request(
            'PUT',
            '/api/user/profile',
            [],
            [],
            $headers,
            json_encode([
                'firstName' => 'AdminUpdated',
                'lastName' => 'User',
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testDeleteUserSuccessfully(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $em = $this->getEntityManager();
        $role = $em->getRepository(UserRole::class)->findOneBy(['name' => 'reporter']);

        // Create user to delete
        $email = 'delete+' . uniqid() . '@example.com';
        $client->request(
            'POST',
            '/api/users',
            [],
            [],
            $headers,
            json_encode([
                'email' => $email,
                'password' => 'SecurePass123!',
                'firstName' => 'Delete',
                'lastName' => 'User',
                'roleId' => $role->getId(),
            ])
        );

        $payload = json_decode($client->getResponse()->getContent(), true);
        $userId = $payload['data']['id'];

        // Delete user
        $client->request('DELETE', '/api/users/' . $userId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        // Verify user is deleted
        $client->request('GET', '/api/users/' . $userId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testToggleUserStatus(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $em = $this->getEntityManager();
        $role = $em->getRepository(UserRole::class)->findOneBy(['name' => 'reporter']);

        // Create user
        $email = 'toggle+' . uniqid() . '@example.com';
        $client->request(
            'POST',
            '/api/users',
            [],
            [],
            $headers,
            json_encode([
                'email' => $email,
                'password' => 'SecurePass123!',
                'firstName' => 'Toggle',
                'lastName' => 'User',
                'roleId' => $role->getId(),
            ])
        );

        $payload = json_decode($client->getResponse()->getContent(), true);
        $userId = $payload['data']['id'];

        // Toggle status
        $client->request(
            'PATCH',
            '/api/users/' . $userId . '/toggle-status',
            [],
            [],
            $headers
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $toggled = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('data', $toggled);
    }
}
