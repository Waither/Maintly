<?php

declare(strict_types=1);

namespace App\Tests\Unit\Application\Command\User;

use App\Application\Command\User\CreateUserCommand;
use App\Application\Command\User\CreateUserHandler;
use App\Entity\User;
use App\Entity\UserRole;
use App\Repository\UserRoleRepository;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;
use RuntimeException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class CreateUserHandlerTest extends TestCase {
    public function testCreatesUserWithRole(): void {
        $em = $this->createMock(EntityManagerInterface::class);
        $hasher = $this->createMock(UserPasswordHasherInterface::class);
        $roleRepo = $this->createMock(UserRoleRepository::class);

        $role = new UserRole();
        $role->setName('technician');

        $roleRepo->method('find')->with(3)->willReturn($role);
        $hasher->method('hashPassword')->willReturn('hashed_password');

        $em->expects($this->once())->method('persist')
            ->with($this->isInstanceOf(User::class));
        $em->expects($this->once())->method('flush');

        $handler = new CreateUserHandler($em, $hasher, $roleRepo);
        $command = new CreateUserCommand(
            email: 'newuser@test.com',
            password: 'Password123!',
            firstName: 'John',
            lastName: 'Doe',
            roleId: 3,
        );

        $result = $handler($command);

        $this->assertInstanceOf(User::class, $result);
        $this->assertSame('newuser@test.com', $result->getEmail());
        $this->assertSame('John', $result->getFirstName());
        $this->assertSame('Doe', $result->getLastName());
        $this->assertSame('hashed_password', $result->getPassword());
        $this->assertSame($role, $result->getUserRole());
    }

    public function testAssignsDefaultRoleWhenNoRoleId(): void {
        $em = $this->createMock(EntityManagerInterface::class);
        $hasher = $this->createMock(UserPasswordHasherInterface::class);
        $roleRepo = $this->createMock(UserRoleRepository::class);

        $defaultRole = new UserRole();
        $defaultRole->setName('reporter');

        $roleRepo->method('findOneBy')->with(['name' => 'reporter'])->willReturn($defaultRole);
        $hasher->method('hashPassword')->willReturn('hash');

        $em->expects($this->once())->method('persist');
        $em->expects($this->once())->method('flush');

        $handler = new CreateUserHandler($em, $hasher, $roleRepo);
        $result = $handler(new CreateUserCommand('x@test.com', 'pass', 'X', 'Y'));

        $this->assertSame($defaultRole, $result->getUserRole());
    }

    public function testThrowsWhenRoleNotFound(): void {
        $em = $this->createMock(EntityManagerInterface::class);
        $hasher = $this->createMock(UserPasswordHasherInterface::class);
        $roleRepo = $this->createMock(UserRoleRepository::class);

        $roleRepo->method('find')->willReturn(null);
        $hasher->method('hashPassword')->willReturn('hash');

        $this->expectException(InvalidArgumentException::class);

        $handler = new CreateUserHandler($em, $hasher, $roleRepo);
        $handler(new CreateUserCommand('x@test.com', 'pass', 'X', 'Y', roleId: 99));
    }

    public function testThrowsWhenDefaultRoleNotFound(): void {
        $em = $this->createMock(EntityManagerInterface::class);
        $hasher = $this->createMock(UserPasswordHasherInterface::class);
        $roleRepo = $this->createMock(UserRoleRepository::class);

        $roleRepo->method('findOneBy')->willReturn(null);
        $hasher->method('hashPassword')->willReturn('hash');

        $this->expectException(RuntimeException::class);

        $handler = new CreateUserHandler($em, $hasher, $roleRepo);
        $handler(new CreateUserCommand('x@test.com', 'pass', 'X', 'Y'));
    }
}
