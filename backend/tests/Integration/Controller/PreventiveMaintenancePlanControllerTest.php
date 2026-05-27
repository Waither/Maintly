<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\DataFixtures\PreventiveMaintenancePlanFixtures;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class PreventiveMaintenancePlanControllerTest extends WebTestCase
{
    public function testRunDueGeneratesWorkOrders(): void
    {
        $client = static::createClient();

        $token = $this->loginAndGetToken($client);

        $client->request(
            'POST',
            '/api/preventive-plans/run-due',
            [],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $response = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($response);
        $this->assertArrayHasKey('data', $response);
        $this->assertArrayHasKey('generated', $response['data']);
        $this->assertGreaterThanOrEqual(1, (int) $response['data']['generated']);
    }

    public function testGenerateSinglePlanCreatesWorkOrder(): void
    {
        $client = static::createClient();

        $token = $this->loginAndGetToken($client);

        $client->request(
            'POST',
            '/api/preventive-plans/' . $this->getPlanIdByTitle($client, $token, 'Przegląd pompy hydraulicznej LP1') . '/generate',
            [],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $response = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($response);
        $this->assertArrayHasKey('data', $response);
        $this->assertArrayHasKey('workOrder', $response['data']);
        $this->assertSame('open', $response['data']['workOrder']['status']);
    }

    private function loginAndGetToken($client): string
    {
        $client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => 'admin@maintly.com',
                'password' => 'MaintlyAdmin!@#',
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $loginData = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($loginData);
        $this->assertArrayHasKey('token', $loginData);

        return (string) $loginData['token'];
    }

    private function getPlanIdByTitle($client, string $token, string $title): int
    {
        $client->request(
            'GET',
            '/api/preventive-plans',
            [],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($payload);
        $this->assertArrayHasKey('data', $payload);

        foreach ($payload['data'] as $plan) {
            if (($plan['title'] ?? null) === $title) {
                return (int) $plan['id'];
            }
        }

        $this->fail('Preventive maintenance plan fixture not found: ' . $title);
    }
}