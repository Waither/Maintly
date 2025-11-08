<?php

namespace App\Security\Voter;

use App\Entity\User;
use App\Entity\UserRole;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Voter for User management permissions.
 *
 * Rules:
 * - Admin can manage ALL users (create, update, delete any role)
 * - Manager can manage users with role: technician, provider, reporter (NOT admin, NOT manager)
 * - Technician/Provider/Reporter cannot manage users
 *
 * @extends Voter<string, User|UserRole|null>
 */
class UserManagementVoter extends Voter {
    public const CREATE_USER = 'USER_CREATE';
    public const UPDATE_USER = 'USER_UPDATE';
    public const DELETE_USER = 'USER_DELETE';

    // Role hierarchy levels (lower = more powerful)
    private const ROLE_LEVELS = [
        'admin' => 1,
        'manager' => 2,
        'technician' => 3,
        'provider' => 4,
        'reporter' => 5,
    ];

    protected function supports(string $attribute, mixed $subject): bool {
        // Support only our custom attributes
        return in_array($attribute, [self::CREATE_USER, self::UPDATE_USER, self::DELETE_USER]);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool {
        $currentUser = $token->getUser();

        // User must be logged in
        if (!$currentUser instanceof UserInterface) {
            return false;
        }

        // Get current user's role
        $currentUserRole = $currentUser instanceof User ? $currentUser->getUserRole() : null;
        if (!$currentUserRole) {
            return false;
        }

        $currentRoleName = $currentUserRole->getName();
        $currentRoleLevel = self::ROLE_LEVELS[$currentRoleName] ?? 999;

        // Admin can do EVERYTHING
        if ($currentRoleName === 'admin') {
            return true;
        }

        // For CREATE/UPDATE: $subject is target UserRole (the role being assigned)
        // For DELETE: $subject is target User (the user being deleted)

        switch ($attribute) {
            case self::CREATE_USER:
            case self::UPDATE_USER:
                // $subject is UserRole or role ID
                $targetRole = $subject instanceof UserRole ? $subject : null;
                if (!$targetRole) {
                    return false;
                }

                $targetRoleName = $targetRole->getName();
                $targetRoleLevel = self::ROLE_LEVELS[$targetRoleName] ?? 999;

                // Manager can only create/update users with LOWER level roles (technician, reporter)
                if ($currentRoleName === 'manager') {
                    return $targetRoleLevel > $currentRoleLevel; // Must be lower privilege
                }

                return false;

            case self::DELETE_USER:
                // $subject is User being deleted
                $targetUser = $subject instanceof User ? $subject : null;
                if (!$targetUser || !$targetUser->getUserRole()) {
                    return false;
                }

                $targetRoleName = $targetUser->getUserRole()->getName();
                $targetRoleLevel = self::ROLE_LEVELS[$targetRoleName] ?? 999;

                // Manager can only delete users with LOWER level roles
                if ($currentRoleName === 'manager') {
                    return $targetRoleLevel > $currentRoleLevel;
                }

                return false;
        }

        return false;
    }
}
