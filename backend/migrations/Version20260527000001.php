<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260527000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Fix equipment qrCodeData NULLs and standardise WorkOrder uniqueCode to WO-000001 format';
    }

    public function up(Schema $schema): void
    {
        // Fill NULL qr_code_data for equipment that was created before the double-flush fix
        $this->addSql("UPDATE equipment SET qr_code_data = CONCAT('EQ-', LPAD(id, 6, '0')) WHERE qr_code_data IS NULL");

        // Standardise all work order codes to WO-000001 sequential format
        $this->addSql("UPDATE work_orders SET unique_code = CONCAT('WO-', LPAD(id, 6, '0'))");
    }

    public function down(Schema $schema): void
    {
        // Rollback: clear codes (they will be regenerated on next flush)
        $this->addSql('UPDATE equipment SET qr_code_data = NULL');
        $this->addSql('UPDATE work_orders SET unique_code = NULL');
    }
}
