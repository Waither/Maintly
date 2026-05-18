<?php

declare(strict_types=1);

namespace App\Tests\Integration\Controller;

use App\Entity\Notification;
use App\Entity\User;
use App\Tests\Integration\ApiWebTestCase;
use Symfony\Component\HttpFoundation\Response;

class NotificationControllerTest extends ApiWebTestCase {
    public function testNotificationFlow(): void {
        $em = $this->getEntityManager();
        $user = $em->getRepository(User::class)->findOneBy(['email' => 'admin@maintly.com']);
        $this->assertNotNull($user);

        $notification = new Notification();
        $notification->setUser($user);
        $notification->setType('report_completed');
        $notification->setTitle('Report ready');
        $notification->setMessage('Report is ready for download');
        $notification->setData(['reportId' => 1]);
        $em->persist($notification);
        $em->flush();

        $notificationId = $notification->getId();
        $this->assertNotNull($notificationId);

        [$client, $headers] = $this->createClientWithAuth('admin@maintly.com', 'MaintlyAdmin!@#');

        $client->request('GET', '/api/notifications', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('GET', '/api/notifications/unread-count', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('GET', '/api/notifications/' . $notificationId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('PATCH', '/api/notifications/' . $notificationId . '/read', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('PATCH', '/api/notifications/mark-all-read', [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $client->request('DELETE', '/api/notifications/' . $notificationId, [], [], $headers);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }
}
