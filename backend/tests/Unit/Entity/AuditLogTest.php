<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\AuditLog;
use App\Entity\User;
use DateTimeImmutable;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(AuditLog::class)]
class AuditLogTest extends TestCase {
    #[Test]
    public function newAuditLogHasNullId(): void {
        $log = new AuditLog();

        $this->assertNull($log->getId());
    }

    #[Test]
    public function canSetAndGetAction(): void {
        $log = new AuditLog();
        $log->setAction('create');

        $this->assertSame('create', $log->getAction());
    }

    #[Test]
    public function canSetAndGetEntityType(): void {
        $log = new AuditLog();
        $log->setEntityType('Equipment');

        $this->assertSame('Equipment', $log->getEntityType());
    }

    #[Test]
    public function canSetAndGetEntityId(): void {
        $log = new AuditLog();
        $log->setEntityId(123);

        $this->assertSame(123, $log->getEntityId());
    }

    #[Test]
    public function canSetAndGetChanges(): void {
        $log = new AuditLog();
        $changes = [
            'name' => ['from' => 'Old Name', 'to' => 'New Name'],
            'status' => ['from' => 1, 'to' => 2],
        ];

        $log->setChanges($changes);

        $this->assertSame($changes, $log->getChanges());
    }

    #[Test]
    public function changesCanBeNull(): void {
        $log = new AuditLog();
        $log->setChanges(null);

        $this->assertNull($log->getChanges());
    }

    #[Test]
    public function canSetAndGetMetadata(): void {
        $log = new AuditLog();
        $metadata = [
            'browser' => 'Chrome',
            'platform' => 'Windows',
        ];

        $log->setMetadata($metadata);

        $this->assertSame($metadata, $log->getMetadata());
    }

    #[Test]
    public function canSetAndGetIpAddress(): void {
        $log = new AuditLog();
        $log->setIpAddress('192.168.1.100');

        $this->assertSame('192.168.1.100', $log->getIpAddress());
    }

    #[Test]
    public function canSetAndGetUserAgent(): void {
        $log = new AuditLog();
        $userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';

        $log->setUserAgent($userAgent);

        $this->assertSame($userAgent, $log->getUserAgent());
    }

    #[Test]
    public function canSetAndGetUser(): void {
        $log = new AuditLog();
        $user = new User();
        $user->setEmail('admin@example.com');

        $log->setUser($user);

        $this->assertSame($user, $log->getUser());
    }

    #[Test]
    public function userCanBeNull(): void {
        $log = new AuditLog();
        $log->setUser(null);

        $this->assertNull($log->getUser());
    }

    #[Test]
    public function newAuditLogHasCreatedAtSet(): void {
        $before = new DateTimeImmutable();
        $log = new AuditLog();
        $after = new DateTimeImmutable();

        $this->assertNotNull($log->getCreatedAt());
        $this->assertGreaterThanOrEqual($before, $log->getCreatedAt());
        $this->assertLessThanOrEqual($after, $log->getCreatedAt());
    }

    #[Test]
    public function setActionReturnsSelf(): void {
        $log = new AuditLog();

        $result = $log->setAction('update');

        $this->assertSame($log, $result);
    }
}
