<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251101203136 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_user_role DROP FOREIGN KEY `FK_2D084B478E0E3CA6`');
        $this->addSql('ALTER TABLE user_user_role DROP FOREIGN KEY `FK_2D084B47A76ED395`');
        $this->addSql('DROP TABLE user_user_role');
        $this->addSql('ALTER TABLE users ADD user_role_id INT NOT NULL');
        $this->addSql('ALTER TABLE users ADD CONSTRAINT FK_1483A5E98E0E3CA6 FOREIGN KEY (user_role_id) REFERENCES user_roles (id)');
        $this->addSql('CREATE INDEX IDX_1483A5E98E0E3CA6 ON users (user_role_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_user_role (user_id INT NOT NULL, user_role_id INT NOT NULL, INDEX IDX_2D084B47A76ED395 (user_id), INDEX IDX_2D084B478E0E3CA6 (user_role_id), PRIMARY KEY (user_id, user_role_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE user_user_role ADD CONSTRAINT `FK_2D084B478E0E3CA6` FOREIGN KEY (user_role_id) REFERENCES user_roles (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE user_user_role ADD CONSTRAINT `FK_2D084B47A76ED395` FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE users DROP FOREIGN KEY FK_1483A5E98E0E3CA6');
        $this->addSql('DROP INDEX IDX_1483A5E98E0E3CA6 ON users');
        $this->addSql('ALTER TABLE users DROP user_role_id');
    }
}
