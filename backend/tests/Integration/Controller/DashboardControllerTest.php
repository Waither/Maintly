<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Tests\Integration\ApiWebTestCase;
use Symfony\Component\HttpFoundation\Response;

class DashboardControllerTest extends ApiWebTestCase {
    public function testDashboardStats(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request('GET', '/api/dashboard/stats', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($payload);
        $this->assertArrayHasKey('workOrders', $payload);
        $this->assertArrayHasKey('equipment', $payload);
    }
}
