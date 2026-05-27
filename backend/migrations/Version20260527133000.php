<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260527133000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create preventive_maintenance_plans table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE preventive_maintenance_plans (id INT AUTO_INCREMENT NOT NULL, equipment_id INT NOT NULL, priority_id INT NOT NULL, created_by INT NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, interval_days INT NOT NULL, is_active TINYINT(1) NOT NULL DEFAULT 1, next_due_at DATETIME DEFAULT NULL, last_generated_at DATETIME DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, INDEX IDX_2FC73D865171A8A0 (equipment_id), INDEX IDX_2FC73D86897B19A4 (priority_id), INDEX IDX_2FC73D86DE12AB56 (created_by), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE preventive_maintenance_plans ADD CONSTRAINT FK_2FC73D865171A8A0 FOREIGN KEY (equipment_id) REFERENCES equipment (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE preventive_maintenance_plans ADD CONSTRAINT FK_2FC73D86897B19A4 FOREIGN KEY (priority_id) REFERENCES work_order_priorities (id)');
        $this->addSql('ALTER TABLE preventive_maintenance_plans ADD CONSTRAINT FK_2FC73D86DE12AB56 FOREIGN KEY (created_by) REFERENCES users (id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE preventive_maintenance_plans');
    }
}
