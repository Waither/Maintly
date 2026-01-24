<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\Notification;
use App\Entity\User;
use DateTimeImmutable;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(Notification::class)]
class NotificationTest extends TestCase {
    #[Test]
    public function newNotificationHasNullId(): void {
        $notification = new Notification();

        $this->assertNull($notification->getId());
    }

    #[Test]
    public function canSetAndGetType(): void {
        $notification = new Notification();
        $notification->setType('work_order_created');

        $this->assertSame('work_order_created', $notification->getType());
    }

    #[Test]
    public function canSetAndGetTitle(): void {
        $notification = new Notification();
        $notification->setTitle('Nowe zlecenie');

        $this->assertSame('Nowe zlecenie', $notification->getTitle());
    }

    #[Test]
    public function canSetAndGetMessage(): void {
        $notification = new Notification();
        $notification->setMessage('Utworzono nowe zlecenie WO-001');

        $this->assertSame('Utworzono nowe zlecenie WO-001', $notification->getMessage());
    }

    #[Test]
    public function newNotificationIsUnread(): void {
        $notification = new Notification();

        $this->assertFalse($notification->isRead());
    }

    #[Test]
    public function canMarkAsRead(): void {
        $notification = new Notification();

        $notification->setIsRead(true);

        $this->assertTrue($notification->isRead());
    }

    #[Test]
    public function canSetAndGetUser(): void {
        $notification = new Notification();
        $user = new User();
        $user->setEmail('user@example.com');

        $notification->setUser($user);

        $this->assertSame($user, $notification->getUser());
    }

    #[Test]
    public function newNotificationHasCreatedAtSet(): void {
        $before = new DateTimeImmutable();
        $notification = new Notification();
        $after = new DateTimeImmutable();

        $this->assertNotNull($notification->getCreatedAt());
        $this->assertGreaterThanOrEqual($before, $notification->getCreatedAt());
        $this->assertLessThanOrEqual($after, $notification->getCreatedAt());
    }

    #[Test]
    public function setTypeReturnsSelf(): void {
        $notification = new Notification();

        $result = $notification->setType('alert');

        $this->assertSame($notification, $result);
    }
}
