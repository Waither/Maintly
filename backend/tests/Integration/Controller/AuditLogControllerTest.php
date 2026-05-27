<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Entity\AuditLog;
use App\Entity\User;
use App\Tests\Integration\ApiWebTestCase;
use Symfony\Component\HttpFoundation\Response;

class AuditLogControllerTest extends ApiWebTestCase {
    public function testAuditLogEndpoints(): void {
        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $em = $this->getEntityManager();
        $user = $em->getRepository(User::class)->findOneBy(['email' => 'admin@maintly.com']);
        $this->assertNotNull($user);

        $log = new AuditLog();
        $log->setUser($user);
        $log->setAction('test.action');
        $log->setEntityType('test');
        $log->setEntityId(1);
        $log->setChanges(['field' => ['old' => 'a', 'new' => 'b']]);
        $log->setMetadata(['ip' => '127.0.0.1']);
        $log->setIpAddress('127.0.0.1');
        $log->setUserAgent('phpunit');
        $em->persist($log);
        $em->flush();

        $logId = $log->getId();
        $this->assertNotNull($logId);

        $client->request('GET', '/api/audit-logs', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('GET', '/api/audit-logs/stats?period=7days', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('GET', '/api/audit-logs/meta/actions', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('GET', '/api/audit-logs/meta/entities', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('GET', '/api/audit-logs/' . $logId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }
}
