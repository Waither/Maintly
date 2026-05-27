<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\UserRole;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderActivity;
use App\Entity\WorkOrderAssignment;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use PHPUnit\Framework\TestCase;

class WorkOrderEntityTest extends TestCase {
    public function testGetterSetterRoundtrip(): void {
        $wo = $this->buildWorkOrder();

        $wo->setTitle('Fix pump');
        $this->assertSame('Fix pump', $wo->getTitle());

        $wo->setDescription('Needs repair');
        $this->assertSame('Needs repair', $wo->getDescription());

        $planned = new \DateTime('2025-03-01');
        $wo->setPlannedStartDate($planned);
        $this->assertSame($planned, $wo->getPlannedStartDate());
    }

    public function testActivitiesCollectionIsEmptyByDefault(): void {
        $wo = $this->buildWorkOrder();
        $this->assertCount(0, $wo->getActivities());
    }

    public function testAssignmentsCollectionIsEmptyByDefault(): void {
        $wo = $this->buildWorkOrder();
        $this->assertCount(0, $wo->getAssignments());
    }

    public function testStatusAndPriorityRelations(): void {
        $status = new WorkOrderStatus();
        $ref = new \ReflectionProperty($status, 'name');
        $ref->setAccessible(true);
        $ref->setValue($status, 'open');

        $priority = new WorkOrderPriority();
        $ref2 = new \ReflectionProperty($priority, 'name');
        $ref2->setAccessible(true);
        $ref2->setValue($priority, 'high');

        $wo = $this->buildWorkOrder();
        $wo->setStatus($status);
        $wo->setPriority($priority);

        $this->assertSame($status, $wo->getStatus());
        $this->assertSame($priority, $wo->getPriority());
    }

    public function testWorkOrderActivityEntity(): void {
        $user = $this->buildUser('technician');
        $wo = $this->buildWorkOrder();

        $activity = new WorkOrderActivity();
        $activity->setWorkOrder($wo);
        $activity->setPerformedBy($user);
        $activity->setCreatedBy($user);
        $activity->setDescription('Checked oil level');

        $this->assertSame($wo, $activity->getWorkOrder());
        $this->assertSame($user, $activity->getPerformedBy());
        $this->assertSame('Checked oil level', $activity->getDescription());
    }

    public function testWorkOrderAssignmentEntity(): void {
        $user = $this->buildUser('technician');
        $assigner = $this->buildUser('manager');
        $wo = $this->buildWorkOrder();

        $assignment = new WorkOrderAssignment();
        $assignment->setWorkOrder($wo);
        $assignment->setUser($user);
        $assignment->setAssignedBy($assigner);

        $this->assertSame($wo, $assignment->getWorkOrder());
        $this->assertSame($user, $assignment->getUser());
        $this->assertSame($assigner, $assignment->getAssignedBy());
    }

    private function buildWorkOrder(): WorkOrder {
        $status = new WorkOrderStatus();
        $priority = new WorkOrderPriority();
        $equipment = new Equipment();
        $user = $this->buildUser('admin');

        $wo = new WorkOrder();
        $wo->setTitle('WO');
        $wo->setDescription('desc');
        $wo->setStatus($status);
        $wo->setPriority($priority);
        $wo->setEquipment($equipment);
        $wo->setCreatedBy($user);

        return $wo;
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
