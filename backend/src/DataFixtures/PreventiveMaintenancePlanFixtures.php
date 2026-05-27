<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\Equipment;
use App\Entity\PreventiveMaintenancePlan;
use App\Entity\User;
use App\Entity\WorkOrderPriority;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use DateTime;

class PreventiveMaintenancePlanFixtures extends Fixture implements DependentFixtureInterface
{
    public const PLAN_POMPA_REFERENCE = 'pm-plan-pompa';
    public const PLAN_ROBOT_REFERENCE = 'pm-plan-robot';

    public function load(ObjectManager $manager): void
    {
        /** @var User $admin */
        $admin = $this->getReference(AppFixtures::ADMIN_USER_REFERENCE, User::class);
        /** @var User $managerUser */
        $managerUser = $this->getReference(AppFixtures::MANAGER_USER_REFERENCE, User::class);

        /** @var Equipment $pompa */
        $pompa = $this->getReference(EquipmentFixtures::POMPA_LP1_REFERENCE, Equipment::class);
        /** @var Equipment $robot */
        $robot = $this->getReference(EquipmentFixtures::ROBOT_LP2_REFERENCE, Equipment::class);

        /** @var WorkOrderPriority $mediumPriority */
        $mediumPriority = $this->getReference(WorkOrderPriorityFixtures::MEDIUM_PRIORITY_REFERENCE, WorkOrderPriority::class);
        /** @var WorkOrderPriority $highPriority */
        $highPriority = $this->getReference(WorkOrderPriorityFixtures::HIGH_PRIORITY_REFERENCE, WorkOrderPriority::class);

        $plan1 = new PreventiveMaintenancePlan();
        $plan1->setTitle('Przegląd pompy hydraulicznej LP1');
        $plan1->setDescription('Okresowy przegląd pompy, kontrola szczelności, filtrów i ciśnienia układu.');
        $plan1->setIntervalDays(30);
        $plan1->setIsActive(true);
        $plan1->setEquipment($pompa);
        $plan1->setPriority($mediumPriority);
        $plan1->setCreatedBy($admin);
        $plan1->setNextDueAt(new DateTime('-1 day'));
        $manager->persist($plan1);
        $this->addReference(self::PLAN_POMPA_REFERENCE, $plan1);

        $plan2 = new PreventiveMaintenancePlan();
        $plan2->setTitle('Przegląd robota spawalniczego LP2');
        $plan2->setDescription('Kontrola osi, przewodów i aktualizacja sterowania w cyklu kwartalnym.');
        $plan2->setIntervalDays(90);
        $plan2->setIsActive(true);
        $plan2->setEquipment($robot);
        $plan2->setPriority($highPriority);
        $plan2->setCreatedBy($managerUser);
        $plan2->setNextDueAt(new DateTime('+14 days'));
        $manager->persist($plan2);
        $this->addReference(self::PLAN_ROBOT_REFERENCE, $plan2);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            AppFixtures::class,
            EquipmentFixtures::class,
            WorkOrderPriorityFixtures::class,
        ];
    }
}