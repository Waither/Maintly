<?php

namespace App\Security\Voter;

use App\Entity\Equipment;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Voter for Equipment management permissions.
 *
 * Rules:
 * - Admin: full access (CRUD)
 * - Manager: full access (CRUD)
 * - Technician: read-only
 * - Provider: read-only (will see only their own actions in future)
 * - Reporter: read-only
 *
 * @extends Voter<string, Equipment|null>
 */
class EquipmentVoter extends Voter {
    public const VIEW = 'EQUIPMENT_VIEW';
    public const CREATE = 'EQUIPMENT_CREATE';
    public const EDIT = 'EQUIPMENT_EDIT';
    public const DELETE = 'EQUIPMENT_DELETE';

    protected function supports(string $attribute, mixed $subject): bool {
        return in_array($attribute, [self::VIEW, self::CREATE, self::EDIT, self::DELETE]);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool {
        $user = $token->getUser();

        // User must be logged in
        if (!$user instanceof UserInterface) {
            return false;
        }

        // Get user's role
        $currentUser = $user instanceof User ? $user : null;
        if (!$currentUser) {
            return false;
        }

        $userRole = $currentUser->getUserRole();
        if (!$userRole) {
            return false;
        }

        $roleName = $userRole->getName();

        return match ($attribute) {
            self::VIEW => $this->canView($roleName),
            self::CREATE => $this->canCreate($roleName),
            self::EDIT => $this->canEdit($roleName),
            self::DELETE => $this->canDelete($roleName),
            default => false,
        };
    }

    private function canView(string $roleName): bool {
        // Everyone can view
        return in_array($roleName, ['admin', 'manager', 'technician', 'provider', 'reporter']);
    }

    private function canCreate(string $roleName): bool {
        // Only admin and manager
        return in_array($roleName, ['admin', 'manager']);
    }

    private function canEdit(string $roleName): bool {
        // Only admin and manager
        return in_array($roleName, ['admin', 'manager']);
    }

    private function canDelete(string $roleName): bool {
        // Only admin and manager
        return in_array($roleName, ['admin', 'manager']);
    }
}
