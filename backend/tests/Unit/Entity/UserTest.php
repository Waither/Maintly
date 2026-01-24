<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\User;
use App\Entity\UserRole;
use DateTimeImmutable;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(User::class)]
class UserTest extends TestCase {
    #[Test]
    public function newUserHasNullId(): void {
        $user = new User();

        $this->assertNull($user->getId());
    }

    #[Test]
    public function canSetAndGetEmail(): void {
        $user = new User();
        $user->setEmail('test@example.com');

        $this->assertSame('test@example.com', $user->getEmail());
        $this->assertSame('test@example.com', $user->getUserIdentifier());
    }

    #[Test]
    public function canSetAndGetPassword(): void {
        $user = new User();
        $user->setPassword('hashed_password');

        $this->assertSame('hashed_password', $user->getPassword());
    }

    #[Test]
    public function canSetAndGetNames(): void {
        $user = new User();
        $user->setFirstName('Jan');
        $user->setLastName('Kowalski');

        $this->assertSame('Jan', $user->getFirstName());
        $this->assertSame('Kowalski', $user->getLastName());
    }

    #[Test]
    public function getFullNameCombinesFirstAndLastName(): void {
        $user = new User();
        $user->setFirstName('Jan');
        $user->setLastName('Kowalski');

        $this->assertSame('Jan Kowalski', $user->getFullName());
    }

    #[Test]
    public function getFullNameTrimsWhitespace(): void {
        $user = new User();
        $user->setFirstName('  Jan  ');
        $user->setLastName('  ');

        $this->assertSame('Jan', $user->getFullName());
    }

    #[Test]
    public function newUserIsActiveByDefault(): void {
        $user = new User();

        $this->assertTrue($user->isActive());
    }

    #[Test]
    public function canToggleActiveStatus(): void {
        $user = new User();

        $user->setIsActive(false);
        $this->assertFalse($user->isActive());

        $user->setIsActive(true);
        $this->assertTrue($user->isActive());
    }

    #[Test]
    public function getRolesReturnsBaseRoleForUserWithoutRole(): void {
        $user = new User();

        $roles = $user->getRoles();

        $this->assertContains('ROLE_USER', $roles);
        $this->assertCount(1, $roles);
    }

    #[Test]
    public function getRolesIncludesUserRoleName(): void {
        $user = new User();
        $role = new UserRole();
        $role->setName('admin');
        $user->setUserRole($role);

        $roles = $user->getRoles();

        $this->assertContains('ROLE_USER', $roles);
        $this->assertContains('ROLE_ADMIN', $roles);
    }

    #[Test]
    public function newUserHasCreatedAtSet(): void {
        $before = new DateTimeImmutable();
        $user = new User();
        $after = new DateTimeImmutable();

        $this->assertNotNull($user->getCreatedAt());
        $this->assertGreaterThanOrEqual($before, $user->getCreatedAt());
        $this->assertLessThanOrEqual($after, $user->getCreatedAt());
    }

    #[Test]
    public function canSetPhone(): void {
        $user = new User();
        $user->setPhone('+48123456789');

        $this->assertSame('+48123456789', $user->getPhone());
    }

    #[Test]
    public function phoneCanBeNull(): void {
        $user = new User();
        $user->setPhone(null);

        $this->assertNull($user->getPhone());
    }

    #[Test]
    public function canSetLastLoginAt(): void {
        $user = new User();
        $loginTime = new DateTimeImmutable('2025-01-24 12:00:00');
        $user->setLastLoginAt($loginTime);

        $this->assertSame($loginTime, $user->getLastLoginAt());
    }
}
