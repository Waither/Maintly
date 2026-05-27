<?php

declare(strict_types=1);

namespace App\Tests\Unit\Application\Command\Equipment;

use App\Application\Command\Equipment\CreateEquipmentCommand;
use App\Application\Command\Equipment\CreateEquipmentHandler;
use App\Entity\Equipment;
use App\Entity\User;
use App\Repository\EquipmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class CreateEquipmentHandlerTest extends TestCase {
    public function testCreatesEquipmentWithRequiredFields(): void {
        $em = $this->createMock(EntityManagerInterface::class);
        $repo = $this->createMock(EquipmentRepository::class);

        $em->expects($this->once())->method('persist')
            ->with($this->isInstanceOf(Equipment::class));
        $em->expects($this->once())->method('flush');

        $handler = new CreateEquipmentHandler($em, $repo);
        $command = new CreateEquipmentCommand(name: 'Pump A', costCenter: 100);

        $result = $handler($command);

        $this->assertInstanceOf(Equipment::class, $result);
        $this->assertSame('Pump A', $result->getName());
        $this->assertSame(100, $result->getCostCenter());
    }

    public function testSetsParentEquipmentWhenProvided(): void {
        $em = $this->createMock(EntityManagerInterface::class);
        $repo = $this->createMock(EquipmentRepository::class);

        $parent = new Equipment();
        $parent->setName('Parent');
        $parent->setCostCenter(1);

        $repo->method('find')->with(5)->willReturn($parent);

        $em->expects($this->once())->method('persist');
        $em->expects($this->once())->method('flush');

        $handler = new CreateEquipmentHandler($em, $repo);
        $command = new CreateEquipmentCommand(name: 'Child', costCenter: 1, parentEquipmentId: 5);

        $result = $handler($command);

        $this->assertSame($parent, $result->getParentEquipment());
    }

    public function testSetsCreatedByWhenProvided(): void {
        $em = $this->createMock(EntityManagerInterface::class);
        $repo = $this->createMock(EquipmentRepository::class);

        $user = new User();
        $em->method('getReference')->with(User::class, 1)->willReturn($user);
        $em->expects($this->once())->method('persist');
        $em->expects($this->once())->method('flush');

        $handler = new CreateEquipmentHandler($em, $repo);
        $command = new CreateEquipmentCommand(name: 'Motor', costCenter: 1, createdBy: 1);

        $result = $handler($command);

        $this->assertSame($user, $result->getCreatedBy());
    }
}
