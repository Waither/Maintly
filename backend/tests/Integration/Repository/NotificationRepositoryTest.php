<?php

declare(strict_types=1);

namespace App\Tests\Integration\Repository;

use App\Entity\Notification;
use App\Repository\NotificationRepository;
use App\Tests\Integration\ApiWebTestCase;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class NotificationRepositoryTest extends KernelTestCase {
    private \Doctrine\ORM\EntityManagerInterface $em;
    private NotificationRepository $repo;

    protected function setUp(): void {
        self::bootKernel();
        $this->em = static::getContainer()->get('doctrine')->getManager();
        $this->repo = $this->em->getRepository(Notification::class);
        $this->em->getConnection()->beginTransaction();
    }

    protected function tearDown(): void {
        $this->em->getConnection()->rollBack();
        parent::tearDown();
    }

    private function getUser(string $email): \App\Entity\User {
        return $this->em->getRepository(\App\Entity\User::class)->findOneBy(['email' => $email]);
    }

    public function testFindByUserReturnsUserNotifications(): void {
        $user = $this->getUser('tech@maintly.com');
        $this->assertNotNull($user);

        $notification = new Notification();
        $notification->setUser($user);
        $notification->setTitle('Test Notification');
        $notification->setMessage('Hello Tech');
        $notification->setType('info');
        $this->em->persist($notification);
        $this->em->flush();

        $results = $this->repo->findByUser($user);

        $this->assertNotEmpty($results);
        foreach ($results as $n) {
            $this->assertSame($user->getId(), $n->getUser()->getId());
        }
    }

    public function testCountByUserReturnsCorrectCount(): void {
        $user = $this->getUser('tech@maintly.com');
        $this->assertNotNull($user);

        $before = $this->repo->countByUser($user);

        $n1 = new Notification();
        $n1->setUser($user);
        $n1->setTitle('N1');
        $n1->setMessage('msg');
        $n1->setType('info');
        $this->em->persist($n1);

        $n2 = new Notification();
        $n2->setUser($user);
        $n2->setTitle('N2');
        $n2->setMessage('msg');
        $n2->setType('warning');
        $this->em->persist($n2);

        $this->em->flush();

        $this->assertSame($before + 2, $this->repo->countByUser($user));
    }

    public function testCountUnreadByUser(): void {
        $user = $this->getUser('tech@maintly.com');

        $n = new Notification();
        $n->setUser($user);
        $n->setTitle('Unread');
        $n->setMessage('msg');
        $n->setType('info');
        $n->setIsRead(false);
        $this->em->persist($n);
        $this->em->flush();

        $unread = $this->repo->countUnreadByUser($user);
        $this->assertGreaterThanOrEqual(1, $unread);
    }

    public function testFindUnreadByUser(): void {
        $user = $this->getUser('tech@maintly.com');

        $n = new Notification();
        $n->setUser($user);
        $n->setTitle('Unread one');
        $n->setMessage('msg');
        $n->setType('info');
        $n->setIsRead(false);
        $this->em->persist($n);
        $this->em->flush();

        $results = $this->repo->findUnreadByUser($user);

        foreach ($results as $result) {
            $this->assertFalse($result->isRead());
        }
    }

    public function testMarkAllAsReadForUser(): void {
        $user = $this->getUser('tech@maintly.com');

        $n = new Notification();
        $n->setUser($user);
        $n->setTitle('Will be read');
        $n->setMessage('msg');
        $n->setType('info');
        $n->setIsRead(false);
        $this->em->persist($n);
        $this->em->flush();

        $this->repo->markAllAsReadForUser($user);

        $this->em->clear();

        $updated = $this->repo->findUnreadByUser($user);
        $this->assertEmpty($updated);
    }
}
