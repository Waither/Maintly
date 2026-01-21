<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\WorkOrderPriority;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class WorkOrderPriorityFixtures extends Fixture implements DependentFixtureInterface
{
    public const LOW_PRIORITY_REFERENCE = 'priority-low';
    public const MEDIUM_PRIORITY_REFERENCE = 'priority-medium';
    public const HIGH_PRIORITY_REFERENCE = 'priority-high';
    public const CRITICAL_PRIORITY_REFERENCE = 'priority-critical';

    public function load(ObjectManager $manager): void
    {
        $priorities = [
            [
                'name' => 'low',
                'color' => '#10b981',
                'displayOrder' => 1,
                'reference' => self::LOW_PRIORITY_REFERENCE,
            ],
            [
                'name' => 'medium',
                'color' => '#f59e0b',
                'displayOrder' => 2,
                'reference' => self::MEDIUM_PRIORITY_REFERENCE,
            ],
            [
                'name' => 'high',
                'color' => '#f97316',
                'displayOrder' => 3,
                'reference' => self::HIGH_PRIORITY_REFERENCE,
            ],
            [
                'name' => 'critical',
                'color' => '#ef4444',
                'displayOrder' => 4,
                'reference' => self::CRITICAL_PRIORITY_REFERENCE,
            ],
        ];

        foreach ($priorities as $priorityData) {
            $priority = new WorkOrderPriority();
            $priority->setName($priorityData['name']);
            $priority->setColor($priorityData['color']);
            $priority->setDisplayOrder($priorityData['displayOrder']);

            $manager->persist($priority);
            $this->addReference($priorityData['reference'], $priority);
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
