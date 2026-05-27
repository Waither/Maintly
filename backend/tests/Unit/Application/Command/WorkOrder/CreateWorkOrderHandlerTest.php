<?php

declare(strict_types=1);

namespace App\Tests\Unit\Application\Command\WorkOrder;

use App\Application\Command\WorkOrder\CreateWorkOrderCommand;
use App\Application\Command\WorkOrder\CreateWorkOrderHandler;
use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class CreateWorkOrderHandlerTest extends TestCase {
    public function testCreatesWorkOrderWithBasicFields(): void {
        $em = $this->createMock(EntityManagerInterface::class);

        $status = new WorkOrderStatus();
        $priority = new WorkOrderPriority();
        $equipment = new Equipment();
        $createdBy = new User();

        $em->method('getReference')->willReturnMap([
            [WorkOrderStatus::class, 1, $status],
            [WorkOrderPriority::class, 2, $priority],
            [Equipment::class, 3, $equipment],
            [User::class, 4, $createdBy],
        ]);

        $em->expects($this->atLeastOnce())->method('persist');
        $em->expects($this->atLeastOnce())->method('flush');

        $handler = new CreateWorkOrderHandler($em);
        $command = new CreateWorkOrderCommand(
            title: 'Fix leak',
            description: 'Pipe is leaking',
            statusId: 1,
            priorityId: 2,
            equipmentId: 3,
            createdBy: 4,
        );

        $result = $handler($command);

        $this->assertInstanceOf(WorkOrder::class, $result);
        $this->assertSame('Fix leak', $result->getTitle());
        $this->assertSame('Pipe is leaking', $result->getDescription());
        $this->assertSame($status, $result->getStatus());
        $this->assertSame($priority, $result->getPriority());
        $this->assertSame($equipment, $result->getEquipment());
        $this->assertSame($createdBy, $result->getCreatedBy());
    }

    public function testSetsPlannedDates(): void {
        $em = $this->createMock(EntityManagerInterface::class);

        $em->method('getReference')->willReturnMap([
            [WorkOrderStatus::class, 1, new WorkOrderStatus()],
            [WorkOrderPriority::class, 1, new WorkOrderPriority()],
            [Equipment::class, 1, new Equipment()],
            [User::class, 1, new User()],
        ]);

        $start = new \DateTime('2025-01-01');
        $end = new \DateTime('2025-01-10');

        $command = new CreateWorkOrderCommand(
            title: 'WO',
            description: '',
            statusId: 1,
            priorityId: 1,
            equipmentId: 1,
            createdBy: 1,
            plannedStartDate: $start,
            plannedEndDate: $end,
        );

        $handler = new CreateWorkOrderHandler($em);
        $result = $handler($command);

        $this->assertSame($start, $result->getPlannedStartDate());
        $this->assertSame($end, $result->getPlannedEndDate());
    }
}
