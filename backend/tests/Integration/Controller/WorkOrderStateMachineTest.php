<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Entity\Equipment;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use App\Tests\Integration\ApiWebTestCase;
use Symfony\Component\HttpFoundation\Response;

/**
 * Integration tests for:
 * - MTTR/MTBF KPI in dashboard stats
 * - State machine: valid and invalid status transitions
 * - GET /{id}/transitions endpoint
 */
class WorkOrderStateMachineTest extends ApiWebTestCase
{
    private function createWorkOrder(mixed $client, array $headers): int
    {
        $em = $this->getEntityManager();
        $status = $em->getRepository(WorkOrderStatus::class)->findOneBy(['name' => 'open']);
        $priority = $em->getRepository(WorkOrderPriority::class)->findAll()[0] ?? null;
        $equipment = $em->getRepository(Equipment::class)->findOneBy(['deletedAt' => null]);

        $this->assertNotNull($status, 'Fixture status "open" missing');
        $this->assertNotNull($priority, 'Fixture priority missing');
        $this->assertNotNull($equipment, 'Fixture equipment missing');

        $client->request(
            'POST',
            '/api/work-orders',
            [],
            [],
            $headers,
            json_encode([
                'title'       => 'State machine test ' . uniqid(),
                'description' => 'Testing status transitions',
                'statusId'    => $status->getId(),
                'priorityId'  => $priority->getId(),
                'equipmentId' => $equipment->getId(),
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $payload = json_decode((string) $client->getResponse()->getContent(), true);

        return (int) $payload['id'];
    }

    /** Test: GET /api/work-orders/{id}/transitions returns allowed transitions */
    public function testGetAllowedTransitions(): void
    {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $id = $this->createWorkOrder($client, $headers);

        $client->request('GET', '/api/work-orders/' . $id . '/transitions', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('currentStatus', $payload);
        $this->assertArrayHasKey('allowedTransitions', $payload);
        $this->assertSame('open', $payload['currentStatus']);
        $this->assertContains('in_progress', $payload['allowedTransitions']);
        $this->assertNotContains('completed', $payload['allowedTransitions']);
    }

    /** Test: valid transition open → in_progress succeeds */
    public function testValidTransitionOpenToInProgress(): void
    {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $id = $this->createWorkOrder($client, $headers);

        $em = $this->getEntityManager();
        $inProgressStatus = $em->getRepository(WorkOrderStatus::class)->findOneBy(['name' => 'in_progress']);
        $this->assertNotNull($inProgressStatus);

        $client->request(
            'PATCH',
            '/api/work-orders/' . $id,
            [],
            [],
            $headers,
            json_encode(['statusId' => $inProgressStatus->getId()])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertSame('in_progress', $payload['status']['name']);
    }

    /** Test: invalid transition open → completed returns 422 */
    public function testInvalidTransitionOpenToCompletedReturns422(): void
    {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $id = $this->createWorkOrder($client, $headers);

        $em = $this->getEntityManager();
        $completedStatus = $em->getRepository(WorkOrderStatus::class)->findOneBy(['name' => 'completed']);
        $this->assertNotNull($completedStatus);

        $client->request(
            'PATCH',
            '/api/work-orders/' . $id,
            [],
            [],
            $headers,
            json_encode(['statusId' => $completedStatus->getId()])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /** Test: transition to final status blocks further changes */
    public function testFinalStatusBlocksFurtherTransitions(): void
    {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $id = $this->createWorkOrder($client, $headers);

        $em = $this->getEntityManager();
        $inProgress = $em->getRepository(WorkOrderStatus::class)->findOneBy(['name' => 'in_progress']);
        $completed   = $em->getRepository(WorkOrderStatus::class)->findOneBy(['name' => 'completed']);
        $open        = $em->getRepository(WorkOrderStatus::class)->findOneBy(['name' => 'open']);

        // open → in_progress (valid)
        $client->request('PATCH', '/api/work-orders/' . $id, [], [], $headers,
            json_encode(['statusId' => $inProgress->getId()]));
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        // in_progress → completed (valid)
        $client->request('PATCH', '/api/work-orders/' . $id, [], [], $headers,
            json_encode(['statusId' => $completed->getId()]));
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        // completed → open (INVALID — final status)
        $client->request('PATCH', '/api/work-orders/' . $id, [], [], $headers,
            json_encode(['statusId' => $open->getId()]));
        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /** Test: dashboard stats contain kpi.mttr and kpi.mtbf keys */
    public function testDashboardStatsContainKpi(): void
    {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request('GET', '/api/dashboard/stats', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('kpi', $payload);
        $this->assertArrayHasKey('mttr', $payload['kpi']);
        $this->assertArrayHasKey('mtbf', $payload['kpi']);
        $this->assertArrayHasKey('mttrUnit', $payload['kpi']);
        $this->assertArrayHasKey('mtbfUnit', $payload['kpi']);
        $this->assertSame('hours', $payload['kpi']['mttrUnit']);
        $this->assertSame('hours', $payload['kpi']['mtbfUnit']);
    }
}
