<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use App\Tests\Integration\ApiWebTestCase;
use Symfony\Component\HttpFoundation\Response;

class WorkOrderControllerTest extends ApiWebTestCase {
    public function testStatusesAndPrioritiesCrud(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request('GET', '/api/work-orders/statuses', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('GET', '/api/work-orders/priorities', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $statusName = 'status-' . uniqid();
        $client->request(
            'POST',
            '/api/work-orders/statuses',
            [],
            [],
            $headers,
            json_encode([
                'name' => $statusName,
                'color' => '#112233',
                'displayOrder' => 99,
                'isFinal' => false,
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $statusPayload = json_decode((string) $client->getResponse()->getContent(), true);
        $statusId = $statusPayload['id'] ?? null;
        $this->assertNotEmpty($statusId);

        $client->request(
            'PUT',
            '/api/work-orders/statuses/' . $statusId,
            [],
            [],
            $headers,
            json_encode([
                'name' => $statusName . '-updated',
                'color' => '#445566',
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('DELETE', '/api/work-orders/statuses/' . $statusId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);

        $priorityName = 'priority-' . uniqid();
        $client->request(
            'POST',
            '/api/work-orders/priorities',
            [],
            [],
            $headers,
            json_encode([
                'name' => $priorityName,
                'color' => '#aa0000',
                'displayOrder' => 99,
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $priorityPayload = json_decode((string) $client->getResponse()->getContent(), true);
        $priorityId = $priorityPayload['id'] ?? null;
        $this->assertNotEmpty($priorityId);

        $client->request(
            'PUT',
            '/api/work-orders/priorities/' . $priorityId,
            [],
            [],
            $headers,
            json_encode([
                'name' => $priorityName . '-updated',
                'color' => '#cc0000',
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('DELETE', '/api/work-orders/priorities/' . $priorityId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testWorkOrderListExportAndCrud(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request('GET', '/api/work-orders', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('GET', '/api/work-orders/export?startDate=2000-01-01&endDate=2100-01-01', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $workOrderId = $this->getFirstEntityId(WorkOrder::class);
        $client->request('GET', '/api/work-orders/' . $workOrderId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('POST', '/api/work-orders', [], [], $headers, 'not-json');
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);

        $statusId = $this->getFirstEntityId(WorkOrderStatus::class);
        $priorityId = $this->getFirstEntityId(WorkOrderPriority::class);
        $equipmentId = $this->getFirstEntityId(Equipment::class);

        $client->request(
            'POST',
            '/api/work-orders',
            [],
            [],
            $headers,
            json_encode([
                'title' => 'Work order ' . uniqid(),
                'description' => 'Test description',
                'statusId' => $statusId,
                'priorityId' => $priorityId,
                'equipmentId' => $equipmentId,
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $createPayload = json_decode((string) $client->getResponse()->getContent(), true);
        $createdId = $createPayload['id'] ?? null;
        $this->assertNotEmpty($createdId);

        $client->request(
            'PATCH',
            '/api/work-orders/' . $createdId,
            [],
            [],
            $headers,
            json_encode([
                'title' => 'Updated title',
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $em = $this->getEntityManager();
        $assignee = $em->getRepository(User::class)->findOneBy(['email' => 'tech@maintly.com']);
        $this->assertNotNull($assignee);

        $client->request(
            'POST',
            '/api/work-orders/' . $createdId . '/assign',
            [],
            [],
            $headers,
            json_encode([
                'userId' => $assignee->getId(),
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $client->request(
            'POST',
            '/api/work-orders/' . $createdId . '/activities',
            [],
            [],
            $headers,
            json_encode([
                'description' => 'Activity text',
                'performedBy' => $assignee->getId(),
                'timeSpent' => 15,
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $client->request('DELETE', '/api/work-orders/' . $createdId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }
}
