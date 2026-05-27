<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use App\Entity\Notification;
use App\Entity\WorkOrder;
use App\Service\RealtimePublisher;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsDoctrineListener(event: Events::postPersist)]
#[AsDoctrineListener(event: Events::postUpdate)]
final readonly class RealtimeEventSubscriber {
    public function __construct(
        private RealtimePublisher $publisher,
    ) {}

    public function postPersist(PostPersistEventArgs $args): void {
        $entity = $args->getObject();

        if ($entity instanceof WorkOrder) {
            $this->publishWorkOrderEvent('work_order.created', $entity);
            return;
        }

        if ($entity instanceof Notification) {
            $this->publishNotificationEvent('notification.created', $entity);
        }
    }

    public function postUpdate(PostUpdateEventArgs $args): void {
        $entity = $args->getObject();

        if ($entity instanceof WorkOrder) {
            $this->publishWorkOrderEvent('work_order.updated', $entity);
            return;
        }

        if ($entity instanceof Notification) {
            $this->publishNotificationEvent('notification.updated', $entity);
        }
    }

    private function publishWorkOrderEvent(string $type, WorkOrder $workOrder): void {
        $payload = $this->buildPayload($workOrder->getId());
        $this->publisher->publish($type, $payload);
        $this->publisher->publish('dashboard.updated');
    }

    private function publishNotificationEvent(string $type, Notification $notification): void {
        $payload = $this->buildPayload($notification->getId());
        $this->publisher->publish($type, $payload);
        $this->publisher->publish('dashboard.updated');
    }

    /**
     * @return array<string, int>
     */
    private function buildPayload(?int $id): array {
        return $id ? ['id' => $id] : [];
    }
}
