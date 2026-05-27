<?php

declare(strict_types=1);

namespace App\Tests\Unit\Application\Command\WorkOrder;

use App\Application\Command\WorkOrder\AddWorkOrderActivityCommand;
use App\Application\Command\WorkOrder\AddWorkOrderActivityHandler;
use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderActivity;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AddWorkOrderActivityHandlerTest extends TestCase {
    private function buildWorkOrder(): WorkOrder {
        $status = new WorkOrderStatus();
        $priority = new WorkOrderPriority();
        $equipment = new Equipment();
        $user = new User();

        $wo = new WorkOrder();
        $wo->setTitle('Test WO');
        $wo->setDescription('desc');
        $wo->setStatus($status);
        $wo->setPriority($priority);
        $wo->setEquipment($equipment);
        $wo->setCreatedBy($user);

        return $wo;
    }

    public function testCreatesActivity(): void {
        $em = $this->createMock(EntityManagerInterface::class);
        $workOrderRepo = $this->createMock(EntityRepository::class);
        $workOrder = $this->buildWorkOrder();
        $user = new User();

        $workOrderRepo->method('find')->with(1)->willReturn($workOrder);
        $em->method('getRepository')->with(WorkOrder::class)->willReturn($workOrderRepo);
        $em->method('getReference')->with($this->anything(), $this->anything())->willReturn($user);
        $em->expects($this->once())->method('persist')
            ->with($this->isInstanceOf(WorkOrderActivity::class));
        $em->expects($this->once())->method('flush');

        $handler = new AddWorkOrderActivityHandler($em);
        $command = new AddWorkOrderActivityCommand(
            workOrderId: 1,
            description: 'Checked pressure',
            performedBy: 5,
            createdBy: 5,
            timeSpent: 30,
        );

        $result = $handler($command);

        $this->assertInstanceOf(WorkOrderActivity::class, $result);
        $this->assertSame('Checked pressure', $result->getDescription());
        $this->assertSame(30, $result->getTimeSpent());
    }

    public function testThrowsNotFoundWhenWorkOrderMissing(): void {
        $em = $this->createMock(EntityManagerInterface::class);
        $workOrderRepo = $this->createMock(EntityRepository::class);

        $workOrderRepo->method('find')->willReturn(null);
        $em->method('getRepository')->with(WorkOrder::class)->willReturn($workOrderRepo);

        $this->expectException(NotFoundHttpException::class);

        $handler = new AddWorkOrderActivityHandler($em);
        $handler(new AddWorkOrderActivityCommand(
            workOrderId: 999,
            description: 'Test',
            performedBy: 1,
            createdBy: 1,
        ));
    }
}
