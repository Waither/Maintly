<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Tests\Integration\ApiWebTestCase;
use Symfony\Component\HttpFoundation\Response;

class TagControllerTest extends ApiWebTestCase {
    public function testTagCrud(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request('GET', '/api/tags', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('POST', '/api/tags', [], [], $headers, json_encode([]));
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);

        $client->request(
            'POST',
            '/api/tags',
            [],
            [],
            $headers,
            json_encode([
                'name' => 'tag-' . uniqid(),
                'color' => '#ff9900',
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($payload);
        $tagId = $payload['data']['id'] ?? null;
        $this->assertNotEmpty($tagId);

        $client->request(
            'PUT',
            '/api/tags/' . $tagId,
            [],
            [],
            $headers,
            json_encode([
                'name' => 'tag-updated-' . uniqid(),
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('DELETE', '/api/tags/' . $tagId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }
}
