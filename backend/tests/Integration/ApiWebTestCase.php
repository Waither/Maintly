<?php

declare(strict_types=1);

namespace App\Tests\Integration;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

abstract class ApiWebTestCase extends WebTestCase {
    protected function loginAndGetToken($client, string $email, string $password): string {
        $client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => $email,
                'password' => $password,
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($payload);
        $this->assertArrayHasKey('token', $payload);

        return (string) $payload['token'];
    }

    protected function authHeaders(string $token): array {
        return [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
            'CONTENT_TYPE' => 'application/json',
        ];
    }

    protected function createClientWithAuth(string $email, string $password): array {
        $client = static::createClient();
        $token = $this->loginAndGetToken($client, $email, $password);

        return [$client, $this->authHeaders($token)];
    }

    protected function getEntityManager(): EntityManagerInterface {
        return static::getContainer()->get(EntityManagerInterface::class);
    }

    protected function getFirstEntityId(string $entityClass, array $criteria = []): int {
        $entity = $this->getEntityManager()->getRepository($entityClass)->findOneBy($criteria);
        $this->assertNotNull($entity, 'Missing fixture for ' . $entityClass);

        return (int) $entity->getId();
    }
}
