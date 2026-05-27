<?php

declare(strict_types=1);

namespace App\Tests\Unit\Security;

use App\Entity\User;
use App\Entity\UserRole;
use App\Security\Voter\UserManagementVoter;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class UserManagementVoterTest extends TestCase {
    private UserManagementVoter $voter;

    protected function setUp(): void {
        $this->voter = new UserManagementVoter();
    }

    public function testAdminCanDoEverything(): void {
        $admin = $this->buildUser('admin');
        $token = new UsernamePasswordToken($admin, 'main', $admin->getRoles());

        $reporterRole = $this->buildRole('reporter');
        $reporterUser = $this->buildUser('reporter');

        $this->assertSame(1, $this->voter->vote($token, $reporterRole, ['USER_CREATE']));
        $this->assertSame(1, $this->voter->vote($token, $reporterRole, ['USER_UPDATE']));
        $this->assertSame(1, $this->voter->vote($token, $reporterUser, ['USER_DELETE']));
    }

    public function testManagerCanCreateLowerPrivilegeRoles(): void {
        $manager = $this->buildUser('manager');
        $token = new UsernamePasswordToken($manager, 'main', $manager->getRoles());

        $techRole = $this->buildRole('technician');
        $reporterRole = $this->buildRole('reporter');
        $providerRole = $this->buildRole('provider');

        $this->assertSame(1, $this->voter->vote($token, $techRole, ['USER_CREATE']));
        $this->assertSame(1, $this->voter->vote($token, $reporterRole, ['USER_CREATE']));
        $this->assertSame(1, $this->voter->vote($token, $providerRole, ['USER_CREATE']));
    }

    public function testManagerCannotCreateManagerOrAdmin(): void {
        $manager = $this->buildUser('manager');
        $token = new UsernamePasswordToken($manager, 'main', $manager->getRoles());

        $managerRole = $this->buildRole('manager');
        $adminRole = $this->buildRole('admin');

        $this->assertSame(-1, $this->voter->vote($token, $managerRole, ['USER_CREATE']));
        $this->assertSame(-1, $this->voter->vote($token, $adminRole, ['USER_CREATE']));
    }

    public function testManagerCanDeleteLowerUsers(): void {
        $manager = $this->buildUser('manager');
        $token = new UsernamePasswordToken($manager, 'main', $manager->getRoles());

        $reporterUser = $this->buildUser('reporter');
        $adminUser = $this->buildUser('admin');

        $this->assertSame(1, $this->voter->vote($token, $reporterUser, ['USER_DELETE']));
        $this->assertSame(-1, $this->voter->vote($token, $adminUser, ['USER_DELETE']));
    }

    public function testTechnicianCannotManageUsers(): void {
        $tech = $this->buildUser('technician');
        $token = new UsernamePasswordToken($tech, 'main', $tech->getRoles());

        $reporterRole = $this->buildRole('reporter');
        $reporterUser = $this->buildUser('reporter');

        $this->assertSame(-1, $this->voter->vote($token, $reporterRole, ['USER_CREATE']));
        $this->assertSame(-1, $this->voter->vote($token, $reporterRole, ['USER_UPDATE']));
        $this->assertSame(-1, $this->voter->vote($token, $reporterUser, ['USER_DELETE']));
    }

    public function testCreateWithNullSubjectDenied(): void {
        $manager = $this->buildUser('manager');
        $token = new UsernamePasswordToken($manager, 'main', $manager->getRoles());

        $this->assertSame(-1, $this->voter->vote($token, null, ['USER_CREATE']));
    }

    private function buildUser(string $roleName): User {
        $role = $this->buildRole($roleName);

        $user = new User();
        $user->setEmail("$roleName@test.com");
        $user->setFirstName('Test');
        $user->setLastName('User');
        $user->setPassword('hash');
        $user->setUserRole($role);

        return $user;
    }

    private function buildRole(string $roleName): UserRole {
        $role = new UserRole();
        $role->setName($roleName);

        return $role;
    }
}
