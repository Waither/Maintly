<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260527143146 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Seed equipment, nav, report and audit log translations';
    }

    public function up(Schema $schema): void
    {
        foreach ($this->translations() as $translation) {
            foreach (['en', 'pl'] as $locale) {
                $this->addSql(
                    'INSERT INTO translations (message_key, locale, text) VALUES (:message_key, :locale, :text) ON DUPLICATE KEY UPDATE text = VALUES(text)',
                    [
                        'message_key' => $translation['key'],
                        'locale' => $locale,
                        'text' => $translation[$locale],
                    ]
                );
            }
        }
    }

    public function down(Schema $schema): void
    {
        foreach ($this->translationKeys() as $key) {
            $this->addSql(
                'DELETE FROM translations WHERE message_key = :message_key AND locale IN (\'en\', \'pl\')',
                ['message_key' => $key]
            );
        }
    }

    /**
     * @return list<array{key: string, en: string, pl: string}>
     */
    private function translations(): array
    {
        return [
            ['key' => 'common.clear', 'en' => 'Clear', 'pl' => 'Wyczyść'],
            ['key' => 'common.details', 'en' => 'Details', 'pl' => 'Szczegóły'],
            ['key' => 'common.preview', 'en' => 'Preview', 'pl' => 'Podgląd'],
            ['key' => 'common.download', 'en' => 'Download', 'pl' => 'Pobierz'],
            ['key' => 'common.createdAt', 'en' => 'Created', 'pl' => 'Utworzono'],
            ['key' => 'common.updatedAt', 'en' => 'Updated', 'pl' => 'Zaktualizowano'],

            ['key' => 'nav.preventive', 'en' => 'Preventive Maintenance', 'pl' => 'Prewencja'],
            ['key' => 'nav.kpi', 'en' => 'KPI', 'pl' => 'KPI'],

            ['key' => 'equipment.listSubtitle', 'en' => 'Total {{count}} items', 'pl' => 'Łącznie {{count}} elementów'],
            ['key' => 'equipment.loadError', 'en' => 'Failed to load equipment', 'pl' => 'Nie udało się załadować sprzętu'],
            ['key' => 'equipment.loading', 'en' => 'Loading equipment...', 'pl' => 'Ładowanie sprzętu...'],
            ['key' => 'equipment.createSuccess', 'en' => 'Equipment created successfully', 'pl' => 'Sprzęt został utworzony'],
            ['key' => 'equipment.updateSuccess', 'en' => 'Equipment updated successfully', 'pl' => 'Sprzęt został zaktualizowany'],
            ['key' => 'equipment.saveError', 'en' => 'Failed to save equipment', 'pl' => 'Nie udało się zapisać sprzętu'],
            ['key' => 'equipment.deleteSuccess', 'en' => 'Equipment deleted successfully', 'pl' => 'Sprzęt został usunięty'],
            ['key' => 'equipment.deleteError', 'en' => 'Failed to delete equipment', 'pl' => 'Nie udało się usunąć sprzętu'],
            ['key' => 'equipment.noEquipment', 'en' => 'No equipment to display', 'pl' => 'Brak sprzętu do wyświetlenia'],
            ['key' => 'equipment.noEquipmentHint', 'en' => 'Add new equipment to get started', 'pl' => 'Dodaj nowy sprzęt aby rozpocząć'],
            ['key' => 'equipment.total', 'en' => 'Total', 'pl' => 'Łącznie'],
            ['key' => 'equipment.rootLevel', 'en' => 'Root level', 'pl' => 'Główne'],
            ['key' => 'equipment.withParent', 'en' => 'With parent', 'pl' => 'Podrzędne'],
            ['key' => 'equipment.directWorkTime', 'en' => 'Direct work time', 'pl' => 'Czas bezpośredni'],
            ['key' => 'equipment.totalWorkTime', 'en' => 'Total work time', 'pl' => 'Łączny czas pracy'],
            ['key' => 'equipment.basicInfo', 'en' => 'Basic information', 'pl' => 'Podstawowe informacje'],
            ['key' => 'equipment.createSubtitle', 'en' => 'Fill in the details below', 'pl' => 'Wypełnij poniższe dane'],
            ['key' => 'equipment.costCenter', 'en' => 'Cost center', 'pl' => 'Centrum kosztów'],
            ['key' => 'equipment.parent', 'en' => 'Parent', 'pl' => 'Element nadrzędny'],
            ['key' => 'equipment.parentEquipment', 'en' => 'Parent equipment', 'pl' => 'Element nadrzędny'],
            ['key' => 'equipment.noParent', 'en' => '— No parent equipment —', 'pl' => '— Brak elementu nadrzędnego —'],
            ['key' => 'equipment.parentHelp', 'en' => 'Select if this equipment is part of another', 'pl' => 'Wybierz jeśli ten sprzęt jest częścią innego'],

            ['key' => 'report.list', 'en' => 'Reports', 'pl' => 'Raporty'],
            ['key' => 'report.listSubtitle', 'en' => 'Total {{count}} reports', 'pl' => 'Łącznie {{count}} raportów'],
            ['key' => 'report.loadError', 'en' => 'Failed to load reports', 'pl' => 'Nie udało się załadować raportów'],
            ['key' => 'report.generate', 'en' => 'Generate Report', 'pl' => 'Generuj raport'],
            ['key' => 'report.generating', 'en' => 'Generating...', 'pl' => 'Generowanie...'],
            ['key' => 'report.generateSuccess', 'en' => 'Report generation started', 'pl' => 'Rozpoczęto generowanie raportu'],
            ['key' => 'report.generateError', 'en' => 'Failed to generate report', 'pl' => 'Nie udało się wygenerować raportu'],
            ['key' => 'report.notReady', 'en' => 'Report is not ready for download', 'pl' => 'Raport nie jest jeszcze gotowy do pobrania'],
            ['key' => 'report.downloadSuccess', 'en' => 'Report downloaded', 'pl' => 'Raport został pobrany'],
            ['key' => 'report.downloadError', 'en' => 'Failed to download report', 'pl' => 'Nie udało się pobrać raportu'],
            ['key' => 'report.previewError', 'en' => 'Failed to preview report', 'pl' => 'Nie udało się wyświetlić podglądu raportu'],
            ['key' => 'report.deleteSuccess', 'en' => 'Report deleted successfully', 'pl' => 'Raport został usunięty'],
            ['key' => 'report.deleteError', 'en' => 'Failed to delete report', 'pl' => 'Nie udało się usunąć raportu'],
            ['key' => 'report.name', 'en' => 'Name', 'pl' => 'Nazwa'],
            ['key' => 'report.type', 'en' => 'Type', 'pl' => 'Typ'],
            ['key' => 'report.format', 'en' => 'Format', 'pl' => 'Format'],
            ['key' => 'report.status', 'en' => 'Status', 'pl' => 'Status'],
            ['key' => 'report.generatedBy', 'en' => 'Generated By', 'pl' => 'Wygenerował'],
            ['key' => 'report.generatedAt', 'en' => 'Date', 'pl' => 'Data'],
            ['key' => 'report.fileSize', 'en' => 'Size', 'pl' => 'Rozmiar'],
            ['key' => 'report.total', 'en' => 'Total', 'pl' => 'Łącznie'],
            ['key' => 'report.completed', 'en' => 'Completed', 'pl' => 'Ukończone'],
            ['key' => 'report.processing', 'en' => 'Processing', 'pl' => 'W trakcie'],
            ['key' => 'report.failed', 'en' => 'Failed', 'pl' => 'Nieudane'],
            ['key' => 'report.noReports', 'en' => 'No reports to display', 'pl' => 'Brak raportów do wyświetlenia'],
            ['key' => 'report.noReportsHint', 'en' => 'Generate a new report to get started', 'pl' => 'Wygeneruj nowy raport, aby rozpocząć'],
            ['key' => 'report.loading', 'en' => 'Loading reports...', 'pl' => 'Ładowanie raportów...'],
            ['key' => 'report.startDate', 'en' => 'Start Date', 'pl' => 'Data początkowa'],
            ['key' => 'report.endDate', 'en' => 'End Date', 'pl' => 'Data końcowa'],

            ['key' => 'auditLog.list', 'en' => 'Audit Logs', 'pl' => 'Logi audytu'],
            ['key' => 'auditLog.listSubtitle', 'en' => 'Total {{count}} entries', 'pl' => 'Łącznie {{count}} wpisów'],
            ['key' => 'auditLog.loadError', 'en' => 'Failed to load audit logs', 'pl' => 'Nie udało się załadować logów audytu'],
            ['key' => 'auditLog.allActions', 'en' => 'All actions', 'pl' => 'Wszystkie akcje'],
            ['key' => 'auditLog.allEntities', 'en' => 'All entities', 'pl' => 'Wszystkie encje'],
            ['key' => 'auditLog.timestamp', 'en' => 'Timestamp', 'pl' => 'Czas'],
            ['key' => 'auditLog.user', 'en' => 'User', 'pl' => 'Użytkownik'],
            ['key' => 'auditLog.action', 'en' => 'Action', 'pl' => 'Akcja'],
            ['key' => 'auditLog.entity', 'en' => 'Entity', 'pl' => 'Encja'],
            ['key' => 'auditLog.entityId', 'en' => 'ID', 'pl' => 'ID'],
            ['key' => 'auditLog.ipAddress', 'en' => 'IP Address', 'pl' => 'Adres IP'],
            ['key' => 'auditLog.system', 'en' => 'System', 'pl' => 'System'],
            ['key' => 'auditLog.total', 'en' => 'Total', 'pl' => 'Łącznie'],
            ['key' => 'auditLog.logins', 'en' => 'Logins', 'pl' => 'Logowania'],
            ['key' => 'auditLog.changes', 'en' => 'Data Changes', 'pl' => 'Zmiany danych'],
            ['key' => 'auditLog.today', 'en' => 'Today', 'pl' => 'Dzisiaj'],
            ['key' => 'auditLog.filterByAction', 'en' => 'Filter by action', 'pl' => 'Filtruj po akcji'],
            ['key' => 'auditLog.filterByEntity', 'en' => 'Filter by entity', 'pl' => 'Filtruj po encji'],
            ['key' => 'auditLog.startDate', 'en' => 'Start date', 'pl' => 'Data początkowa'],
            ['key' => 'auditLog.endDate', 'en' => 'End date', 'pl' => 'Data końcowa'],
            ['key' => 'auditLog.hideSystemLogs', 'en' => 'Hide system logs (show only user actions)', 'pl' => 'Ukryj logi systemowe (pokaż tylko akcje użytkowników)'],
            ['key' => 'auditLog.noLogs', 'en' => 'No audit logs to display', 'pl' => 'Brak logów audytu do wyświetlenia'],
            ['key' => 'auditLog.noLogsHint', 'en' => 'Try changing filters', 'pl' => 'Spróbuj zmienić filtry'],
            ['key' => 'auditLog.loading', 'en' => 'Loading audit logs...', 'pl' => 'Ładowanie logów audytu...'],
            ['key' => 'auditLog.details', 'en' => 'Audit Log Details', 'pl' => 'Szczegóły logu audytu'],
            ['key' => 'auditLog.userAgent', 'en' => 'User Agent', 'pl' => 'User Agent'],
            ['key' => 'auditLog.dataTitle', 'en' => 'Data', 'pl' => 'Dane'],
            ['key' => 'auditLog.changesTitle', 'en' => 'Changes', 'pl' => 'Zmiany'],
            ['key' => 'auditLog.field', 'en' => 'Field', 'pl' => 'Pole'],
            ['key' => 'auditLog.value', 'en' => 'Value', 'pl' => 'Wartość'],
            ['key' => 'auditLog.oldValue', 'en' => 'Old Value', 'pl' => 'Stara wartość'],
            ['key' => 'auditLog.newValue', 'en' => 'New Value', 'pl' => 'Nowa wartość'],
            ['key' => 'auditLog.metadata', 'en' => 'Metadata', 'pl' => 'Metadane'],
        ];
    }

    /**
     * @return list<string>
     */
    private function translationKeys(): array
    {
        return array_values(array_unique(array_map(
            static fn(array $translation): string => $translation['key'],
            $this->translations()
        )));
    }
}
