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
 * Creates realistic demo work orders spread across the current year,
 * so dashboard and KPI pages always have meaningful data in demo mode.
 */
class WorkOrderFixtures extends Fixture implements DependentFixtureInterface {
    public const WO_AWARIA_POMPY = 'work-order-awaria-pompy';
    public const WO_PRZEGLAD_ROBOTA = 'work-order-przeglad-robota';
    public const WO_FILTRY_SPREZARKA = 'work-order-filtry-sprezarka';
    public const WO_NAPRAWA_KLIMA = 'work-order-naprawa-klima';
    public const WO_KALIBRACJA_PRASY = 'work-order-kalibracja-prasy';

    public function load(ObjectManager $manager): void {
        $currentYear = (int) date('Y');

        $users = [
            'admin' => $this->getReference(AppFixtures::ADMIN_USER_REFERENCE, User::class),
            'manager' => $this->getReference(AppFixtures::MANAGER_USER_REFERENCE, User::class),
            'technician' => $this->getReference(AppFixtures::TECHNICIAN_USER_REFERENCE, User::class),
            'provider' => $this->getReference(AppFixtures::PROVIDER_USER_REFERENCE, User::class),
            'reporter' => $this->getReference(AppFixtures::REPORTER_USER_REFERENCE, User::class),
        ];

        $statuses = [
            'open' => $this->getReference(WorkOrderStatusFixtures::OPEN_STATUS_REFERENCE, WorkOrderStatus::class),
            'in_progress' => $this->getReference(WorkOrderStatusFixtures::IN_PROGRESS_STATUS_REFERENCE, WorkOrderStatus::class),
            'on_hold' => $this->getReference(WorkOrderStatusFixtures::ON_HOLD_STATUS_REFERENCE, WorkOrderStatus::class),
            'completed' => $this->getReference(WorkOrderStatusFixtures::COMPLETED_STATUS_REFERENCE, WorkOrderStatus::class),
            'cancelled' => $this->getReference(WorkOrderStatusFixtures::CANCELLED_STATUS_REFERENCE, WorkOrderStatus::class),
        ];

        $priorities = [
            'low' => $this->getReference(WorkOrderPriorityFixtures::LOW_PRIORITY_REFERENCE, WorkOrderPriority::class),
            'medium' => $this->getReference(WorkOrderPriorityFixtures::MEDIUM_PRIORITY_REFERENCE, WorkOrderPriority::class),
            'high' => $this->getReference(WorkOrderPriorityFixtures::HIGH_PRIORITY_REFERENCE, WorkOrderPriority::class),
            'critical' => $this->getReference(WorkOrderPriorityFixtures::CRITICAL_PRIORITY_REFERENCE, WorkOrderPriority::class),
        ];

        $equipment = [
            'pompa' => $this->getReference(EquipmentFixtures::POMPA_LP1_REFERENCE, Equipment::class),
            'robot' => $this->getReference(EquipmentFixtures::ROBOT_LP2_REFERENCE, Equipment::class),
            'kompresor' => $this->getReference(EquipmentFixtures::KOMPRESOR_REFERENCE, Equipment::class),
            'klima' => $this->getReference(EquipmentFixtures::KLIMA_REFERENCE, Equipment::class),
            'prasa' => $this->getReference(EquipmentFixtures::PRASA_LP2_REFERENCE, Equipment::class),
            'ups' => $this->getReference(EquipmentFixtures::UPS_REFERENCE, Equipment::class),
            'wozek' => $this->getReference(EquipmentFixtures::WOZEK_1_REFERENCE, Equipment::class),
            'silnik' => $this->getReference(EquipmentFixtures::SILNIK_LP1_REFERENCE, Equipment::class),
            'rozdzielnia' => $this->getReference(EquipmentFixtures::ROZDZIELNIA_REFERENCE, Equipment::class),
        ];

        $definitions = [
            [
                'reference' => self::WO_AWARIA_POMPY,
                'title' => 'Awaria pompy hydraulicznej LP1 - spadek ciśnienia i wyciek oleju',
                'description' => 'Zgłoszenie z linii 1. Operator zauważył wyciek oleju, spadek ciśnienia do 120 bar oraz wzrost hałasu pompy. Konieczna diagnostyka uszczelnień i łożysk.',
                'status' => 'in_progress',
                'priority' => 'critical',
                'equipment' => 'pompa',
                'creator' => 'reporter',
                'createdAt' => $this->at($currentYear, 1, 10, 6, 45),
                'plannedStart' => $this->at($currentYear, 1, 10, 7, 15),
                'plannedEnd' => $this->at($currentYear, 1, 10, 14, 0),
                'actualStart' => $this->at($currentYear, 1, 10, 7, 40),
                'updatedAt' => $this->at($currentYear, 1, 10, 12, 20),
            ],
            [
                'reference' => self::WO_FILTRY_SPREZARKA,
                'title' => 'Wymiana filtrów i separatora oleju w sprężarce Atlas Copco',
                'description' => 'Planowy serwis wykonany zgodnie z harmonogramem. Wymieniono filtr powietrza, filtr oleju i separator. Parametry po uruchomieniu w normie.',
                'status' => 'completed',
                'priority' => 'low',
                'equipment' => 'kompresor',
                'creator' => 'technician',
                'createdAt' => $this->at($currentYear, 1, 18, 8, 0),
                'plannedStart' => $this->at($currentYear, 1, 18, 8, 0),
                'plannedEnd' => $this->at($currentYear, 1, 18, 11, 0),
                'actualStart' => $this->at($currentYear, 1, 18, 8, 10),
                'actualEnd' => $this->at($currentYear, 1, 18, 11, 25),
                'updatedAt' => $this->at($currentYear, 1, 18, 11, 25),
            ],
            [
                'reference' => self::WO_PRZEGLAD_ROBOTA,
                'title' => 'Przegląd okresowy robota spawalniczego KUKA LP2',
                'description' => 'Przegląd po 5000 motogodzinach: smarowanie osi, kontrola przewodów spawalniczych, sprawdzenie dokładności pozycjonowania i aktualizacja sterownika.',
                'status' => 'completed',
                'priority' => 'medium',
                'equipment' => 'robot',
                'creator' => 'manager',
                'createdAt' => $this->at($currentYear, 2, 6, 7, 30),
                'plannedStart' => $this->at($currentYear, 2, 7, 6, 0),
                'plannedEnd' => $this->at($currentYear, 2, 7, 12, 0),
                'actualStart' => $this->at($currentYear, 2, 7, 6, 20),
                'actualEnd' => $this->at($currentYear, 2, 7, 12, 40),
                'updatedAt' => $this->at($currentYear, 2, 7, 12, 40),
            ],
            [
                'title' => 'Zanik zasilania na rozdzielni RG-01 - diagnostyka wyłącznika',
                'description' => 'Krótki postój hali po zadziałaniu zabezpieczenia. Trwa diagnostyka rozdzielni i obciążenia obwodów zasilających linię 2.',
                'status' => 'completed',
                'priority' => 'high',
                'equipment' => 'rozdzielnia',
                'creator' => 'manager',
                'createdAt' => $this->at($currentYear, 3, 12, 5, 50),
                'plannedStart' => $this->at($currentYear, 3, 12, 6, 0),
                'plannedEnd' => $this->at($currentYear, 3, 12, 10, 0),
                'actualStart' => $this->at($currentYear, 3, 12, 6, 5),
                'actualEnd' => $this->at($currentYear, 3, 12, 9, 10),
                'updatedAt' => $this->at($currentYear, 3, 12, 9, 10),
            ],
            [
                'title' => 'Drugi serwis sprężarki - podwyższona temperatura oleju',
                'description' => 'Po wzroście temperatury oleju wykonano dodatkowy przegląd chłodnicy i układu smarowania. Wymieniono zabrudzone wkłady filtracyjne.',
                'status' => 'completed',
                'priority' => 'medium',
                'equipment' => 'kompresor',
                'creator' => 'technician',
                'createdAt' => $this->at($currentYear, 3, 28, 9, 15),
                'plannedStart' => $this->at($currentYear, 3, 28, 10, 0),
                'plannedEnd' => $this->at($currentYear, 3, 28, 14, 0),
                'actualStart' => $this->at($currentYear, 3, 28, 10, 10),
                'actualEnd' => $this->at($currentYear, 3, 28, 13, 35),
                'updatedAt' => $this->at($currentYear, 3, 28, 13, 35),
            ],
            [
                'reference' => self::WO_NAPRAWA_KLIMA,
                'title' => 'Naprawa klimatyzacji centralnej - brak chłodzenia w biurach',
                'description' => 'Jednostka wewnętrzna pracuje, ale temperatura nie spada. Serwis zewnętrzny czeka na dostawę czynnika i zestawu uszczelnień.',
                'status' => 'on_hold',
                'priority' => 'high',
                'equipment' => 'klima',
                'creator' => 'provider',
                'createdAt' => $this->at($currentYear, 4, 8, 9, 0),
                'plannedStart' => $this->at($currentYear, 4, 8, 12, 0),
                'plannedEnd' => $this->at($currentYear, 4, 12, 16, 0),
                'actualStart' => $this->at($currentYear, 4, 8, 12, 30),
                'updatedAt' => $this->at($currentYear, 4, 9, 14, 45),
            ],
            [
                'title' => 'Uszkodzony czujnik ciśnienia na prasie 200T - zgłoszenie anulowane',
                'description' => 'Po weryfikacji okazało się, że alarm pochodził z błędnej parametryzacji po poprzedniej zmianie receptury. Interwencja mechaniczna nie była wymagana.',
                'status' => 'cancelled',
                'priority' => 'medium',
                'equipment' => 'prasa',
                'creator' => 'admin',
                'createdAt' => $this->at($currentYear, 4, 23, 10, 20),
                'plannedStart' => $this->at($currentYear, 4, 23, 11, 0),
                'plannedEnd' => $this->at($currentYear, 4, 23, 13, 0),
                'updatedAt' => $this->at($currentYear, 4, 23, 11, 40),
            ],
            [
                'reference' => self::WO_KALIBRACJA_PRASY,
                'title' => 'Kalibracja prasy hydraulicznej 200T przed audytem klienta',
                'description' => 'Roczna kalibracja siły nacisku i czujników bezpieczeństwa przed audytem klienta automotive. Wymagane potwierdzenie świadectwem wzorcowania.',
                'status' => 'open',
                'priority' => 'medium',
                'equipment' => 'prasa',
                'creator' => 'admin',
                'createdAt' => $this->at($currentYear, 5, 6, 8, 30),
                'plannedStart' => $this->at($currentYear, 6, 2, 6, 0),
                'plannedEnd' => $this->at($currentYear, 6, 2, 12, 0),
            ],
            [
                'title' => 'Awaria UPS w serwerowni - test baterii niezaliczony',
                'description' => 'System monitoringu zgłosił spadek pojemności baterii poniżej progu bezpieczeństwa. Konieczna wymiana modułu bateryjnego i test pod obciążeniem.',
                'status' => 'open',
                'priority' => 'high',
                'equipment' => 'ups',
                'creator' => 'manager',
                'createdAt' => $this->at($currentYear, 5, 9, 7, 10),
                'plannedStart' => $this->at($currentYear, 5, 9, 8, 0),
                'plannedEnd' => $this->at($currentYear, 5, 10, 14, 0),
            ],
            [
                'title' => 'Drgania silnika głównego LP1 - analiza łożysk i osiowości',
                'description' => 'Na linii 1 zarejestrowano wzrost drgań RMS. Technik rozpoczął pomiary drgań i kontrolę osiowania z przekładnią.',
                'status' => 'in_progress',
                'priority' => 'high',
                'equipment' => 'silnik',
                'creator' => 'reporter',
                'createdAt' => $this->at($currentYear, 5, 15, 6, 55),
                'plannedStart' => $this->at($currentYear, 5, 15, 7, 30),
                'plannedEnd' => $this->at($currentYear, 5, 15, 15, 0),
                'actualStart' => $this->at($currentYear, 5, 15, 7, 45),
                'updatedAt' => $this->at($currentYear, 5, 15, 11, 50),
            ],
            [
                'title' => 'Robot KUKA LP2 - ponowna kalibracja toru ruchu po wymianie chwytaka',
                'description' => 'Po wymianie chwytaka konieczna jest kontrola punktów referencyjnych i dokładności toru ruchu. Zadanie zaplanowane na weekendowy przestój.',
                'status' => 'completed',
                'priority' => 'medium',
                'equipment' => 'robot',
                'creator' => 'technician',
                'createdAt' => $this->at($currentYear, 5, 20, 8, 0),
                'plannedStart' => $this->at($currentYear, 5, 24, 6, 0),
                'plannedEnd' => $this->at($currentYear, 5, 24, 12, 0),
                'actualStart' => $this->at($currentYear, 5, 24, 6, 15),
                'actualEnd' => $this->at($currentYear, 5, 24, 11, 10),
                'updatedAt' => $this->at($currentYear, 5, 24, 11, 10),
            ],
            [
                'title' => 'Wózek widłowy Toyota #1 - nieszczelność siłownika podnoszenia',
                'description' => 'W magazynie wykryto nieszczelność siłownika masztu. Zlecenie pozostaje otwarte do czasu dostawy kompletu uszczelnień i zaplanowania postoju.',
                'status' => 'open',
                'priority' => 'medium',
                'equipment' => 'wozek',
                'creator' => 'reporter',
                'createdAt' => $this->at($currentYear, 5, 26, 9, 5),
                'plannedStart' => $this->at($currentYear, 5, 27, 8, 0),
                'plannedEnd' => $this->at($currentYear, 5, 27, 12, 0),
            ],
        ];

        foreach ($definitions as $definition) {
            $workOrder = new WorkOrder();
            $workOrder->setTitle($definition['title']);
            $workOrder->setDescription($definition['description']);
            $workOrder->setStatus($statuses[$definition['status']]);
            $workOrder->setPriority($priorities[$definition['priority']]);
            $workOrder->setEquipment($equipment[$definition['equipment']]);
            $workOrder->setCreatedBy($users[$definition['creator']]);

            if (isset($definition['plannedStart'])) {
                $workOrder->setPlannedStartDate($definition['plannedStart']);
            }
            if (isset($definition['plannedEnd'])) {
                $workOrder->setPlannedEndDate($definition['plannedEnd']);
            }
            if (isset($definition['actualStart'])) {
                $workOrder->setActualStartDate($definition['actualStart']);
            }
            if (isset($definition['actualEnd'])) {
                $workOrder->setActualEndDate($definition['actualEnd']);
            }
            if (isset($definition['updatedAt'])) {
                $workOrder->setUpdatedAt($definition['updatedAt']);
            }

            $this->setCreatedAt($workOrder, $definition['createdAt']);

            $manager->persist($workOrder);

            if (isset($definition['reference'])) {
                $this->addReference($definition['reference'], $workOrder);
            }
        }

        $manager->flush();
    }

    private function at(int $year, int $month, int $day, int $hour = 8, int $minute = 0): DateTime {
        return new DateTime(sprintf('%04d-%02d-%02d %02d:%02d:00', $year, $month, $day, $hour, $minute));
    }

    private function setCreatedAt(WorkOrder $workOrder, DateTime $createdAt): void {
        $reflection = new \ReflectionProperty($workOrder, 'createdAt');
        $reflection->setAccessible(true);
        $reflection->setValue($workOrder, $createdAt);
    }

    public function getDependencies(): array {
        return [
            AppFixtures::class,
            WorkOrderStatusFixtures::class,
            WorkOrderPriorityFixtures::class,
            EquipmentFixtures::class,
        ];
    }
}
