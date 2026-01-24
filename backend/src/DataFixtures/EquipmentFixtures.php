<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\Equipment;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

/**
 * Equipment Fixtures
 * Creates 20 sample equipment items with hierarchical structure:
 * - Hala Produkcyjna #1
 *   - Linia Produkcyjna 1
 *     - Pompa hydrauliczna LP1
 *     - Silnik główny LP1
 *     - Taśmociąg LP1
 *   - Linia Produkcyjna 2
 *     - Prasa hydrauliczna LP2
 *     - Robot spawalniczy LP2
 * - Hala Magazynowa
 *   - Wózek widłowy #1
 *   - Wózek widłowy #2
 *   - Regał wysokiego składowania
 * - Budynek Administracyjny
 *   - Klimatyzator główny
 *   - UPS serwerowni
 * - Stacja transformatorowa
 *   - Transformator 15kV
 *   - Rozdzielnia główna
 * - Sprężarkownia
 *   - Kompresor Atlas Copco
 *   - Osuszacz powietrza
 *   - Zbiornik ciśnieniowy.
 */
class EquipmentFixtures extends Fixture implements DependentFixtureInterface {
    // Main locations
    public const HALA_1_REFERENCE = 'equipment-hala-1';
    public const HALA_MAGAZYN_REFERENCE = 'equipment-hala-magazyn';
    public const BUDYNEK_ADMIN_REFERENCE = 'equipment-budynek-admin';
    public const STACJA_TRAFO_REFERENCE = 'equipment-stacja-trafo';
    public const SPREZARKOWNIA_REFERENCE = 'equipment-sprezarkownia';

    // Production lines
    public const LINIA_1_REFERENCE = 'equipment-linia-1';
    public const LINIA_2_REFERENCE = 'equipment-linia-2';

    // Devices
    public const POMPA_LP1_REFERENCE = 'equipment-pompa-lp1';
    public const SILNIK_LP1_REFERENCE = 'equipment-silnik-lp1';
    public const TASMA_LP1_REFERENCE = 'equipment-tasma-lp1';
    public const PRASA_LP2_REFERENCE = 'equipment-prasa-lp2';
    public const ROBOT_LP2_REFERENCE = 'equipment-robot-lp2';
    public const WOZEK_1_REFERENCE = 'equipment-wozek-1';
    public const WOZEK_2_REFERENCE = 'equipment-wozek-2';
    public const REGAL_REFERENCE = 'equipment-regal';
    public const KLIMA_REFERENCE = 'equipment-klima';
    public const UPS_REFERENCE = 'equipment-ups';
    public const TRAFO_REFERENCE = 'equipment-trafo';
    public const ROZDZIELNIA_REFERENCE = 'equipment-rozdzielnia';
    public const KOMPRESOR_REFERENCE = 'equipment-kompresor';
    public const OSUSZACZ_REFERENCE = 'equipment-osuszacz';
    public const ZBIORNIK_REFERENCE = 'equipment-zbiornik';

    public function load(ObjectManager $manager): void {
        /** @var User $admin */
        $admin = $this->getReference(AppFixtures::ADMIN_USER_REFERENCE, User::class);

        // ========== LEVEL 0: Main locations ==========

        $hala1 = $this->createEquipment(
            'Hala Produkcyjna #1',
            1001,
            null,
            $admin,
        );
        $manager->persist($hala1);
        $this->addReference(self::HALA_1_REFERENCE, $hala1);

        $halaMagazyn = $this->createEquipment(
            'Hala Magazynowa',
            2001,
            null,
            $admin,
        );
        $manager->persist($halaMagazyn);
        $this->addReference(self::HALA_MAGAZYN_REFERENCE, $halaMagazyn);

        $budynekAdmin = $this->createEquipment(
            'Budynek Administracyjny',
            3001,
            null,
            $admin,
        );
        $manager->persist($budynekAdmin);
        $this->addReference(self::BUDYNEK_ADMIN_REFERENCE, $budynekAdmin);

        $stacjaTrafo = $this->createEquipment(
            'Stacja Transformatorowa',
            4001,
            null,
            $admin,
        );
        $manager->persist($stacjaTrafo);
        $this->addReference(self::STACJA_TRAFO_REFERENCE, $stacjaTrafo);

        $sprezarkownia = $this->createEquipment(
            'Sprężarkownia',
            5001,
            null,
            $admin,
        );
        $manager->persist($sprezarkownia);
        $this->addReference(self::SPREZARKOWNIA_REFERENCE, $sprezarkownia);

        // Flush to get IDs for parents
        $manager->flush();

        // ========== LEVEL 1: Production lines & sub-locations ==========

        $linia1 = $this->createEquipment(
            'Linia Produkcyjna 1',
            1101,
            $hala1,
            $admin,
        );
        $manager->persist($linia1);
        $this->addReference(self::LINIA_1_REFERENCE, $linia1);

        $linia2 = $this->createEquipment(
            'Linia Produkcyjna 2',
            1102,
            $hala1,
            $admin,
        );
        $manager->persist($linia2);
        $this->addReference(self::LINIA_2_REFERENCE, $linia2);

        $manager->flush();

        // ========== LEVEL 2: Individual equipment ==========

        // Under Linia 1
        $pompaLp1 = $this->createEquipment(
            'Pompa hydrauliczna LP1',
            1111,
            $linia1,
            $admin,
            120, // 2 hours of work time
        );
        $manager->persist($pompaLp1);
        $this->addReference(self::POMPA_LP1_REFERENCE, $pompaLp1);

        $silnikLp1 = $this->createEquipment(
            'Silnik główny LP1 (55kW)',
            1112,
            $linia1,
            $admin,
            45,
        );
        $manager->persist($silnikLp1);
        $this->addReference(self::SILNIK_LP1_REFERENCE, $silnikLp1);

        $tasmaLp1 = $this->createEquipment(
            'Taśmociąg LP1',
            1113,
            $linia1,
            $admin,
            30,
        );
        $manager->persist($tasmaLp1);
        $this->addReference(self::TASMA_LP1_REFERENCE, $tasmaLp1);

        // Under Linia 2
        $prasaLp2 = $this->createEquipment(
            'Prasa hydrauliczna 200T LP2',
            1121,
            $linia2,
            $admin,
            180,
        );
        $manager->persist($prasaLp2);
        $this->addReference(self::PRASA_LP2_REFERENCE, $prasaLp2);

        $robotLp2 = $this->createEquipment(
            'Robot spawalniczy KUKA LP2',
            1122,
            $linia2,
            $admin,
            90,
        );
        $manager->persist($robotLp2);
        $this->addReference(self::ROBOT_LP2_REFERENCE, $robotLp2);

        // Under Hala Magazynowa
        $wozek1 = $this->createEquipment(
            'Wózek widłowy Toyota #1',
            2101,
            $halaMagazyn,
            $admin,
            60,
        );
        $manager->persist($wozek1);
        $this->addReference(self::WOZEK_1_REFERENCE, $wozek1);

        $wozek2 = $this->createEquipment(
            'Wózek widłowy Toyota #2',
            2102,
            $halaMagazyn,
            $admin,
            45,
        );
        $manager->persist($wozek2);
        $this->addReference(self::WOZEK_2_REFERENCE, $wozek2);

        $regal = $this->createEquipment(
            'Regał wysokiego składowania A1',
            2103,
            $halaMagazyn,
            $admin,
        );
        $manager->persist($regal);
        $this->addReference(self::REGAL_REFERENCE, $regal);

        // Under Budynek Administracyjny
        $klima = $this->createEquipment(
            'Klimatyzator centralny Daikin',
            3101,
            $budynekAdmin,
            $admin,
            15,
        );
        $manager->persist($klima);
        $this->addReference(self::KLIMA_REFERENCE, $klima);

        $ups = $this->createEquipment(
            'UPS APC 30kVA Serwerownia',
            3102,
            $budynekAdmin,
            $admin,
            30,
        );
        $manager->persist($ups);
        $this->addReference(self::UPS_REFERENCE, $ups);

        // Under Stacja Transformatorowa
        $trafo = $this->createEquipment(
            'Transformator 15kV/400V 1000kVA',
            4101,
            $stacjaTrafo,
            $admin,
        );
        $manager->persist($trafo);
        $this->addReference(self::TRAFO_REFERENCE, $trafo);

        $rozdzielnia = $this->createEquipment(
            'Rozdzielnia główna RG-01',
            4102,
            $stacjaTrafo,
            $admin,
            60,
        );
        $manager->persist($rozdzielnia);
        $this->addReference(self::ROZDZIELNIA_REFERENCE, $rozdzielnia);

        // Under Sprężarkownia
        $kompresor = $this->createEquipment(
            'Kompresor śrubowy Atlas Copco GA55',
            5101,
            $sprezarkownia,
            $admin,
            240,
        );
        $manager->persist($kompresor);
        $this->addReference(self::KOMPRESOR_REFERENCE, $kompresor);

        $osuszacz = $this->createEquipment(
            'Osuszacz ziębniczy FD150',
            5102,
            $sprezarkownia,
            $admin,
            30,
        );
        $manager->persist($osuszacz);
        $this->addReference(self::OSUSZACZ_REFERENCE, $osuszacz);

        $zbiornik = $this->createEquipment(
            'Zbiornik ciśnieniowy 2000L',
            5103,
            $sprezarkownia,
            $admin,
        );
        $manager->persist($zbiornik);
        $this->addReference(self::ZBIORNIK_REFERENCE, $zbiornik);

        $manager->flush();
    }

    private function createEquipment(
        string $name,
        int $costCenter,
        ?Equipment $parent,
        User $createdBy,
        int $directWorkTime = 0,
    ): Equipment {
        $equipment = new Equipment();
        $equipment->setName($name);
        $equipment->setCostCenter($costCenter);
        $equipment->setParentEquipment($parent);
        $equipment->setCreatedBy($createdBy);
        $equipment->setDirectWorkTime($directWorkTime);
        $equipment->setTotalWorkTime($directWorkTime);

        return $equipment;
    }

    public function getDependencies(): array {
        return [
            AppFixtures::class,
        ];
    }
}
