<?php

declare(strict_types=1);

namespace App\Tests\Unit\Security;

use App\Entity\User;
use App\Entity\UserRole;
use App\Entity\WorkOrderPriority;
use App\Security\Voter\WorkOrderPriorityVoter;
use App\Security\Voter\WorkOrderStatusVoter;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class WorkOrderStatusPriorityVoterTest extends TestCase {
    /** @return array<string, array{string, bool}> */
    public static function statusManageProvider(): array {
        return [
            'admin can create status' => ['admin', true],
            'manager cannot create status' => ['manager', false],
            'technician cannot create status' => ['technician', false],
            'reporter cannot create status' => ['reporter', false],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('statusManageProvider')]
    public function testStatusManagement(string $roleName, bool $expected): void {
        $voter = new WorkOrderStatusVoter();
        $user = $this->buildUser($roleName);
        $token = new UsernamePasswordToken($user, 'main', $user->getRoles());

        foreach (['WORKORDER_STATUS_CREATE', 'WORKORDER_STATUS_EDIT', 'WORKORDER_STATUS_DELETE'] as $attr) {
            $result = $voter->vote($token, null, [$attr]);
            $this->assertSame($expected ? 1 : -1, $result, "attr=$attr role=$roleName");
        }
    }

    public function testAllRolesCanViewStatus(): void {
        $voter = new WorkOrderStatusVoter();
        foreach (['admin', 'manager', 'technician', 'provider', 'reporter'] as $roleName) {
            $user = $this->buildUser($roleName);
            $token = new UsernamePasswordToken($user, 'main', $user->getRoles());
            $result = $voter->vote($token, null, ['WORKORDER_STATUS_VIEW']);
            $this->assertSame(1, $result, "role=$roleName should be able to view statuses");
        }
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('statusManageProvider')]
    public function testPriorityManagement(string $roleName, bool $expected): void {
        $voter = new WorkOrderPriorityVoter();
        $user = $this->buildUser($roleName);
        $token = new UsernamePasswordToken($user, 'main', $user->getRoles());

        foreach (['WORKORDER_PRIORITY_CREATE', 'WORKORDER_PRIORITY_EDIT', 'WORKORDER_PRIORITY_DELETE'] as $attr) {
            $result = $voter->vote($token, null, [$attr]);
            $this->assertSame($expected ? 1 : -1, $result, "attr=$attr role=$roleName");
        }
    }

    public function testAllRolesCanViewPriority(): void {
        $voter = new WorkOrderPriorityVoter();
        foreach (['admin', 'manager', 'technician', 'provider', 'reporter'] as $roleName) {
            $user = $this->buildUser($roleName);
            $token = new UsernamePasswordToken($user, 'main', $user->getRoles());
            $result = $voter->vote($token, null, ['WORKORDER_PRIORITY_VIEW']);
            $this->assertSame(1, $result, "role=$roleName should view priorities");
        }
    }

    public function testSupportsCheckForPriority(): void {
        $voter = new WorkOrderPriorityVoter();
        $user = $this->buildUser('admin');
        $token = new UsernamePasswordToken($user, 'main', $user->getRoles());

        $priority = new WorkOrderPriority();

        $result = $voter->vote($token, $priority, ['WORKORDER_PRIORITY_CREATE']);
        $this->assertSame(1, $result);
    }

    private function buildUser(string $roleName): User {
        $role = new UserRole();
        $role->setName($roleName);

        $user = new User();
        $user->setEmail("$roleName@test.com");
        $user->setFirstName('Test');
        $user->setLastName('User');
        $user->setPassword('hash');
        $user->setUserRole($role);

        return $user;
    }
}
