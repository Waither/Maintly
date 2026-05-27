<?php

declare(strict_types=1);

namespace App\Tests\Unit\Service;

use App\Entity\AuditLog;
use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\UserRole;
use App\Service\AuditLogger;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class AuditLoggerTest extends TestCase {
    private EntityManagerInterface $em;
    private TokenStorageInterface $tokenStorage;
    private RequestStack $requestStack;
    private AuditLogger $logger;

    protected function setUp(): void {
        $this->em = $this->createMock(EntityManagerInterface::class);
        $this->tokenStorage = $this->createMock(TokenStorageInterface::class);
        $this->requestStack = new RequestStack();
        $this->logger = new AuditLogger($this->em, $this->tokenStorage, $this->requestStack);
    }

    public function testLogPersistsAndFlushes(): void {
        $this->em->expects($this->once())->method('persist')
            ->with($this->isInstanceOf(AuditLog::class));
        $this->em->expects($this->once())->method('flush');

        $this->logger->log('test_action', 'Equipment', 5, ['name' => 'new'], ['meta' => 'val']);
    }

    public function testLogUsesTokenUserWhenNoUserProvided(): void {
        $user = $this->buildUser('admin');
        $token = $this->createMock(TokenInterface::class);
        $token->method('getUser')->willReturn($user);
        $this->tokenStorage->method('getToken')->willReturn($token);

        $this->em->expects($this->once())->method('persist')
            ->with($this->callback(function (AuditLog $log) use ($user) {
                return $log->getUser() === $user;
            }));
        $this->em->expects($this->once())->method('flush');

        $this->logger->log('action');
    }

    public function testLogUsesExplicitUserOverToken(): void {
        $explicitUser = $this->buildUser('manager');
        $tokenUser = $this->buildUser('admin');

        $token = $this->createMock(TokenInterface::class);
        $token->method('getUser')->willReturn($tokenUser);
        $this->tokenStorage->method('getToken')->willReturn($token);

        $this->em->expects($this->once())->method('persist')
            ->with($this->callback(function (AuditLog $log) use ($explicitUser) {
                return $log->getUser() === $explicitUser;
            }));
        $this->em->expects($this->once())->method('flush');

        $this->logger->log('action', user: $explicitUser);
    }

    public function testLogSetsIpAndUserAgentFromRequest(): void {
        $request = Request::create('/test', 'GET');
        $request->headers->set('User-Agent', 'Mozilla/5.0');
        $this->requestStack->push($request);

        $this->em->expects($this->once())->method('persist')
            ->with($this->callback(function (AuditLog $log) {
                return $log->getUserAgent() === 'Mozilla/5.0';
            }));
        $this->em->expects($this->once())->method('flush');

        $this->logger->log('action');
    }

    public function testLogCreated(): void {
        $equipment = new Equipment();
        // Set id via reflection
        $ref = new \ReflectionProperty($equipment, 'id');
        $ref->setAccessible(true);
        $ref->setValue($equipment, 42);

        $this->em->expects($this->once())->method('persist')
            ->with($this->callback(function (AuditLog $log) {
                return $log->getAction() === 'created'
                    && $log->getEntityType() === 'Equipment'
                    && $log->getEntityId() === 42;
            }));
        $this->em->expects($this->once())->method('flush');

        $this->logger->logCreated($equipment);
    }

    public function testLogUpdated(): void {
        $equipment = new Equipment();
        $ref = new \ReflectionProperty($equipment, 'id');
        $ref->setAccessible(true);
        $ref->setValue($equipment, 7);

        $changes = ['name' => ['old', 'new']];

        $this->em->expects($this->once())->method('persist')
            ->with($this->callback(function (AuditLog $log) use ($changes) {
                return $log->getAction() === 'updated'
                    && $log->getChanges() === $changes;
            }));
        $this->em->expects($this->once())->method('flush');

        $this->logger->logUpdated($equipment, $changes);
    }

    public function testLogDeleted(): void {
        $equipment = new Equipment();
        $ref = new \ReflectionProperty($equipment, 'id');
        $ref->setAccessible(true);
        $ref->setValue($equipment, 3);

        $this->em->expects($this->once())->method('persist')
            ->with($this->callback(function (AuditLog $log) {
                return $log->getAction() === 'deleted'
                    && $log->getEntityType() === 'Equipment';
            }));
        $this->em->expects($this->once())->method('flush');

        $this->logger->logDeleted($equipment);
    }

    public function testLogAction(): void {
        $this->em->expects($this->once())->method('persist')
            ->with($this->callback(function (AuditLog $log) {
                return $log->getAction() === 'custom_action';
            }));
        $this->em->expects($this->once())->method('flush');

        $this->logger->logAction('custom_action', ['extra' => 'data']);
    }

    public function testNoTokenDoesNotThrow(): void {
        $this->tokenStorage->method('getToken')->willReturn(null);

        $this->em->expects($this->once())->method('persist');
        $this->em->expects($this->once())->method('flush');

        $this->logger->log('action');
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
