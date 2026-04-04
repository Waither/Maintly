<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Repository\NotificationRepository;
use App\Repository\WorkOrderRepository;
use DateTimeImmutable;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/realtime', name: 'api_realtime_')]
#[IsGranted('IS_AUTHENTICATED_FULLY')]
class RealtimeController extends AbstractController {
    public function __construct(
        private readonly WorkOrderRepository $workOrderRepository,
        private readonly NotificationRepository $notificationRepository,
    ) {}

    #[Route('/pulse', name: 'pulse', methods: ['GET'])]
    public function pulse(Request $request): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        $filterByUserId = null;
        if ($user->getUserRole()->getName() === 'provider') {
            $filterByUserId = $user->getId();
        }

        $since = $this->parseSince($request->query->get('since'));

        $latestWorkOrderChange = $this->workOrderRepository->getLatestChangeAt($filterByUserId);
        $latestNotification = $this->notificationRepository->getLatestCreatedAtByUser($user);

        $events = [];

        if ($since !== null && $latestWorkOrderChange !== null && $latestWorkOrderChange > $since) {
            $events[] = ['type' => 'work_order.updated', 'ts' => $latestWorkOrderChange->format(DATE_ATOM)];
            $events[] = ['type' => 'dashboard.updated', 'ts' => $latestWorkOrderChange->format(DATE_ATOM)];
        }

        if ($since !== null && $latestNotification !== null && $latestNotification > $since) {
            $events[] = ['type' => 'notification.created', 'ts' => $latestNotification->format(DATE_ATOM)];
            $events[] = ['type' => 'dashboard.updated', 'ts' => $latestNotification->format(DATE_ATOM)];
        }

        return $this->json([
            'serverTime' => (new DateTimeImmutable())->format(DATE_ATOM),
            'signatures' => [
                'workOrders' => $latestWorkOrderChange?->format(DATE_ATOM),
                'notifications' => $latestNotification?->format(DATE_ATOM),
                'unreadCount' => $this->notificationRepository->countUnreadByUser($user),
            ],
            'events' => $events,
        ]);
    }

    private function parseSince(mixed $since): ?DateTimeImmutable {
        if (!is_string($since) || trim($since) === '') {
            return null;
        }

        try {
            return new DateTimeImmutable($since);
        } catch (\Throwable) {
            return null;
        }
    }
}
