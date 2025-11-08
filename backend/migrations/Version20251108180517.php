<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251108180517 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE equipment (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, cost_center INT NOT NULL, direct_work_time INT DEFAULT 0 NOT NULL, total_work_time INT DEFAULT 0 NOT NULL, qr_code_data VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, deleted_at DATETIME DEFAULT NULL, parent_equipment_id INT DEFAULT NULL, created_by INT NOT NULL, updated_by INT DEFAULT NULL, UNIQUE INDEX UNIQ_D338D583577AB00F (qr_code_data), INDEX IDX_D338D583111B4D0 (parent_equipment_id), INDEX IDX_D338D583DE12AB56 (created_by), INDEX IDX_D338D58316FE72E1 (updated_by), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE equipment_custom_fields (id INT AUTO_INCREMENT NOT NULL, field_name VARCHAR(100) NOT NULL, field_type VARCHAR(20) NOT NULL, field_options JSON DEFAULT NULL, is_required TINYINT(1) DEFAULT 0 NOT NULL, default_value LONGTEXT DEFAULT NULL, display_order INT DEFAULT 0 NOT NULL, is_active TINYINT(1) DEFAULT 1 NOT NULL, created_at DATETIME NOT NULL, deleted_at DATETIME DEFAULT NULL, created_by INT NOT NULL, UNIQUE INDEX UNIQ_2A5DD2AE4DEF17BC (field_name), INDEX IDX_2A5DD2AEDE12AB56 (created_by), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE equipment_custom_values (id INT AUTO_INCREMENT NOT NULL, value LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, equipment_id INT NOT NULL, custom_field_id INT NOT NULL, INDEX IDX_6E1F7DC0517FE9FE (equipment_id), INDEX IDX_6E1F7DC0A1E5E0D4 (custom_field_id), UNIQUE INDEX unique_equipment_custom_field (equipment_id, custom_field_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE equipment_files (id INT AUTO_INCREMENT NOT NULL, file_name VARCHAR(255) NOT NULL, file_type VARCHAR(50) NOT NULL, file_size BIGINT DEFAULT NULL, description LONGTEXT DEFAULT NULL, uploaded_at DATETIME NOT NULL, deleted_at DATETIME DEFAULT NULL, equipment_id INT NOT NULL, uploaded_by INT NOT NULL, INDEX IDX_EF6C61BD517FE9FE (equipment_id), INDEX IDX_EF6C61BDE3E73126 (uploaded_by), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE equipment_tags (id INT AUTO_INCREMENT NOT NULL, assigned_at DATETIME NOT NULL, equipment_id INT NOT NULL, tag_id INT NOT NULL, assigned_by INT NOT NULL, INDEX IDX_55384520517FE9FE (equipment_id), INDEX IDX_55384520BAD26311 (tag_id), INDEX IDX_5538452061A2AF17 (assigned_by), UNIQUE INDEX unique_equipment_tag (equipment_id, tag_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE tag_groups (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(100) NOT NULL, is_required TINYINT(1) DEFAULT 0 NOT NULL, is_single_choice TINYINT(1) DEFAULT 0 NOT NULL, display_order INT DEFAULT 0 NOT NULL, created_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_192C705C5E237E06 (name), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE tags (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(100) NOT NULL, color VARCHAR(7) DEFAULT NULL, created_at DATETIME NOT NULL, tag_group_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_6FBC94265E237E06 (name), INDEX IDX_6FBC9426C865A29C (tag_group_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE equipment ADD CONSTRAINT FK_D338D583111B4D0 FOREIGN KEY (parent_equipment_id) REFERENCES equipment (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE equipment ADD CONSTRAINT FK_D338D583DE12AB56 FOREIGN KEY (created_by) REFERENCES users (id)');
        $this->addSql('ALTER TABLE equipment ADD CONSTRAINT FK_D338D58316FE72E1 FOREIGN KEY (updated_by) REFERENCES users (id)');
        $this->addSql('ALTER TABLE equipment_custom_fields ADD CONSTRAINT FK_2A5DD2AEDE12AB56 FOREIGN KEY (created_by) REFERENCES users (id)');
        $this->addSql('ALTER TABLE equipment_custom_values ADD CONSTRAINT FK_6E1F7DC0517FE9FE FOREIGN KEY (equipment_id) REFERENCES equipment (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE equipment_custom_values ADD CONSTRAINT FK_6E1F7DC0A1E5E0D4 FOREIGN KEY (custom_field_id) REFERENCES equipment_custom_fields (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE equipment_files ADD CONSTRAINT FK_EF6C61BD517FE9FE FOREIGN KEY (equipment_id) REFERENCES equipment (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE equipment_files ADD CONSTRAINT FK_EF6C61BDE3E73126 FOREIGN KEY (uploaded_by) REFERENCES users (id)');
        $this->addSql('ALTER TABLE equipment_tags ADD CONSTRAINT FK_55384520517FE9FE FOREIGN KEY (equipment_id) REFERENCES equipment (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE equipment_tags ADD CONSTRAINT FK_55384520BAD26311 FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE equipment_tags ADD CONSTRAINT FK_5538452061A2AF17 FOREIGN KEY (assigned_by) REFERENCES users (id)');
        $this->addSql('ALTER TABLE tags ADD CONSTRAINT FK_6FBC9426C865A29C FOREIGN KEY (tag_group_id) REFERENCES tag_groups (id) ON DELETE SET NULL');
        $this->addSql('DROP TABLE refresh_tokens');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE refresh_tokens (id INT AUTO_INCREMENT NOT NULL, refresh_token VARCHAR(128) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, username VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, valid DATETIME NOT NULL, UNIQUE INDEX UNIQ_9BACE7E1C74F2195 (refresh_token), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE equipment DROP FOREIGN KEY FK_D338D583111B4D0');
        $this->addSql('ALTER TABLE equipment DROP FOREIGN KEY FK_D338D583DE12AB56');
        $this->addSql('ALTER TABLE equipment DROP FOREIGN KEY FK_D338D58316FE72E1');
        $this->addSql('ALTER TABLE equipment_custom_fields DROP FOREIGN KEY FK_2A5DD2AEDE12AB56');
        $this->addSql('ALTER TABLE equipment_custom_values DROP FOREIGN KEY FK_6E1F7DC0517FE9FE');
        $this->addSql('ALTER TABLE equipment_custom_values DROP FOREIGN KEY FK_6E1F7DC0A1E5E0D4');
        $this->addSql('ALTER TABLE equipment_files DROP FOREIGN KEY FK_EF6C61BD517FE9FE');
        $this->addSql('ALTER TABLE equipment_files DROP FOREIGN KEY FK_EF6C61BDE3E73126');
        $this->addSql('ALTER TABLE equipment_tags DROP FOREIGN KEY FK_55384520517FE9FE');
        $this->addSql('ALTER TABLE equipment_tags DROP FOREIGN KEY FK_55384520BAD26311');
        $this->addSql('ALTER TABLE equipment_tags DROP FOREIGN KEY FK_5538452061A2AF17');
        $this->addSql('ALTER TABLE tags DROP FOREIGN KEY FK_6FBC9426C865A29C');
        $this->addSql('DROP TABLE equipment');
        $this->addSql('DROP TABLE equipment_custom_fields');
        $this->addSql('DROP TABLE equipment_custom_values');
        $this->addSql('DROP TABLE equipment_files');
        $this->addSql('DROP TABLE equipment_tags');
        $this->addSql('DROP TABLE tag_groups');
        $this->addSql('DROP TABLE tags');
    }
}
