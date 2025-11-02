<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Create push_subscriptions table for Web Push notifications
 */
final class Version20251102120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create push_subscriptions table for storing browser push notification subscriptions';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE push_subscriptions (
                id INT AUTO_INCREMENT NOT NULL,
                user_id INT NOT NULL,
                endpoint TEXT NOT NULL,
                public_key TEXT NOT NULL,
                auth_token VARCHAR(255) NOT NULL,
                content_encoding VARCHAR(20) DEFAULT NULL,
                created_at DATETIME NOT NULL,
                last_used_at DATETIME DEFAULT NULL,
                PRIMARY KEY(id),
                UNIQUE KEY unique_endpoint (endpoint(255)),
                INDEX IDX_push_subscriptions_user_id (user_id),
                CONSTRAINT FK_push_subscriptions_user_id FOREIGN KEY (user_id) 
                    REFERENCES users (id) ON DELETE CASCADE
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE push_subscriptions');
    }
}
