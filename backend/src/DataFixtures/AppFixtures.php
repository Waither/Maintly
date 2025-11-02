<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\UserRole;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture {
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
    ) {}

    public function load(ObjectManager $manager): void {
        // ========== CREATE USER ROLES ==========

        // 1. ADMIN - full system access
        $adminRole = new UserRole();
        $adminRole->setName('admin');
        $adminRole->setDescription('Administrator systemu');
        $manager->persist($adminRole);

        // 2. MANAGER - maintenance manager
        $managerRole = new UserRole();
        $managerRole->setName('manager');
        $managerRole->setDescription('Menedżer utrzymania ruchu');
        $manager->persist($managerRole);

        // 3. TECHNICIAN - electrician/mechanic
        $technicianRole = new UserRole();
        $technicianRole->setName('technician');
        $technicianRole->setDescription('Technik serwisowy');
        $manager->persist($technicianRole);

        // 4. REPORTER - production worker (can report failures)
        $reporterRole = new UserRole();
        $reporterRole->setName('reporter');
        $reporterRole->setDescription('Pracownik produkcyjny');
        $manager->persist($reporterRole);

        // Flush roles to database (so they have IDs before creating users)
        $manager->flush();

        // ========== CREATE USERS ==========

        // ADMIN ONLY - with secure password for testing
        $admin = new User();
        $admin->setEmail('admin@maintly.com');
        $admin->setFirstName('Administrator');
        $admin->setLastName('Systemu');
        $admin->setUserRole($adminRole);
        // Password: MaintlyAdmin!@# (secure, easy to remember during tests)
        $hashedPassword = $this->passwordHasher->hashPassword($admin, 'MaintlyAdmin!@#');
        $admin->setPassword($hashedPassword);
        $manager->persist($admin);

        $manager->flush();
    }
}
