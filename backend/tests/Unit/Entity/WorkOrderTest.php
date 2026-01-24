<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use DateTime;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(WorkOrder::class)]
class WorkOrderTest extends TestCase {
    private function createWorkOrder(): WorkOrder {
        $status = new WorkOrderStatus();
        $priority = new WorkOrderPriority();
        $equipment = new Equipment();
        $user = new User();

        $workOrder = new WorkOrder();
        $workOrder->setTitle('Test Work Order');
        $workOrder->setDescription('Test description');
        $workOrder->setStatus($status);
        $workOrder->setPriority($priority);
        $workOrder->setEquipment($equipment);
        $workOrder->setCreatedBy($user);

        return $workOrder;
    }

    #[Test]
    public function newWorkOrderHasNullId(): void {
        $workOrder = $this->createWorkOrder();

        $this->assertNull($workOrder->getId());
    }

    #[Test]
    public function canSetAndGetTitle(): void {
        $workOrder = $this->createWorkOrder();
        $workOrder->setTitle('Przegląd maszyny');

        $this->assertSame('Przegląd maszyny', $workOrder->getTitle());
    }

    #[Test]
    public function canSetAndGetDescription(): void {
        $workOrder = $this->createWorkOrder();
        $workOrder->setDescription('Szczegółowy opis zlecenia');

        $this->assertSame('Szczegółowy opis zlecenia', $workOrder->getDescription());
    }

    #[Test]
    public function canSetAndGetStatus(): void {
        $workOrder = $this->createWorkOrder();
        $status = new WorkOrderStatus();

        $workOrder->setStatus($status);

        $this->assertSame($status, $workOrder->getStatus());
    }

    #[Test]
    public function canSetAndGetPriority(): void {
        $workOrder = $this->createWorkOrder();
        $priority = new WorkOrderPriority();

        $workOrder->setPriority($priority);

        $this->assertSame($priority, $workOrder->getPriority());
    }

    #[Test]
    public function canSetAndGetEquipment(): void {
        $workOrder = $this->createWorkOrder();
        $equipment = new Equipment();
        $equipment->setName('CNC');

        $workOrder->setEquipment($equipment);

        $this->assertSame($equipment, $workOrder->getEquipment());
    }

    #[Test]
    public function canSetPlannedDates(): void {
        $workOrder = $this->createWorkOrder();
        $startDate = new DateTime('2025-01-25 08:00:00');
        $endDate = new DateTime('2025-01-25 16:00:00');

        $workOrder->setPlannedStartDate($startDate);
        $workOrder->setPlannedEndDate($endDate);

        $this->assertSame($startDate, $workOrder->getPlannedStartDate());
        $this->assertSame($endDate, $workOrder->getPlannedEndDate());
    }

    #[Test]
    public function canSetActualDates(): void {
        $workOrder = $this->createWorkOrder();
        $startDate = new DateTime('2025-01-25 09:00:00');
        $endDate = new DateTime('2025-01-25 17:00:00');

        $workOrder->setActualStartDate($startDate);
        $workOrder->setActualEndDate($endDate);

        $this->assertSame($startDate, $workOrder->getActualStartDate());
        $this->assertSame($endDate, $workOrder->getActualEndDate());
    }

    #[Test]
    public function newWorkOrderHasEmptyAssignmentsCollection(): void {
        $workOrder = $this->createWorkOrder();

        $this->assertCount(0, $workOrder->getAssignments());
    }

    #[Test]
    public function newWorkOrderHasEmptyTagsCollection(): void {
        $workOrder = $this->createWorkOrder();

        $this->assertCount(0, $workOrder->getWorkOrderTags());
    }

    #[Test]
    public function newWorkOrderHasEmptyActivitiesCollection(): void {
        $workOrder = $this->createWorkOrder();

        $this->assertCount(0, $workOrder->getActivities());
    }

    #[Test]
    public function canSetCreatedBy(): void {
        $workOrder = $this->createWorkOrder();
        $user = new User();
        $user->setEmail('creator@example.com');

        $workOrder->setCreatedBy($user);

        $this->assertSame($user, $workOrder->getCreatedBy());
    }

    #[Test]
    public function canSetUpdatedBy(): void {
        $workOrder = $this->createWorkOrder();
        $user = new User();
        $user->setEmail('updater@example.com');

        $workOrder->setUpdatedBy($user);

        $this->assertSame($user, $workOrder->getUpdatedBy());
    }

    #[Test]
    public function setTitleReturnsSelf(): void {
        $workOrder = $this->createWorkOrder();

        $result = $workOrder->setTitle('New Title');

        $this->assertSame($workOrder, $result);
    }
}
