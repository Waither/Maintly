<?php

namespace App\Controller;

use App\Controller\ApiResponseTrait;
use App\Entity\Notification;
use App\Repository\NotificationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * API endpoints for user notifications (bell icon with unread count)
 */
#[Route('/api/notifications')]
#[IsGranted('ROLE_USER')]
class NotificationController extends AbstractController {
    use ApiResponseTrait;

    public function __construct(
        private readonly NotificationRepository $notificationRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {}

    /**
     * Get list of notifications for current user
     */
    #[Route('', name: 'api_notifications_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse {
        $user = $this->getUser();
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(100, max(1, (int) $request->query->get('limit', 20)));
        $onlyUnread = $request->query->getBoolean('unread', false);

        $offset = ($page - 1) * $limit;

        if ($onlyUnread) {
            $notifications = $this->notificationRepository->findUnreadByUser($user, $limit);
            $total = $this->notificationRepository->countUnreadByUser($user);
        } else {
            $notifications = $this->notificationRepository->findByUser($user, $limit, $offset);
            $total = $this->notificationRepository->countByUser($user);
        }

        return $this->successResponse(
            data: [
                'notifications' => array_map(
                    fn(Notification $n) => [
                        'id' => $n->getId(),
                        'type' => $n->getType(),
                        'title' => $n->getTitle(),
                        'message' => $n->getMessage(),
                        'data' => $n->getData(),
                        'isRead' => $n->isRead(),
                        'createdAt' => $n->getCreatedAt()->format('Y-m-d H:i:s'),
                        'readAt' => $n->getReadAt()?->format('Y-m-d H:i:s'),
                    ],
                    $notifications
                ),
                'pagination' => [
                    'total' => $total,
                    'page' => $page,
                    'limit' => $limit,
                    'totalPages' => (int) ceil($total / $limit),
                ],
            ],
            message: 'notification.list.retrieved'
        );
    }

    /**
     * Get unread notification count (for bell badge)
     */
    #[Route('/unread-count', name: 'api_notifications_unread_count', methods: ['GET'])]
    public function unreadCount(): JsonResponse {
        $user = $this->getUser();
        $count = $this->notificationRepository->countUnreadByUser($user);

        return $this->successResponse(
            data: ['count' => $count],
            message: 'notification.unread_count.retrieved'
        );
    }

    /**
     * Mark single notification as read
     */
    #[Route('/{id}/read', name: 'api_notifications_mark_read', methods: ['PATCH'])]
    public function markAsRead(int $id): JsonResponse {
        $user = $this->getUser();
        $notification = $this->notificationRepository->find($id);

        if (!$notification) {
            return $this->notFoundResponse('notification.not_found');
        }

        if ($notification->getUser()->getId() !== $user->getId()) {
            return $this->forbiddenResponse('notification.access_denied');
        }

        if (!$notification->isRead()) {
            $notification->markAsRead();
            $this->entityManager->flush();
        }

        return $this->successResponse(
            data: [
                'id' => $notification->getId(),
                'isRead' => $notification->isRead(),
                'readAt' => $notification->getReadAt()?->format('Y-m-d H:i:s'),
            ],
            message: 'notification.marked_as_read'
        );
    }

    /**
     * Mark all notifications as read for current user
     */
    #[Route('/mark-all-read', name: 'api_notifications_mark_all_read', methods: ['PATCH'])]
    public function markAllAsRead(): JsonResponse {
        $user = $this->getUser();
        $updated = $this->notificationRepository->markAllAsReadForUser($user);

        return $this->successResponse(
            data: ['updated' => $updated],
            message: 'notification.all_marked_as_read'
        );
    }

    /**
     * Delete a notification
     */
    #[Route('/{id}', name: 'api_notifications_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse {
        $user = $this->getUser();
        $notification = $this->notificationRepository->find($id);

        if (!$notification) {
            return $this->notFoundResponse('notification.not_found');
        }

        if ($notification->getUser()->getId() !== $user->getId()) {
            return $this->forbiddenResponse('notification.access_denied');
        }

        $this->entityManager->remove($notification);
        $this->entityManager->flush();

        return $this->successResponse(
            message: 'notification.deleted'
        );
    }

    /**
     * Get single notification details
     */
    #[Route('/{id}', name: 'api_notifications_show', methods: ['GET'])]
    public function show(int $id): JsonResponse {
        $user = $this->getUser();
        $notification = $this->notificationRepository->find($id);

        if (!$notification) {
            return $this->notFoundResponse('notification.not_found');
        }

        if ($notification->getUser()->getId() !== $user->getId()) {
            return $this->forbiddenResponse('notification.access_denied');
        }

        return $this->successResponse(
            data: [
                'notification' => [
                    'id' => $notification->getId(),
                    'type' => $notification->getType(),
                    'title' => $notification->getTitle(),
                    'message' => $notification->getMessage(),
                    'data' => $notification->getData(),
                    'isRead' => $notification->isRead(),
                    'createdAt' => $notification->getCreatedAt()->format('Y-m-d H:i:s'),
                    'readAt' => $notification->getReadAt()?->format('Y-m-d H:i:s'),
                ],
            ],
            message: 'notification.retrieved'
        );
    }
}
