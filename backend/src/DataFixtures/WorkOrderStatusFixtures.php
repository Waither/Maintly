<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\WorkOrderStatus;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class WorkOrderStatusFixtures extends Fixture {
    public function load(ObjectManager $manager): void {
        $statuses = [
            [
                'name' => 'open',
                'color' => '#3b82f6', // blue
                'displayOrder' => 1,
                'isFinal' => false,
            ],
            [
                'name' => 'in_progress',
                'color' => '#f59e0b', // amber
                'displayOrder' => 2,
                'isFinal' => false,
            ],
            [
                'name' => 'on_hold',
                'color' => '#6b7280', // gray
                'displayOrder' => 3,
                'isFinal' => false,
            ],
            [
                'name' => 'completed',
                'color' => '#10b981', // green
                'displayOrder' => 4,
                'isFinal' => true,
            ],
            [
                'name' => 'cancelled',
                'color' => '#ef4444', // red
                'displayOrder' => 5,
                'isFinal' => true,
            ],
        ];

        foreach ($statuses as $statusData) {
            $status = new WorkOrderStatus();
            $status->setName($statusData['name']);
            $status->setColor($statusData['color']);
            $status->setDisplayOrder($statusData['displayOrder']);
            $status->setIsFinal($statusData['isFinal']);

            $manager->persist($status);
        }

        $manager->flush();
    }
}
