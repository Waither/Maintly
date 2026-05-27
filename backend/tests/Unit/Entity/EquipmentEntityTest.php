<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\Equipment;
use App\Entity\EquipmentTag;
use App\Entity\Tag;
use App\Entity\TagGroup;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use App\Entity\User;
use App\Entity\UserRole;
use PHPUnit\Framework\TestCase;

class EquipmentEntityTest extends TestCase {
    public function testGetterSetterRoundtrip(): void {
        $equipment = new Equipment();

        $equipment->setName('Pump A');
        $this->assertSame('Pump A', $equipment->getName());

        $equipment->setCostCenter(42);
        $this->assertSame(42, $equipment->getCostCenter());

        $equipment->setQrCodeData('QR-DATA-001');
        $this->assertSame('QR-DATA-001', $equipment->getQrCodeData());

        $equipment->setDirectWorkTime(100);
        $this->assertSame(100, $equipment->getDirectWorkTime());

        $equipment->setTotalWorkTime(200);
        $this->assertSame(200, $equipment->getTotalWorkTime());
    }

    public function testTagCollectionIsEmptyByDefault(): void {
        $equipment = new Equipment();
        $this->assertCount(0, $equipment->getEquipmentTags());
    }
}
