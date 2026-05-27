<?php

declare(strict_types=1);

namespace App\Tests\Unit\Application\Query\Equipment;

use App\Application\Query\Equipment\GetAllEquipmentHandler;
use App\Application\Query\Equipment\GetAllEquipmentQuery;
use App\Application\Query\Equipment\GetEquipmentByIdHandler;
use App\Application\Query\Equipment\GetEquipmentByIdQuery;
use App\Entity\Equipment;
use App\Repository\EquipmentRepository;
use PHPUnit\Framework\TestCase;

class GetEquipmentHandlerTest extends TestCase {
    public function testGetAllEquipmentWithoutDeleted(): void {
        $repo = $this->createMock(EquipmentRepository::class);

        $e1 = new Equipment();
        $e1->setName('Pump');
        $e1->setCostCenter(1);

        $repo->expects($this->once())
            ->method('findBy')
            ->with(['deletedAt' => null])
            ->willReturn([$e1]);

        $handler = new GetAllEquipmentHandler($repo);
        $result = $handler(new GetAllEquipmentQuery(includeDeleted: false));

        $this->assertCount(1, $result);
        $this->assertSame($e1, $result[0]);
    }

    public function testGetAllEquipmentIncludeDeleted(): void {
        $repo = $this->createMock(EquipmentRepository::class);

        $e1 = new Equipment();
        $e1->setName('Pump');
        $e1->setCostCenter(1);
        $e2 = new Equipment();
        $e2->setName('Motor');
        $e2->setCostCenter(2);

        $repo->expects($this->once())
            ->method('findAll')
            ->willReturn([$e1, $e2]);

        $handler = new GetAllEquipmentHandler($repo);
        $result = $handler(new GetAllEquipmentQuery(includeDeleted: true));

        $this->assertCount(2, $result);
    }

    public function testGetEquipmentById(): void {
        $repo = $this->createMock(EquipmentRepository::class);

        $equipment = new Equipment();
        $equipment->setName('Motor');
        $equipment->setCostCenter(1);

        $repo->expects($this->once())->method('find')->with(42)->willReturn($equipment);

        $handler = new GetEquipmentByIdHandler($repo);
        $result = $handler(new GetEquipmentByIdQuery(42));

        $this->assertSame($equipment, $result);
    }

    public function testGetEquipmentByIdReturnsNullWhenNotFound(): void {
        $repo = $this->createMock(EquipmentRepository::class);
        $repo->method('find')->willReturn(null);

        $handler = new GetEquipmentByIdHandler($repo);
        $result = $handler(new GetEquipmentByIdQuery(999));

        $this->assertNull($result);
    }
}
