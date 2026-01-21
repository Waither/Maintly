<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\UserRole;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * User & Role Fixtures
 * Creates all user roles and sample users for testing
 */
class AppFixtures extends Fixture implements DependentFixtureInterface
{
    public const ADMIN_USER_REFERENCE = 'admin-user';
    public const MANAGER_USER_REFERENCE = 'manager-user';
    public const TECHNICIAN_USER_REFERENCE = 'technician-user';
    public const PROVIDER_USER_REFERENCE = 'provider-user';
    public const REPORTER_USER_REFERENCE = 'reporter-user';

    public const ADMIN_ROLE_REFERENCE = 'admin-role';
    public const MANAGER_ROLE_REFERENCE = 'manager-role';
    public const TECHNICIAN_ROLE_REFERENCE = 'technician-role';
    public const PROVIDER_ROLE_REFERENCE = 'provider-role';
    public const REPORTER_ROLE_REFERENCE = 'reporter-role';

    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
    ) {}

    public function load(ObjectManager $manager): void
    {
        // ========== CREATE USER ROLES ==========

        $adminRole = new UserRole();
        $adminRole->setName('admin');
        $manager->persist($adminRole);
        $this->addReference(self::ADMIN_ROLE_REFERENCE, $adminRole);

        $managerRole = new UserRole();
        $managerRole->setName('manager');
        $manager->persist($managerRole);
        $this->addReference(self::MANAGER_ROLE_REFERENCE, $managerRole);

        $technicianRole = new UserRole();
        $technicianRole->setName('technician');
        $manager->persist($technicianRole);
        $this->addReference(self::TECHNICIAN_ROLE_REFERENCE, $technicianRole);

        $providerRole = new UserRole();
        $providerRole->setName('provider');
        $manager->persist($providerRole);
        $this->addReference(self::PROVIDER_ROLE_REFERENCE, $providerRole);

        $reporterRole = new UserRole();
        $reporterRole->setName('reporter');
        $manager->persist($reporterRole);
        $this->addReference(self::REPORTER_ROLE_REFERENCE, $reporterRole);

        $manager->flush();

        // ========== CREATE USERS ==========

        // 1. ADMIN
        $admin = new User();
        $admin->setEmail('admin@maintly.com');
        $admin->setFirstName('Administrator');
        $admin->setLastName('Systemu');
        $admin->setUserRole($adminRole);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'MaintlyAdmin!@#'));
        $manager->persist($admin);
        $this->addReference(self::ADMIN_USER_REFERENCE, $admin);

        // 2. MANAGER
        $managerUser = new User();
        $managerUser->setEmail('manager@maintly.com');
        $managerUser->setFirstName('Kierownik');
        $managerUser->setLastName('Utrzymania');
        $managerUser->setUserRole($managerRole);
        $managerUser->setPassword($this->passwordHasher->hashPassword($managerUser, 'MaintlyManager!@#'));
        $manager->persist($managerUser);
        $this->addReference(self::MANAGER_USER_REFERENCE, $managerUser);

        // 3. TECHNICIAN
        $technician = new User();
        $technician->setEmail('tech@maintly.com');
        $technician->setFirstName('Jan');
        $technician->setLastName('Kowalski');
        $technician->setUserRole($technicianRole);
        $technician->setPassword($this->passwordHasher->hashPassword($technician, 'MaintlyTech!@#'));
        $manager->persist($technician);
        $this->addReference(self::TECHNICIAN_USER_REFERENCE, $technician);

        // 4. PROVIDER (external service)
        $provider = new User();
        $provider->setEmail('provider@external.com');
        $provider->setFirstName('Serwis');
        $provider->setLastName('Zewnętrzny');
        $provider->setUserRole($providerRole);
        $provider->setPassword($this->passwordHasher->hashPassword($provider, 'MaintlyProvider!@#'));
        $manager->persist($provider);
        $this->addReference(self::PROVIDER_USER_REFERENCE, $provider);

        // 5. REPORTER (production worker)
        $reporter = new User();
        $reporter->setEmail('reporter@maintly.com');
        $reporter->setFirstName('Operator');
        $reporter->setLastName('Produkcji');
        $reporter->setUserRole($reporterRole);
        $reporter->setPassword($this->passwordHasher->hashPassword($reporter, 'MaintlyReporter!@#'));
        $manager->persist($reporter);
        $this->addReference(self::REPORTER_USER_REFERENCE, $reporter);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            MasterFixtures::class,
        ];
    }
}
