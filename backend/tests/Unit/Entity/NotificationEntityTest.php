<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\Notification;
use App\Entity\User;
use App\Entity\UserRole;
use PHPUnit\Framework\TestCase;

class NotificationEntityTest extends TestCase {
    public function testGetterSetterRoundtrip(): void {
        $user = $this->buildUser();

        $notification = new Notification();
        $notification->setUser($user);
        $notification->setTitle('Test title');
        $notification->setMessage('Test message');
        $notification->setType('info');
        $notification->setIsRead(false);

        $this->assertSame($user, $notification->getUser());
        $this->assertSame('Test title', $notification->getTitle());
        $this->assertSame('Test message', $notification->getMessage());
        $this->assertSame('info', $notification->getType());
        $this->assertFalse($notification->isRead());
    }

    public function testDefaultIsReadFalse(): void {
        $notification = new Notification();
        $this->assertFalse($notification->isRead());
    }

    public function testMarkAsRead(): void {
        $notification = new Notification();
        $notification->setIsRead(false);
        $notification->setIsRead(true);
        $this->assertTrue($notification->isRead());
    }

    public function testDataFieldCanBeSet(): void {
        $notification = new Notification();
        $data = ['workOrderId' => 42, 'link' => '/workorders/42'];
        $notification->setData($data);
        $this->assertSame($data, $notification->getData());
    }

    private function buildUser(): User {
        $role = new UserRole();
        $role->setName('technician');

        $user = new User();
        $user->setEmail('tech@test.com');
        $user->setFirstName('Tech');
        $user->setLastName('User');
        $user->setPassword('hash');
        $user->setUserRole($role);

        return $user;
    }
}
