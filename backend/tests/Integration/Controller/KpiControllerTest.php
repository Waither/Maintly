<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use App\Tests\Integration\ApiWebTestCase;
use DateTime;
use DateTimeImmutable;
use Symfony\Component\HttpFoundation\Response;

class KpiControllerTest extends ApiWebTestCase
{
    public function testStatsRequiresAuthentication(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/kpi/stats');

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testStatsDefaultsToCurrentYearPeriod(): void
    {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request('GET', '/api/kpi/stats', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($payload);
        $this->assertArrayHasKey('period', $payload);
        $this->assertSame((new DateTimeImmutable('first day of January this year'))->format('Y-m-d'), $payload['period']['from']);
        $this->assertSame((new DateTimeImmutable('today'))->format('Y-m-d'), $payload['period']['to']);
        $this->assertArrayHasKey('workOrders', $payload);
        $this->assertArrayHasKey('trend', $payload);
        $this->assertArrayHasKey('topEquipment', $payload);
        $this->assertArrayHasKey('equipment', $payload);
    }

    public function testStatsFiltersByDateRange(): void
    {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $em = $this->getEntityManager();
        $equipment = $em->getRepository(Equipment::class)->findOneBy([]);
        $priority = $em->getRepository(WorkOrderPriority::class)->findOneBy([]);
        $completedStatus = $em->getRepository(WorkOrderStatus::class)->findOneBy(['name' => 'completed']);
        $openStatus = $em->getRepository(WorkOrderStatus::class)->findOneBy(['name' => 'open']);
        $admin = $em->getRepository(User::class)->findOneBy(['email' => 'admin@maintly.com']);

        $this->assertNotNull($equipment);
        $this->assertNotNull($priority);
        $this->assertNotNull($completedStatus);
        $this->assertNotNull($openStatus);
        $this->assertNotNull($admin);

        $currentYear = (int) (new DateTimeImmutable())->format('Y');

        $currentYearOrder = $this->createWorkOrder(
            title: 'KPI current ' . uniqid(),
            status: $completedStatus,
            priority: $priority,
            equipment: $equipment,
            creator: $admin,
            createdAt: new DateTime($currentYear . '-01-02 10:00:00'),
            plannedEndDate: new DateTime($currentYear . '-01-02 12:00:00'),
            actualEndDate: new DateTime($currentYear . '-01-02 12:30:00'),
            updatedAt: new DateTime($currentYear . '-01-02 12:30:00')
        );

        $previousYearOrder = $this->createWorkOrder(
            title: 'KPI old ' . uniqid(),
            status: $openStatus,
            priority: $priority,
            equipment: $equipment,
            creator: $admin,
            createdAt: new DateTime(($currentYear - 1) . '-12-31 10:00:00'),
            plannedEndDate: new DateTime(($currentYear - 1) . '-12-31 11:00:00'),
            actualEndDate: null,
            updatedAt: new DateTime(($currentYear - 1) . '-12-31 10:30:00')
        );

        $this->assertNotNull($currentYearOrder->getId());
        $this->assertNotNull($previousYearOrder->getId());

        $client->request('GET', '/api/kpi/stats', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $defaultPayload = json_decode((string) $client->getResponse()->getContent(), true);
        $defaultTotal = (int) $defaultPayload['workOrders']['total'];

        $client->request(
            'GET',
            '/api/kpi/stats?dateFrom=' . ($currentYear - 1) . '-01-01&dateTo=' . (new DateTimeImmutable('today'))->format('Y-m-d'),
            [],
            [],
            $headers
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $expandedPayload = json_decode((string) $client->getResponse()->getContent(), true);
        $expandedTotal = (int) $expandedPayload['workOrders']['total'];

        $this->assertGreaterThan($defaultTotal, $expandedTotal);
        $this->assertArrayHasKey('completionRate', $expandedPayload['workOrders']);
    }

    public function testInvalidDateRangeReturnsValidationError(): void
    {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request(
            'GET',
            '/api/kpi/stats?dateFrom=2026-12-31&dateTo=2026-01-01',
            [],
            [],
            $headers
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        $payload = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($payload);
        $this->assertSame('error', $payload['status']);
        $this->assertSame('Nieprawidłowy zakres dat', $payload['message']);
    }

    private function createWorkOrder(
        string $title,
        WorkOrderStatus $status,
        WorkOrderPriority $priority,
        Equipment $equipment,
        User $creator,
        DateTime $createdAt,
        ?DateTime $plannedEndDate,
        ?DateTime $actualEndDate,
        ?DateTime $updatedAt
    ): WorkOrder {
        $workOrder = new WorkOrder();
        $workOrder->setTitle($title);
        $workOrder->setDescription('KPI test order');
        $workOrder->setStatus($status);
        $workOrder->setPriority($priority);
        $workOrder->setEquipment($equipment);
        $workOrder->setCreatedBy($creator);
        $workOrder->setPlannedEndDate($plannedEndDate);
        $workOrder->setActualEndDate($actualEndDate);
        $workOrder->setUpdatedAt($updatedAt);

        $this->setCreatedAt($workOrder, $createdAt);

        $em = $this->getEntityManager();
        $em->persist($workOrder);
        $em->flush();

        return $workOrder;
    }

    private function setCreatedAt(WorkOrder $workOrder, DateTime $createdAt): void
    {
        $reflection = new \ReflectionProperty($workOrder, 'createdAt');
        $reflection->setAccessible(true);
        $reflection->setValue($workOrder, $createdAt);
    }
}
