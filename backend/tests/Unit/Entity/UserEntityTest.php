<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\User;
use App\Entity\UserRole;
use PHPUnit\Framework\TestCase;

class UserEntityTest extends TestCase {
    public function testGetterSetterRoundtrip(): void {
        $role = new UserRole();
        $role->setName('technician');

        $user = new User();
        $user->setEmail('john@test.com');
        $user->setFirstName('John');
        $user->setLastName('Doe');
        $user->setPassword('hashed_password');
        $user->setPhone('+48123456789');
        $user->setUserRole($role);

        $this->assertSame('john@test.com', $user->getEmail());
        $this->assertSame('John', $user->getFirstName());
        $this->assertSame('Doe', $user->getLastName());
        $this->assertSame('hashed_password', $user->getPassword());
        $this->assertSame('+48123456789', $user->getPhone());
            $this->assertTrue($user->isActive());
        $this->assertSame($role, $user->getUserRole());
        $this->assertSame('john@test.com', $user->getUserIdentifier());
    }

    public function testGetRolesReturnsSymfonyRoles(): void {
        $role = new UserRole();
        $role->setName('admin');

        $user = new User();
        $user->setUserRole($role);

        $roles = $user->getRoles();
        $this->assertContains('ROLE_ADMIN', $roles);
        $this->assertContains('ROLE_USER', $roles);
    }

    public function testEraseCredentialsDoesNothing(): void {
        $user = new User();
        $user->setPassword('secret');
        $user->eraseCredentials();
        $this->assertSame('secret', $user->getPassword()); // no-op in Symfony
    }

    public function testUserRoleGetterSetter(): void {
        $role = new UserRole();
        $role->setName('manager');

        $this->assertSame('manager', $role->getName());
    }
}
