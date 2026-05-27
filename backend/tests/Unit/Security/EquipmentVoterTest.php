<?php

declare(strict_types=1);

namespace App\Tests\Unit\Security;

use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\UserRole;
use App\Security\Voter\EquipmentVoter;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class EquipmentVoterTest extends TestCase {
    private EquipmentVoter $voter;

    protected function setUp(): void {
        $this->voter = new EquipmentVoter();
    }

    /** @return array<string, array{string, string, bool}> */
    public static function viewProvider(): array {
        return [
            'admin can view' => ['admin', 'EQUIPMENT_VIEW', true],
            'manager can view' => ['manager', 'EQUIPMENT_VIEW', true],
            'technician can view' => ['technician', 'EQUIPMENT_VIEW', true],
            'provider can view' => ['provider', 'EQUIPMENT_VIEW', true],
            'reporter can view' => ['reporter', 'EQUIPMENT_VIEW', true],
        ];
    }

    #[DataProvider('viewProvider')]
    public function testViewAccess(string $roleName, string $attribute, bool $expected): void {
        $this->assertVote($roleName, $attribute, $expected);
    }

    /** @return array<string, array{string, string, bool}> */
    public static function createEditDeleteProvider(): array {
        return [
            'admin can create' => ['admin', 'EQUIPMENT_CREATE', true],
            'manager can create' => ['manager', 'EQUIPMENT_CREATE', true],
            'technician cannot create' => ['technician', 'EQUIPMENT_CREATE', false],
            'provider cannot create' => ['provider', 'EQUIPMENT_CREATE', false],
            'reporter cannot create' => ['reporter', 'EQUIPMENT_CREATE', false],
            'admin can edit' => ['admin', 'EQUIPMENT_EDIT', true],
            'reporter cannot edit' => ['reporter', 'EQUIPMENT_EDIT', false],
            'admin can delete' => ['admin', 'EQUIPMENT_DELETE', true],
            'reporter cannot delete' => ['reporter', 'EQUIPMENT_DELETE', false],
        ];
    }

    #[DataProvider('createEditDeleteProvider')]
    public function testCreateEditDelete(string $roleName, string $attribute, bool $expected): void {
        $this->assertVote($roleName, $attribute, $expected);
    }

    public function testUnsupportedAttributeAbstains(): void {
        $user = $this->buildUser('admin');
        $token = new UsernamePasswordToken($user, 'main', $user->getRoles());

        $result = $this->voter->vote($token, null, ['UNSUPPORTED_ATTR']);

        $this->assertSame(0, $result); // ABSTAIN
    }

    private function assertVote(string $roleName, string $attribute, bool $expected): void {
        $user = $this->buildUser($roleName);
        $token = new UsernamePasswordToken($user, 'main', $user->getRoles());

        $result = $this->voter->vote($token, null, [$attribute]);

        $this->assertSame($expected ? 1 : -1, $result, "Vote for role=$roleName attr=$attribute");
    }

    private function buildUser(string $roleName): User {
        $role = new UserRole();
        $role->setName($roleName);

        $user = new User();
        $user->setEmail("$roleName@test.com");
        $user->setFirstName('Test');
        $user->setLastName('User');
        $user->setPassword('hash');
        $user->setUserRole($role);

        return $user;
    }
}
