<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\WorkOrderPriority;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class WorkOrderPriorityFixtures extends Fixture {
    public function load(ObjectManager $manager): void {
        $priorities = [
            [
                'name' => 'low',
                'color' => '#10b981', // green
                'displayOrder' => 1,
            ],
            [
                'name' => 'medium',
                'color' => '#f59e0b', // amber
                'displayOrder' => 2,
            ],
            [
                'name' => 'high',
                'color' => '#f97316', // orange
                'displayOrder' => 3,
            ],
            [
                'name' => 'critical',
                'color' => '#ef4444', // red
                'displayOrder' => 4,
            ],
        ];

        foreach ($priorities as $priorityData) {
            $priority = new WorkOrderPriority();
            $priority->setName($priorityData['name']);
            $priority->setColor($priorityData['color']);
            $priority->setDisplayOrder($priorityData['displayOrder']);

            $manager->persist($priority);
        }

        $manager->flush();
    }
}
