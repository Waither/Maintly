<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Entity\Equipment;
use App\Entity\Tag;
use App\Tests\Integration\ApiWebTestCase;
use Symfony\Component\HttpFoundation\Response;

class EquipmentControllerTest extends ApiWebTestCase {
    public function testListAndGetEquipment(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request('GET', '/api/equipment', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $equipmentId = $this->getFirstEntityId(Equipment::class);

        $client->request('GET', '/api/equipment/' . $equipmentId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testCreateUpdateDeleteEquipment(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request('POST', '/api/equipment', [], [], $headers, json_encode([]));
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);

        $client->request(
            'POST',
            '/api/equipment',
            [],
            [],
            $headers,
            json_encode([
                'name' => 'Test Equipment',
                'costCenter' => 123,
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($payload);
        $equipmentId = $payload['data']['id'] ?? null;
        $this->assertNotEmpty($equipmentId);

        $client->request(
            'PUT',
            '/api/equipment/' . $equipmentId,
            [],
            [],
            $headers,
            json_encode([
                'name' => 'Updated Equipment',
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('DELETE', '/api/equipment/' . $equipmentId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testAssignAndRemoveTag(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request(
            'POST',
            '/api/equipment',
            [],
            [],
            $headers,
            json_encode([
                'name' => 'Taggable Equipment',
                'costCenter' => 321,
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $equipmentId = $payload['data']['id'] ?? null;
        $this->assertNotEmpty($equipmentId);

        $client->request(
            'POST',
            '/api/equipment/' . $equipmentId . '/tags',
            [],
            [],
            $headers,
            json_encode([])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);

        $em = $this->getEntityManager();
        $tag = new Tag();
        $tag->setName('tag-' . uniqid());
        $tag->setColor('#112233');
        $em->persist($tag);
        $em->flush();

        $tagId = $tag->getId();
        $this->assertNotNull($tagId);

        $client->request(
            'POST',
            '/api/equipment/' . $equipmentId . '/tags',
            [],
            [],
            $headers,
            json_encode(['tagId' => $tagId])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $client->request(
            'DELETE',
            '/api/equipment/' . $equipmentId . '/tags/' . $tagId,
            [],
            [],
            $headers
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }
}
