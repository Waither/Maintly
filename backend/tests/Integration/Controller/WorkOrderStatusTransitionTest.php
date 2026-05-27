<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class WorkOrderStatusTransitionTest extends WebTestCase
{
    public function testInvalidStatusTransitionIsRejected(): void
    {
        $client = static::createClient();

        $token = $this->loginAndGetToken($client);

        $workOrderId = $this->createOpenWorkOrder($client, $token);
        $completedStatusId = $this->getStatusIdByName($client, $token, 'completed');

        $client->request(
            'PATCH',
            '/api/work-orders/' . $workOrderId,
            [],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'statusId' => $completedStatusId,
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
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

        return (string) $loginData['token'];
    }

    private function createOpenWorkOrder($client, string $token): int
    {
        $client->request(
            'POST',
            '/api/work-orders',
            [],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'title' => 'State machine test work order',
                'description' => 'Created by integration test',
                'statusId' => $this->getStatusIdByName($client, $token, 'open'),
                'priorityId' => $this->getPriorityIdByName($client, $token, 'medium'),
                'equipmentId' => $this->getEquipmentIdByName($client, $token, 'Pompa hydrauliczna LP1'),
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($payload);

        return (int) $payload['id'];
    }

    private function getStatusIdByName($client, string $token, string $statusName): int
    {
        $client->request(
            'GET',
            '/api/work-orders/statuses',
            [],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $statuses = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($statuses);

        foreach ($statuses as $status) {
            if (($status['name'] ?? null) === $statusName) {
                return (int) $status['id'];
            }
        }

        $this->fail('Work order status not found: ' . $statusName);
    }

    private function getPriorityIdByName($client, string $token, string $priorityName): int
    {
        $client->request(
            'GET',
            '/api/work-orders/priorities',
            [],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $priorities = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($priorities);

        foreach ($priorities as $priority) {
            if (($priority['name'] ?? null) === $priorityName) {
                return (int) $priority['id'];
            }
        }

        $this->fail('Work order priority not found: ' . $priorityName);
    }

    private function getEquipmentIdByName($client, string $token, string $equipmentName): int
    {
        $client->request(
            'GET',
            '/api/equipment',
            [],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $equipment = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($equipment);
        $items = $equipment['data'] ?? $equipment;

        foreach ($items as $item) {
            if (($item['name'] ?? null) === $equipmentName) {
                return (int) $item['id'];
            }
        }

        $this->fail('Equipment not found: ' . $equipmentName);
    }
}