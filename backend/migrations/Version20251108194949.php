<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251108194949 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE work_order_activities (id INT AUTO_INCREMENT NOT NULL, description LONGTEXT NOT NULL, time_spent INT DEFAULT NULL, completed_at DATETIME DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, deleted_at DATETIME DEFAULT NULL, work_order_id INT NOT NULL, performed_by INT NOT NULL, created_by INT NOT NULL, INDEX IDX_23D6736A582AE764 (work_order_id), INDEX IDX_23D6736A99EB8EA2 (performed_by), INDEX IDX_23D6736ADE12AB56 (created_by), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE work_order_assignments (id INT AUTO_INCREMENT NOT NULL, assigned_at DATETIME NOT NULL, work_order_id INT NOT NULL, user_id INT NOT NULL, assigned_by INT NOT NULL, INDEX IDX_4D1BE9B0582AE764 (work_order_id), INDEX IDX_4D1BE9B0A76ED395 (user_id), INDEX IDX_4D1BE9B061A2AF17 (assigned_by), UNIQUE INDEX unique_work_order_user (work_order_id, user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE work_order_files (id INT AUTO_INCREMENT NOT NULL, file_name VARCHAR(255) NOT NULL, file_type VARCHAR(50) NOT NULL, file_size BIGINT DEFAULT NULL, description LONGTEXT DEFAULT NULL, uploaded_at DATETIME NOT NULL, deleted_at DATETIME DEFAULT NULL, work_order_id INT NOT NULL, uploaded_by INT NOT NULL, INDEX IDX_9A6AD467582AE764 (work_order_id), INDEX IDX_9A6AD467E3E73126 (uploaded_by), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE work_order_priorities (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, color VARCHAR(7) DEFAULT NULL, display_order INT DEFAULT 0 NOT NULL, created_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_4FFE9C585E237E06 (name), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE work_order_statuses (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, color VARCHAR(7) DEFAULT NULL, display_order INT DEFAULT 0 NOT NULL, is_final TINYINT(1) DEFAULT 0 NOT NULL, created_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_8BFCD56C5E237E06 (name), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE work_order_tags (id INT AUTO_INCREMENT NOT NULL, assigned_at DATETIME NOT NULL, work_order_id INT NOT NULL, tag_id INT NOT NULL, assigned_by INT NOT NULL, INDEX IDX_392E03E2582AE764 (work_order_id), INDEX IDX_392E03E2BAD26311 (tag_id), INDEX IDX_392E03E261A2AF17 (assigned_by), UNIQUE INDEX unique_work_order_tag (work_order_id, tag_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE work_orders (id INT AUTO_INCREMENT NOT NULL, unique_code VARCHAR(20) DEFAULT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, planned_start_date DATETIME DEFAULT NULL, planned_end_date DATETIME DEFAULT NULL, actual_start_date DATETIME DEFAULT NULL, actual_end_date DATETIME DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, deleted_at DATETIME DEFAULT NULL, status_id INT NOT NULL, priority_id INT NOT NULL, equipment_id INT NOT NULL, created_by INT NOT NULL, updated_by INT DEFAULT NULL, UNIQUE INDEX UNIQ_4ED63BCCB19D0B94 (unique_code), INDEX IDX_4ED63BCC6BF700BD (status_id), INDEX IDX_4ED63BCC497B19F9 (priority_id), INDEX IDX_4ED63BCC517FE9FE (equipment_id), INDEX IDX_4ED63BCCDE12AB56 (created_by), INDEX IDX_4ED63BCC16FE72E1 (updated_by), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE work_order_activities ADD CONSTRAINT FK_23D6736A582AE764 FOREIGN KEY (work_order_id) REFERENCES work_orders (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE work_order_activities ADD CONSTRAINT FK_23D6736A99EB8EA2 FOREIGN KEY (performed_by) REFERENCES users (id)');
        $this->addSql('ALTER TABLE work_order_activities ADD CONSTRAINT FK_23D6736ADE12AB56 FOREIGN KEY (created_by) REFERENCES users (id)');
        $this->addSql('ALTER TABLE work_order_assignments ADD CONSTRAINT FK_4D1BE9B0582AE764 FOREIGN KEY (work_order_id) REFERENCES work_orders (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE work_order_assignments ADD CONSTRAINT FK_4D1BE9B0A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE work_order_assignments ADD CONSTRAINT FK_4D1BE9B061A2AF17 FOREIGN KEY (assigned_by) REFERENCES users (id)');
        $this->addSql('ALTER TABLE work_order_files ADD CONSTRAINT FK_9A6AD467582AE764 FOREIGN KEY (work_order_id) REFERENCES work_orders (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE work_order_files ADD CONSTRAINT FK_9A6AD467E3E73126 FOREIGN KEY (uploaded_by) REFERENCES users (id)');
        $this->addSql('ALTER TABLE work_order_tags ADD CONSTRAINT FK_392E03E2582AE764 FOREIGN KEY (work_order_id) REFERENCES work_orders (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE work_order_tags ADD CONSTRAINT FK_392E03E2BAD26311 FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE work_order_tags ADD CONSTRAINT FK_392E03E261A2AF17 FOREIGN KEY (assigned_by) REFERENCES users (id)');
        $this->addSql('ALTER TABLE work_orders ADD CONSTRAINT FK_4ED63BCC6BF700BD FOREIGN KEY (status_id) REFERENCES work_order_statuses (id)');
        $this->addSql('ALTER TABLE work_orders ADD CONSTRAINT FK_4ED63BCC497B19F9 FOREIGN KEY (priority_id) REFERENCES work_order_priorities (id)');
        $this->addSql('ALTER TABLE work_orders ADD CONSTRAINT FK_4ED63BCC517FE9FE FOREIGN KEY (equipment_id) REFERENCES equipment (id)');
        $this->addSql('ALTER TABLE work_orders ADD CONSTRAINT FK_4ED63BCCDE12AB56 FOREIGN KEY (created_by) REFERENCES users (id)');
        $this->addSql('ALTER TABLE work_orders ADD CONSTRAINT FK_4ED63BCC16FE72E1 FOREIGN KEY (updated_by) REFERENCES users (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE work_order_activities DROP FOREIGN KEY FK_23D6736A582AE764');
        $this->addSql('ALTER TABLE work_order_activities DROP FOREIGN KEY FK_23D6736A99EB8EA2');
        $this->addSql('ALTER TABLE work_order_activities DROP FOREIGN KEY FK_23D6736ADE12AB56');
        $this->addSql('ALTER TABLE work_order_assignments DROP FOREIGN KEY FK_4D1BE9B0582AE764');
        $this->addSql('ALTER TABLE work_order_assignments DROP FOREIGN KEY FK_4D1BE9B0A76ED395');
        $this->addSql('ALTER TABLE work_order_assignments DROP FOREIGN KEY FK_4D1BE9B061A2AF17');
        $this->addSql('ALTER TABLE work_order_files DROP FOREIGN KEY FK_9A6AD467582AE764');
        $this->addSql('ALTER TABLE work_order_files DROP FOREIGN KEY FK_9A6AD467E3E73126');
        $this->addSql('ALTER TABLE work_order_tags DROP FOREIGN KEY FK_392E03E2582AE764');
        $this->addSql('ALTER TABLE work_order_tags DROP FOREIGN KEY FK_392E03E2BAD26311');
        $this->addSql('ALTER TABLE work_order_tags DROP FOREIGN KEY FK_392E03E261A2AF17');
        $this->addSql('ALTER TABLE work_orders DROP FOREIGN KEY FK_4ED63BCC6BF700BD');
        $this->addSql('ALTER TABLE work_orders DROP FOREIGN KEY FK_4ED63BCC497B19F9');
        $this->addSql('ALTER TABLE work_orders DROP FOREIGN KEY FK_4ED63BCC517FE9FE');
        $this->addSql('ALTER TABLE work_orders DROP FOREIGN KEY FK_4ED63BCCDE12AB56');
        $this->addSql('ALTER TABLE work_orders DROP FOREIGN KEY FK_4ED63BCC16FE72E1');
        $this->addSql('DROP TABLE work_order_activities');
        $this->addSql('DROP TABLE work_order_assignments');
        $this->addSql('DROP TABLE work_order_files');
        $this->addSql('DROP TABLE work_order_priorities');
        $this->addSql('DROP TABLE work_order_statuses');
        $this->addSql('DROP TABLE work_order_tags');
        $this->addSql('DROP TABLE work_orders');
    }
}
