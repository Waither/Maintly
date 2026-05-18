<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Tests\Integration\ApiWebTestCase;
use Symfony\Component\HttpFoundation\Response;

class TranslationControllerTest extends ApiWebTestCase {
    public function testGetTranslations(): void {
        $client = static::createClient();

        $client->request('GET', '/api/translations/pl');
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($payload);
        $this->assertArrayHasKey('data', $payload);
        $this->assertIsArray($payload['data']);
    }
}
