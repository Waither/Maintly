<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Tests\Integration\ApiWebTestCase;
use Symfony\Component\HttpFoundation\Response;

class ReportControllerTest extends ApiWebTestCase {
    public function testReportEndpoints(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request('GET', '/api/reports/options', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('POST', '/api/reports/generate', [], [], $headers, json_encode([]));
        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);

        $client->request(
            'POST',
            '/api/reports/generate',
            [],
            [],
            $headers,
            json_encode([
                'reportType' => 'invalid',
                'format' => 'pdf',
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);

        $client->request(
            'POST',
            '/api/reports/generate',
            [],
            [],
            $headers,
            json_encode([
                'reportType' => 'maintenance',
                'format' => 'invalid',
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);

        $client->request(
            'POST',
            '/api/reports/generate',
            [],
            [],
            $headers,
            json_encode([
                'reportType' => 'maintenance',
                'format' => 'pdf',
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_ACCEPTED);

        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($payload);
        $reportId = $payload['data']['id'] ?? null;
        $this->assertNotEmpty($reportId);

        $client->request('GET', '/api/reports', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('GET', '/api/reports/' . $reportId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('GET', '/api/reports/' . $reportId . '/download', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);

        $client->request('DELETE', '/api/reports/' . $reportId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }
}
