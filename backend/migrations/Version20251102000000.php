<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251102000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create translations table for i18n support with English as fallback language';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE translations (
            id INT AUTO_INCREMENT NOT NULL,
            message_key VARCHAR(255) NOT NULL,
            locale VARCHAR(5) NOT NULL,
            text LONGTEXT NOT NULL,
            PRIMARY KEY(id),
            UNIQUE INDEX unique_key_locale (message_key, locale)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE translations');
    }
}
