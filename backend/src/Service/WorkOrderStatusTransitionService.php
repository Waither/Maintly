<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\WorkOrder;
use App\Entity\WorkOrderStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Validates and enforces allowed status transitions for work orders (State Machine).
 *
 * Allowed transitions:
 *   open        → in_progress, cancelled
 *   in_progress → on_hold, completed, cancelled
 *   on_hold     → in_progress, cancelled
 *   completed   → (none — final)
 *   cancelled   → (none — final)
 */
class WorkOrderStatusTransitionService
{
    /** @var array<string, string[]> */
    private const TRANSITIONS = [
        'open'        => ['in_progress', 'cancelled'],
        'in_progress' => ['on_hold', 'completed', 'cancelled'],
        'on_hold'     => ['in_progress', 'cancelled'],
        'completed'   => [],
        'cancelled'   => [],
    ];

    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    /**
     * Validate that transitioning from the current status to the new status is allowed.
     *
     * @throws UnprocessableEntityHttpException if the transition is not allowed
     */
    public function validateTransition(WorkOrder $workOrder, int $newStatusId): void
    {
        $newStatus = $this->entityManager->getRepository(WorkOrderStatus::class)->find($newStatusId);

        if ($newStatus === null) {
            throw new UnprocessableEntityHttpException('Target status not found.');
        }

        $currentName = $workOrder->getStatus()->getName();
        $newName = $newStatus->getName();

        // Same status — always allowed (no-op)
        if ($currentName === $newName) {
            return;
        }

        $allowed = self::TRANSITIONS[$currentName] ?? null;

        if ($allowed === null) {
            // Unknown current status — allow the transition
            return;
        }

        if (!in_array($newName, $allowed, true)) {
            throw new UnprocessableEntityHttpException(
                sprintf(
                    'Invalid status transition: "%s" → "%s". Allowed: [%s].',
                    $currentName,
                    $newName,
                    implode(', ', $allowed) ?: 'none (final status)'
                )
            );
        }
    }

    /**
     * Return allowed next status names for the given work order.
     *
     * @return string[]
     */
    public function getAllowedTransitions(WorkOrder $workOrder): array
    {
        return self::TRANSITIONS[$workOrder->getStatus()->getName()] ?? [];
    }
}
