<?php

declare(strict_types=1);

namespace App\Tests\Unit\Security;

use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\UserRole;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use App\Security\Voter\WorkOrderVoter;
use DateTime;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class WorkOrderVoterTest extends TestCase {
    private WorkOrderVoter $voter;

    protected function setUp(): void {
        $this->voter = new WorkOrderVoter();
    }

    public function testAdminCanDoEverything(): void {
        $admin = $this->buildUser('admin');
        $token = new UsernamePasswordToken($admin, 'main', $admin->getRoles());
        $wo = $this->buildWorkOrder($admin);

        foreach (['WORKORDER_VIEW', 'WORKORDER_CREATE', 'WORKORDER_EDIT', 'WORKORDER_DELETE'] as $attr) {
            $this->assertSame(1, $this->voter->vote($token, $wo, [$attr]), "admin attr=$attr");
        }
    }

    public function testReporterCanViewAndCreateButNotEditDelete(): void {
        $reporter = $this->buildUser('reporter');
        $token = new UsernamePasswordToken($reporter, 'main', $reporter->getRoles());
        $wo = $this->buildWorkOrder($this->buildUser('admin'));

        $this->assertSame(1, $this->voter->vote($token, $wo, ['WORKORDER_VIEW']));
        $this->assertSame(1, $this->voter->vote($token, null, ['WORKORDER_CREATE']));
        $this->assertSame(-1, $this->voter->vote($token, $wo, ['WORKORDER_EDIT']));
        $this->assertSame(-1, $this->voter->vote($token, $wo, ['WORKORDER_DELETE']));
    }

    public function testTechnicianCanViewCreateEdit(): void {
        $tech = $this->buildUser('technician');
        $token = new UsernamePasswordToken($tech, 'main', $tech->getRoles());
        $wo = $this->buildWorkOrder($this->buildUser('admin'));

        $this->assertSame(1, $this->voter->vote($token, $wo, ['WORKORDER_VIEW']));
        $this->assertSame(1, $this->voter->vote($token, null, ['WORKORDER_CREATE']));
        $this->assertSame(1, $this->voter->vote($token, $wo, ['WORKORDER_EDIT']));
        $this->assertSame(-1, $this->voter->vote($token, $wo, ['WORKORDER_DELETE']));
    }

    public function testProviderCanOnlyViewOwnWorkOrders(): void {
        $provider = $this->buildUser('provider');
        $token = new UsernamePasswordToken($provider, 'main', $provider->getRoles());

        // Own work order — view and edit
        $ownWo = $this->buildWorkOrder($provider);
        $this->setUserId($provider, 99);
        $this->assertSame(1, $this->voter->vote($token, $ownWo, ['WORKORDER_VIEW']));
        $this->assertSame(1, $this->voter->vote($token, $ownWo, ['WORKORDER_EDIT']));

        // Others' work order — cannot view or edit
        $otherUser = $this->buildUser('admin');
        $this->setUserId($otherUser, 1);
        $otherWo = $this->buildWorkOrder($otherUser);
        $this->assertSame(-1, $this->voter->vote($token, $otherWo, ['WORKORDER_VIEW']));
        $this->assertSame(-1, $this->voter->vote($token, $otherWo, ['WORKORDER_EDIT']));

        // Provider list endpoint (null subject)
        $this->assertSame(1, $this->voter->vote($token, null, ['WORKORDER_VIEW']));
    }

    public function testManagerCannotDeleteWithNullSubject(): void {
        $manager = $this->buildUser('manager');
        $token = new UsernamePasswordToken($manager, 'main', $manager->getRoles());

        $this->assertSame(-1, $this->voter->vote($token, null, ['WORKORDER_DELETE']));
    }

    public function testUnauthenticatedUserDenied(): void {
        $token = $this->createMock(\Symfony\Component\Security\Core\Authentication\Token\TokenInterface::class);
        $token->method('getUser')->willReturn(null);

        $result = $this->voter->vote($token, null, ['WORKORDER_VIEW']);
            $this->assertSame(-1, $result); // DENIED (attribute supported, but no user)
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

    private function buildWorkOrder(User $createdBy): WorkOrder {
        $status = new WorkOrderStatus();
        $ref = new \ReflectionProperty($status, 'name');
        $ref->setAccessible(true);
        $ref->setValue($status, 'open');

        $priority = new WorkOrderPriority();
        $ref2 = new \ReflectionProperty($priority, 'name');
        $ref2->setAccessible(true);
        $ref2->setValue($priority, 'low');

        $equipment = new Equipment();

        $wo = new WorkOrder();
        $wo->setTitle('Test WO');
        $wo->setDescription('desc');
        $wo->setStatus($status);
        $wo->setPriority($priority);
        $wo->setEquipment($equipment);
        $wo->setCreatedBy($createdBy);

        return $wo;
    }

    private function setUserId(User $user, int $id): void {
        $ref = new \ReflectionProperty($user, 'id');
        $ref->setAccessible(true);
        $ref->setValue($user, $id);
    }
}
