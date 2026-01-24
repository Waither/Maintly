<?php

namespace App\EventListener;

use App\Entity\AuditLog;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Updates user's lastLoginAt timestamp when JWT token is created (on login).
 * Also creates an audit log entry for the login.
 */
#[AsEventListener(event: 'lexik_jwt_authentication.on_jwt_created')]
class JWTCreatedListener {
    public function __construct(
        private EntityManagerInterface $em,
        private RequestStack $requestStack,
    ) {}

    public function __invoke(JWTCreatedEvent $event): void {
        $user = $event->getUser();

        if (!$user instanceof User) {
            return;
        }

        // Update last login timestamp
        $user->setLastLoginAt(new DateTimeImmutable());

        // Create audit log entry for login
        $request = $this->requestStack->getCurrentRequest();

        $auditLog = new AuditLog();
        $auditLog->setUser($user);
        $auditLog->setAction('login');
        $auditLog->setEntityType('User');
        $auditLog->setEntityId($user->getId());
        $auditLog->setChanges([]);
        $auditLog->setIpAddress($request?->getClientIp());
        $auditLog->setUserAgent($request?->headers->get('User-Agent'));

        $this->em->persist($auditLog);
        $this->em->flush();
    }
}
