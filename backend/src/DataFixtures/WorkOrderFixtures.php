<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\WorkOrder;
use App\Entity\WorkOrderPriority;
use App\Entity\WorkOrderStatus;
use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

/**
 * Work Order Fixtures
 * Creates 5 sample work orders for testing:
 * 1. Krytyczna awaria pompy - CRITICAL, IN_PROGRESS
 * 2. Przegląd okresowy robota - MEDIUM, OPEN
 * 3. Wymiana filtrów sprężarki - LOW, COMPLETED
 * 4. Naprawa klimatyzacji - HIGH, ON_HOLD
 * 5. Kalibracja prasy - MEDIUM, OPEN
 */
class WorkOrderFixtures extends Fixture implements DependentFixtureInterface
{
    public const WO_AWARIA_POMPY = 'work-order-awaria-pompy';
    public const WO_PRZEGLAD_ROBOTA = 'work-order-przeglad-robota';
    public const WO_FILTRY_SPREZARKA = 'work-order-filtry-sprezarka';
    public const WO_NAPRAWA_KLIMA = 'work-order-naprawa-klima';
    public const WO_KALIBRACJA_PRASY = 'work-order-kalibracja-prasy';

    public function load(ObjectManager $manager): void
    {
        // Get references
        /** @var User $admin */
        $admin = $this->getReference(AppFixtures::ADMIN_USER_REFERENCE, User::class);
        /** @var User $managerUser */
        $managerUser = $this->getReference(AppFixtures::MANAGER_USER_REFERENCE, User::class);
        /** @var User $technician */
        $technician = $this->getReference(AppFixtures::TECHNICIAN_USER_REFERENCE, User::class);

        // Statuses
        /** @var WorkOrderStatus $statusOpen */
        $statusOpen = $this->getReference(WorkOrderStatusFixtures::OPEN_STATUS_REFERENCE, WorkOrderStatus::class);
        /** @var WorkOrderStatus $statusInProgress */
        $statusInProgress = $this->getReference(WorkOrderStatusFixtures::IN_PROGRESS_STATUS_REFERENCE, WorkOrderStatus::class);
        /** @var WorkOrderStatus $statusOnHold */
        $statusOnHold = $this->getReference(WorkOrderStatusFixtures::ON_HOLD_STATUS_REFERENCE, WorkOrderStatus::class);
        /** @var WorkOrderStatus $statusCompleted */
        $statusCompleted = $this->getReference(WorkOrderStatusFixtures::COMPLETED_STATUS_REFERENCE, WorkOrderStatus::class);

        // Priorities
        /** @var WorkOrderPriority $priorityLow */
        $priorityLow = $this->getReference(WorkOrderPriorityFixtures::LOW_PRIORITY_REFERENCE, WorkOrderPriority::class);
        /** @var WorkOrderPriority $priorityMedium */
        $priorityMedium = $this->getReference(WorkOrderPriorityFixtures::MEDIUM_PRIORITY_REFERENCE, WorkOrderPriority::class);
        /** @var WorkOrderPriority $priorityHigh */
        $priorityHigh = $this->getReference(WorkOrderPriorityFixtures::HIGH_PRIORITY_REFERENCE, WorkOrderPriority::class);
        /** @var WorkOrderPriority $priorityCritical */
        $priorityCritical = $this->getReference(WorkOrderPriorityFixtures::CRITICAL_PRIORITY_REFERENCE, WorkOrderPriority::class);

        // Equipment
        /** @var Equipment $pompa */
        $pompa = $this->getReference(EquipmentFixtures::POMPA_LP1_REFERENCE, Equipment::class);
        /** @var Equipment $robot */
        $robot = $this->getReference(EquipmentFixtures::ROBOT_LP2_REFERENCE, Equipment::class);
        /** @var Equipment $kompresor */
        $kompresor = $this->getReference(EquipmentFixtures::KOMPRESOR_REFERENCE, Equipment::class);
        /** @var Equipment $klima */
        $klima = $this->getReference(EquipmentFixtures::KLIMA_REFERENCE, Equipment::class);
        /** @var Equipment $prasa */
        $prasa = $this->getReference(EquipmentFixtures::PRASA_LP2_REFERENCE, Equipment::class);

        // ========== WORK ORDER 1: Critical pump failure ==========
        $wo1 = new WorkOrder();
        $wo1->setTitle('Awaria pompy hydraulicznej - wyciek oleju');
        $wo1->setDescription(
            "Zgłoszenie z produkcji: wykryto wyciek oleju hydraulicznego z pompy LP1.\n" .
            "Symptomy:\n" .
            "- Widoczna plama oleju pod pompą\n" .
            "- Spadek ciśnienia w układzie z 180 bar do 120 bar\n" .
            "- Zwiększony hałas podczas pracy\n\n" .
            "Wymagane działania:\n" .
            "1. Wymiana uszczelnień\n" .
            "2. Kontrola stanu łożysk\n" .
            "3. Uzupełnienie oleju hydraulicznego"
        );
        $wo1->setStatus($statusInProgress);
        $wo1->setPriority($priorityCritical);
        $wo1->setEquipment($pompa);
        $wo1->setCreatedBy($managerUser);
        $wo1->setPlannedStartDate(new DateTime('-1 day'));
        $wo1->setPlannedEndDate(new DateTime('+1 day'));
        $wo1->setActualStartDate(new DateTime('-4 hours'));
        $manager->persist($wo1);
        $this->addReference(self::WO_AWARIA_POMPY, $wo1);

        // ========== WORK ORDER 2: Robot periodic maintenance ==========
        $wo2 = new WorkOrder();
        $wo2->setTitle('Przegląd okresowy robota spawalniczego');
        $wo2->setDescription(
            "Planowany przegląd co 5000 motogodzin - robot KUKA LP2.\n\n" .
            "Zakres prac:\n" .
            "- Kontrola stanu przewodów spawalniczych\n" .
            "- Smarowanie osi 1-6\n" .
            "- Sprawdzenie dokładności pozycjonowania\n" .
            "- Aktualizacja oprogramowania sterującego\n" .
            "- Wymiana filtrów wentylacji szafy sterowniczej\n\n" .
            "Uwaga: Wymagany przestój linii 2 na czas przeglądu (ok. 4h)."
        );
        $wo2->setStatus($statusOpen);
        $wo2->setPriority($priorityMedium);
        $wo2->setEquipment($robot);
        $wo2->setCreatedBy($admin);
        $wo2->setPlannedStartDate(new DateTime('+3 days'));
        $wo2->setPlannedEndDate(new DateTime('+3 days 6 hours'));
        $manager->persist($wo2);
        $this->addReference(self::WO_PRZEGLAD_ROBOTA, $wo2);

        // ========== WORK ORDER 3: Compressor filter replacement (completed) ==========
        $wo3 = new WorkOrder();
        $wo3->setTitle('Wymiana filtrów sprężarki Atlas Copco');
        $wo3->setDescription(
            "Rutynowa wymiana filtrów zgodnie z harmonogramem konserwacji.\n\n" .
            "Wymieniono:\n" .
            "- Filtr powietrza wlotowego (DD260+)\n" .
            "- Filtr oleju (1622 0871 00)\n" .
            "- Separator oleju\n\n" .
            "Stan po wymianie: OK\n" .
            "Następna wymiana: za 4000h lub 12 miesięcy."
        );
        $wo3->setStatus($statusCompleted);
        $wo3->setPriority($priorityLow);
        $wo3->setEquipment($kompresor);
        $wo3->setCreatedBy($technician);
        $wo3->setPlannedStartDate(new DateTime('-5 days'));
        $wo3->setPlannedEndDate(new DateTime('-5 days 2 hours'));
        $wo3->setActualStartDate(new DateTime('-5 days'));
        $wo3->setActualEndDate(new DateTime('-5 days 3 hours'));
        $manager->persist($wo3);
        $this->addReference(self::WO_FILTRY_SPREZARKA, $wo3);

        // ========== WORK ORDER 4: AC repair (on hold) ==========
        $wo4 = new WorkOrder();
        $wo4->setTitle('Naprawa klimatyzacji - brak chłodzenia');
        $wo4->setDescription(
            "Zgłoszenie z biura: klimatyzacja nie chłodzi pomimo ustawienia 22°C.\n\n" .
            "Diagnoza wstępna:\n" .
            "- Jednostka zewnętrzna działa\n" .
            "- Wentylator wewnętrzny OK\n" .
            "- Podejrzenie: nieszczelność układu freonowego\n\n" .
            "STATUS: WSTRZYMANE - oczekiwanie na serwis Daikin (umówiony na 15.01).\n" .
            "Kontakt: Jan Nowak, tel. 600-123-456"
        );
        $wo4->setStatus($statusOnHold);
        $wo4->setPriority($priorityHigh);
        $wo4->setEquipment($klima);
        $wo4->setCreatedBy($managerUser);
        $wo4->setPlannedStartDate(new DateTime('-2 days'));
        $wo4->setPlannedEndDate(new DateTime('+5 days'));
        $wo4->setActualStartDate(new DateTime('-2 days'));
        $manager->persist($wo4);
        $this->addReference(self::WO_NAPRAWA_KLIMA, $wo4);

        // ========== WORK ORDER 5: Press calibration ==========
        $wo5 = new WorkOrder();
        $wo5->setTitle('Kalibracja prasy hydraulicznej 200T');
        $wo5->setDescription(
            "Coroczna kalibracja prasy zgodnie z wymaganiami ISO 9001.\n\n" .
            "Zakres:\n" .
            "- Weryfikacja siły nacisku (200T ±2%)\n" .
            "- Kontrola równoległości stołu\n" .
            "- Sprawdzenie czujników bezpieczeństwa\n" .
            "- Kalibracja manometrów\n\n" .
            "Wymagane: świadectwo kalibracji od akredytowanego laboratorium."
        );
        $wo5->setStatus($statusOpen);
        $wo5->setPriority($priorityMedium);
        $wo5->setEquipment($prasa);
        $wo5->setCreatedBy($admin);
        $wo5->setPlannedStartDate(new DateTime('+7 days'));
        $wo5->setPlannedEndDate(new DateTime('+7 days 4 hours'));
        $manager->persist($wo5);
        $this->addReference(self::WO_KALIBRACJA_PRASY, $wo5);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            AppFixtures::class,
            WorkOrderStatusFixtures::class,
            WorkOrderPriorityFixtures::class,
            EquipmentFixtures::class,
        ];
    }
}
