<?php

namespace App\Application\Query\User;

use App\Repository\UserRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handler for GetUsersListQuery
 * Returns paginated list of users with their roles.
 */
#[AsMessageHandler(bus: 'query.bus')]
final readonly class GetUsersListHandler {
    public function __construct(
        private UserRepository $userRepository,
    ) {}

    /**
     * @return array{users: \App\Entity\User[], pagination: array{total: int, page: int, limit: int, pages: int}}
     */
    public function __invoke(GetUsersListQuery $query): array {
        $qb = $this->userRepository->createQueryBuilder('u')
            ->leftJoin('u.userRole', 'r')
            ->addSelect('r')
            ->setFirstResult(($query->page - 1) * $query->limit)
            ->setMaxResults($query->limit);

        $users = $qb->getQuery()->getResult();

        // Get total count
        $totalQb = $this->userRepository->createQueryBuilder('u')
            ->select('COUNT(u.id)');
        $total = (int) $totalQb->getQuery()->getSingleScalarResult();

        return [
            'users' => $users,
            'pagination' => [
                'page' => $query->page,
                'limit' => $query->limit,
                'total' => $total,
                'pages' => (int) ceil($total / $query->limit),
            ],
        ];
    }
}
