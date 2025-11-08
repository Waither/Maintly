<?php

declare(strict_types=1);

namespace App\Security\Voter;

use App\Entity\User;
use App\Entity\WorkOrderPriority;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

/**
 * @extends Voter<string, WorkOrderPriority|null>
 */
class WorkOrderPriorityVoter extends Voter {
    public const VIEW = 'WORKORDER_PRIORITY_VIEW';
    public const CREATE = 'WORKORDER_PRIORITY_CREATE';
    public const EDIT = 'WORKORDER_PRIORITY_EDIT';
    public const DELETE = 'WORKORDER_PRIORITY_DELETE';

    protected function supports(string $attribute, mixed $subject): bool {
        return in_array($attribute, [self::VIEW, self::CREATE, self::EDIT, self::DELETE])
            && ($subject instanceof WorkOrderPriority || $subject === null);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        return match ($attribute) {
            self::VIEW => $this->canView($user),
            self::CREATE => $this->canManage($user),
            self::EDIT => $this->canManage($user),
            self::DELETE => $this->canManage($user),
            default => false,
        };
    }

    private function canView(User $user): bool {
        // All authenticated users can view priorities
        return true;
    }

    private function canManage(User $user): bool {
        // Only admin can create/edit/delete priorities
        return $user->getUserRole()->getName() === 'admin';
    }
}
