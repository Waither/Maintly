<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\User;
use App\Entity\UserRole;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(UserRole::class)]
class UserRoleTest extends TestCase {
    #[Test]
    public function newRoleHasNullId(): void {
        $role = new UserRole();

        $this->assertNull($role->getId());
    }

    #[Test]
    public function canSetAndGetName(): void {
        $role = new UserRole();
        $role->setName('admin');

        $this->assertSame('admin', $role->getName());
    }

    #[Test]
    public function newRoleHasEmptyUsersCollection(): void {
        $role = new UserRole();

        $this->assertCount(0, $role->getUsers());
    }

    #[Test]
    public function canAddUser(): void {
        $role = new UserRole();
        $user = new User();

        $role->addUser($user);

        $this->assertCount(1, $role->getUsers());
        $this->assertTrue($role->getUsers()->contains($user));
        $this->assertSame($role, $user->getUserRole());
    }

    #[Test]
    public function addingUserTwiceDoesNotDuplicate(): void {
        $role = new UserRole();
        $user = new User();

        $role->addUser($user);
        $role->addUser($user);

        $this->assertCount(1, $role->getUsers());
    }

    #[Test]
    public function canRemoveUser(): void {
        $role = new UserRole();
        $user = new User();

        $role->addUser($user);
        $role->removeUser($user);

        $this->assertCount(0, $role->getUsers());
        $this->assertNull($user->getUserRole());
    }

    #[Test]
    public function setNameReturnsSelf(): void {
        $role = new UserRole();

        $result = $role->setName('manager');

        $this->assertSame($role, $result);
    }
}
