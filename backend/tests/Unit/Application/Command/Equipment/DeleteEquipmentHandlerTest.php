<?php

declare(strict_types=1);

namespace App\Tests\Unit\Application\Command\Equipment;

use App\Application\Command\Equipment\DeleteEquipmentCommand;
use App\Application\Command\Equipment\DeleteEquipmentHandler;
use App\Entity\Equipment;
use App\Repository\EquipmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use RuntimeException;

class DeleteEquipmentHandlerTest extends TestCase {
    public function testSoftDeletesEquipment(): void {
        $em = $this->createMock(EntityManagerInterface::class);
        $repo = $this->createMock(EquipmentRepository::class);

        $equipment = new Equipment();
        $equipment->setName('Motor');
        $equipment->setCostCenter(1);
        $repo->method('find')->with(1)->willReturn($equipment);

        $em->expects($this->once())->method('flush');

        $handler = new DeleteEquipmentHandler($em, $repo);
        $handler(new DeleteEquipmentCommand(1));

        $this->assertNotNull($equipment->getDeletedAt());
    }

    public function testThrowsWhenEquipmentNotFound(): void {
        $em = $this->createMock(EntityManagerInterface::class);
        $repo = $this->createMock(EquipmentRepository::class);

        $repo->method('find')->willReturn(null);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Equipment not found');

        $handler = new DeleteEquipmentHandler($em, $repo);
        $handler(new DeleteEquipmentCommand(999));
    }
}
