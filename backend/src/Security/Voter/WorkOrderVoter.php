<?php

declare(strict_types=1);

namespace App\Security\Voter;

use App\Entity\User;
use App\Entity\WorkOrder;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

/**
 * @extends Voter<string, WorkOrder|null>
 */
class WorkOrderVoter extends Voter {
    public const VIEW = 'WORKORDER_VIEW';
    public const CREATE = 'WORKORDER_CREATE';
    public const EDIT = 'WORKORDER_EDIT';
    public const DELETE = 'WORKORDER_DELETE';

    protected function supports(string $attribute, mixed $subject): bool {
        return in_array($attribute, [self::VIEW, self::CREATE, self::EDIT, self::DELETE])
            && ($subject instanceof WorkOrder || $subject === null);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        return match ($attribute) {
            self::VIEW => $this->canView($user, $subject),
            self::CREATE => $this->canCreate($user),
            self::EDIT => $this->canEdit($user, $subject),
            self::DELETE => $this->canDelete($user, $subject),
            default => false,
        };
    }

    private function canView(User $user, ?WorkOrder $workOrder): bool {
        $userRole = $user->getUserRole()->getName();

        // Reporter: can view all work orders (read-only)
        if ($userRole === 'reporter') {
            return true;
        }

        // Provider: can view only own work orders (created_by)
        if ($userRole === 'provider') {
            if ($workOrder === null) {
                // For list endpoint - filtering will be handled in query
                return true;
            }

            return $workOrder->getCreatedBy()->getId() === $user->getId();
        }

        // Admin, Manager, Technician: can view all work orders
        return in_array($userRole, ['admin', 'manager', 'technician']);
    }

    private function canCreate(User $user): bool {
        $userRole = $user->getUserRole()->getName();

        // All authenticated users can create work orders (including reporter for incident reporting)
        return in_array($userRole, ['admin', 'manager', 'technician', 'provider', 'reporter']);
    }

    private function canEdit(User $user, ?WorkOrder $workOrder): bool {
        if ($workOrder === null) {
            return false;
        }

        $userRole = $user->getUserRole()->getName();

        // Reporter: read-only, cannot edit
        if ($userRole === 'reporter') {
            return false;
        }

        // Admin, Manager, Technician: can edit all work orders
        if (in_array($userRole, ['admin', 'manager', 'technician'])) {
            return true;
        }

        // Provider: can edit only own work orders (created_by)
        if ($userRole === 'provider') {
            return $workOrder->getCreatedBy()->getId() === $user->getId();
        }

        return false;
    }

    private function canDelete(User $user, ?WorkOrder $workOrder): bool {
        if ($workOrder === null) {
            return false;
        }

        $userRole = $user->getUserRole()->getName();

        // Only Admin and Manager can delete work orders
        return in_array($userRole, ['admin', 'manager']);
    }
}
