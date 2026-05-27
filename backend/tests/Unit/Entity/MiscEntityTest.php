<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\AuditLog;
use App\Entity\Report;
use App\Entity\Translation;
use App\Entity\User;
use App\Entity\UserRole;
use PHPUnit\Framework\TestCase;

class MiscEntityTest extends TestCase {
    public function testAuditLogGetterSetter(): void {
        $log = new AuditLog();
        $log->setAction('created');
        $log->setEntityType('Equipment');
        $log->setEntityId(5);
        $log->setIpAddress('127.0.0.1');
        $log->setUserAgent('TestAgent/1.0');
        $log->setChanges(['name' => ['old', 'new']]);
        $log->setMetadata(['source' => 'api']);

        $this->assertSame('created', $log->getAction());
        $this->assertSame('Equipment', $log->getEntityType());
        $this->assertSame(5, $log->getEntityId());
        $this->assertSame('127.0.0.1', $log->getIpAddress());
        $this->assertSame('TestAgent/1.0', $log->getUserAgent());
        $this->assertSame(['name' => ['old', 'new']], $log->getChanges());
        $this->assertSame(['source' => 'api'], $log->getMetadata());
    }

    public function testReportEntity(): void {
        $user = $this->buildUser();

        $report = new Report();
        $report->setReportType('equipment');
        $report->setFormat('csv');
        $report->setStatus('pending');
        $report->setUser($user);
        $report->setFilters(['status' => 'active']);

        $this->assertSame('equipment', $report->getReportType());
        $this->assertSame('csv', $report->getFormat());
        $this->assertSame('pending', $report->getStatus());
        $this->assertSame($user, $report->getUser());
        $this->assertSame(['status' => 'active'], $report->getFilters());
    }

    public function testReportStatusTransitions(): void {
        $report = new Report();
        $report->setStatus('pending');
        $this->assertSame('pending', $report->getStatus());

        $report->setStatus('processing');
        $this->assertSame('processing', $report->getStatus());

        $report->setStatus('completed');
        $this->assertSame('completed', $report->getStatus());

        $report->setStatus('failed');
        $this->assertSame('failed', $report->getStatus());
    }

    public function testTranslationEntity(): void {
        $translation = new Translation();
        $translation->setLocale('pl');
        $translation->setMessageKey('welcome.message');
        $translation->setText('Witaj w systemie');

        $this->assertSame('pl', $translation->getLocale());
        $this->assertSame('welcome.message', $translation->getMessageKey());
        $this->assertSame('Witaj w systemie', $translation->getText());
    }

    private function buildUser(): User {
        $role = new UserRole();
        $role->setName('admin');

        $user = new User();
        $user->setEmail('admin@test.com');
        $user->setFirstName('Admin');
        $user->setLastName('User');
        $user->setPassword('hash');
        $user->setUserRole($role);

        return $user;
    }
}
