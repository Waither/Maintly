<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\Equipment;
use App\Entity\User;
use DateTimeImmutable;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(Equipment::class)]
class EquipmentTest extends TestCase {
    #[Test]
    public function newEquipmentHasNullId(): void {
        $equipment = new Equipment();

        $this->assertNull($equipment->getId());
    }

    #[Test]
    public function canSetAndGetName(): void {
        $equipment = new Equipment();
        $equipment->setName('Prasa hydrauliczna');

        $this->assertSame('Prasa hydrauliczna', $equipment->getName());
    }

    #[Test]
    public function canSetAndGetCostCenter(): void {
        $equipment = new Equipment();
        $equipment->setCostCenter(12345);

        $this->assertSame(12345, $equipment->getCostCenter());
    }

    #[Test]
    public function newEquipmentHasZeroDirectWorkTime(): void {
        $equipment = new Equipment();

        $this->assertSame(0, $equipment->getDirectWorkTime());
    }

    #[Test]
    public function canSetDirectWorkTime(): void {
        $equipment = new Equipment();
        $equipment->setDirectWorkTime(120);

        $this->assertSame(120, $equipment->getDirectWorkTime());
    }

    #[Test]
    public function newEquipmentHasZeroTotalWorkTime(): void {
        $equipment = new Equipment();

        $this->assertSame(0, $equipment->getTotalWorkTime());
    }

    #[Test]
    public function canSetTotalWorkTime(): void {
        $equipment = new Equipment();
        $equipment->setTotalWorkTime(500);

        $this->assertSame(500, $equipment->getTotalWorkTime());
    }

    #[Test]
    public function canSetParentEquipment(): void {
        $parent = new Equipment();
        $parent->setName('Linia produkcyjna');

        $child = new Equipment();
        $child->setName('Prasa');
        $child->setParentEquipment($parent);

        $this->assertSame($parent, $child->getParentEquipment());
    }

    #[Test]
    public function canRemoveParentEquipment(): void {
        $parent = new Equipment();
        $child = new Equipment();
        $child->setParentEquipment($parent);
        $child->setParentEquipment(null);

        $this->assertNull($child->getParentEquipment());
    }

    #[Test]
    public function newEquipmentHasEmptyChildrenCollection(): void {
        $equipment = new Equipment();

        $this->assertCount(0, $equipment->getChildren());
    }

    #[Test]
    public function newEquipmentHasEmptyTagsCollection(): void {
        $equipment = new Equipment();

        $this->assertCount(0, $equipment->getEquipmentTags());
    }

    #[Test]
    public function newEquipmentHasEmptyFilesCollection(): void {
        $equipment = new Equipment();

        $this->assertCount(0, $equipment->getFiles());
    }

    #[Test]
    public function newEquipmentHasCreatedAtSet(): void {
        $before = new DateTimeImmutable();
        $equipment = new Equipment();
        $after = new DateTimeImmutable();

        $this->assertNotNull($equipment->getCreatedAt());
        $this->assertGreaterThanOrEqual($before, $equipment->getCreatedAt());
        $this->assertLessThanOrEqual($after, $equipment->getCreatedAt());
    }

    #[Test]
    public function canSetCreatedBy(): void {
        $equipment = new Equipment();
        $user = new User();
        $user->setEmail('test@example.com');

        $equipment->setCreatedBy($user);

        $this->assertSame($user, $equipment->getCreatedBy());
    }

    #[Test]
    public function canSetUpdatedAt(): void {
        $equipment = new Equipment();
        $date = new DateTimeImmutable('2025-01-24 10:00:00');

        $equipment->setUpdatedAt($date);

        $this->assertSame($date, $equipment->getUpdatedAt());
    }

    #[Test]
    public function canSetDeletedAt(): void {
        $equipment = new Equipment();
        $date = new DateTimeImmutable('2025-01-24 10:00:00');

        $equipment->setDeletedAt($date);

        $this->assertSame($date, $equipment->getDeletedAt());
    }

    #[Test]
    public function newEquipmentHasNullQrCode(): void {
        $equipment = new Equipment();

        $this->assertNull($equipment->getQrCodeData());
    }

    #[Test]
    public function setNameReturnsSelf(): void {
        $equipment = new Equipment();

        $result = $equipment->setName('Test');

        $this->assertSame($equipment, $result);
    }
}
