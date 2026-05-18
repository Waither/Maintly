<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Tests\Integration\ApiWebTestCase;
use Symfony\Component\HttpFoundation\Response;

class TagGroupControllerTest extends ApiWebTestCase {
    public function testTagGroupCrud(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request('GET', '/api/tag-groups', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('POST', '/api/tag-groups', [], [], $headers, json_encode([]));
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);

        $client->request(
            'POST',
            '/api/tag-groups',
            [],
            [],
            $headers,
            json_encode([
                'name' => 'group-' . uniqid(),
                'isRequired' => true,
                'isSingleChoice' => true,
                'displayOrder' => 5,
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($payload);
        $groupId = $payload['data']['id'] ?? null;
        $this->assertNotEmpty($groupId);

        $client->request(
            'PUT',
            '/api/tag-groups/' . $groupId,
            [],
            [],
            $headers,
            json_encode([
                'name' => 'group-updated-' . uniqid(),
                'displayOrder' => 6,
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('DELETE', '/api/tag-groups/' . $groupId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }
}
