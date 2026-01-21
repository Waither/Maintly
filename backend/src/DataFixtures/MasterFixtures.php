<?php

declare(strict_types=1);

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

/**
 * Master Fixtures - Runs first (empty, just for dependency ordering)
 * 
 * Database purging is handled by Doctrine's built-in purger.
 * This fixture exists to ensure proper ordering via dependencies.
 * 
 * Use: php bin/console doctrine:fixtures:load --purge-with-truncate
 */
class MasterFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Empty - this fixture exists only for dependency ordering
        // Database purging is done by Doctrine before loading fixtures
    }
}
