<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\WorkOrderStatus;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class WorkOrderStatusFixtures extends Fixture implements DependentFixtureInterface
{
    public const OPEN_STATUS_REFERENCE = 'status-open';
    public const IN_PROGRESS_STATUS_REFERENCE = 'status-in-progress';
    public const ON_HOLD_STATUS_REFERENCE = 'status-on-hold';
    public const COMPLETED_STATUS_REFERENCE = 'status-completed';
    public const CANCELLED_STATUS_REFERENCE = 'status-cancelled';

    public function load(ObjectManager $manager): void
    {
        $statuses = [
            [
                'name' => 'open',
                'color' => '#3b82f6',
                'displayOrder' => 1,
                'isFinal' => false,
                'reference' => self::OPEN_STATUS_REFERENCE,
            ],
            [
                'name' => 'in_progress',
                'color' => '#f59e0b',
                'displayOrder' => 2,
                'isFinal' => false,
                'reference' => self::IN_PROGRESS_STATUS_REFERENCE,
            ],
            [
                'name' => 'on_hold',
                'color' => '#6b7280',
                'displayOrder' => 3,
                'isFinal' => false,
                'reference' => self::ON_HOLD_STATUS_REFERENCE,
            ],
            [
                'name' => 'completed',
                'color' => '#10b981',
                'displayOrder' => 4,
                'isFinal' => true,
                'reference' => self::COMPLETED_STATUS_REFERENCE,
            ],
            [
                'name' => 'cancelled',
                'color' => '#ef4444',
                'displayOrder' => 5,
                'isFinal' => true,
                'reference' => self::CANCELLED_STATUS_REFERENCE,
            ],
        ];

        foreach ($statuses as $statusData) {
            $status = new WorkOrderStatus();
            $status->setName($statusData['name']);
            $status->setColor($statusData['color']);
            $status->setDisplayOrder($statusData['displayOrder']);
            $status->setIsFinal($statusData['isFinal']);

            $manager->persist($status);
            $this->addReference($statusData['reference'], $status);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            MasterFixtures::class,
        ];
    }
}
