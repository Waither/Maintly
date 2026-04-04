<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Entity\WorkOrder;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class RealtimeControllerTest extends WebTestCase {
    public function testPulseReturnsEventsAfterWorkOrderMutation(): void {
        $client = static::createClient();

        $token = $this->loginAndGetToken($client);
        $authHeaders = [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
            'CONTENT_TYPE' => 'application/json',
        ];

        // Initial pulse provides baseline server time.
        $client->request('GET', '/api/realtime/pulse', [], [], $authHeaders);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $pulseBaseline = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($pulseBaseline);
        $this->assertArrayHasKey('serverTime', $pulseBaseline);
        $this->assertArrayHasKey('signatures', $pulseBaseline);

        $since = $pulseBaseline['serverTime'];

        $this->touchAnyWorkOrder();

        $client->request('GET', '/api/realtime/pulse?since=' . urlencode((string) $since), [], [], $authHeaders);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $pulseAfterMutation = json_decode((string) $client->getResponse()->getContent(), true);
        $this->assertIsArray($pulseAfterMutation);
        $this->assertArrayHasKey('events', $pulseAfterMutation);
        $this->assertIsArray($pulseAfterMutation['events']);
        $this->assertNotEmpty($pulseAfterMutation['events']);

        $eventTypes = array_map(
            static fn(array $event): string => (string) ($event['type'] ?? ''),
            $pulseAfterMutation['events']
        );

        $this->assertContains('work_order.updated', $eventTypes);
        $this->assertContains('dashboard.updated', $eventTypes);
    }

    private function loginAndGetToken($client): string {
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

    private function touchAnyWorkOrder(): void {
        /** @var EntityManagerInterface $em */
        $em = static::getContainer()->get(EntityManagerInterface::class);

        $workOrder = $em->getRepository(WorkOrder::class)->findOneBy(['deletedAt' => null]);
        $this->assertNotNull($workOrder, 'Missing WorkOrder fixture data.');

        $workOrder->setUpdatedAt(new \DateTime('+1 minute'));
        $em->flush();
    }
}
