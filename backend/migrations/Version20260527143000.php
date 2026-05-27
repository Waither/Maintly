<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260527143000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Seed PM, KPI and user translations';
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
            ['key' => 'pm.title', 'en' => 'Preventive Maintenance (PM)', 'pl' => 'Prewencja (PM)'],
            ['key' => 'pm.subtitle', 'en' => 'Planning and automatic generation of preventive work orders', 'pl' => 'Planowanie i automatyczne generowanie zleceń prewencyjnych'],
            ['key' => 'pm.loadError', 'en' => 'Failed to load preventive maintenance plans.', 'pl' => 'Nie udało się załadować planów prewencji.'],
            ['key' => 'pm.validationError', 'en' => 'Fill in the required fields and correct the interval.', 'pl' => 'Uzupełnij wymagane pola i popraw interwał.'],
            ['key' => 'pm.createSuccess', 'en' => 'Preventive plan has been added.', 'pl' => 'Plan prewencji został dodany.'],
            ['key' => 'pm.createError', 'en' => 'Failed to add preventive plan.', 'pl' => 'Nie udało się dodać planu prewencji.'],
            ['key' => 'pm.generateSuccess', 'en' => 'Preventive work order generated.', 'pl' => 'Wygenerowano zlecenie prewencyjne.'],
            ['key' => 'pm.generateError', 'en' => 'Failed to generate work order.', 'pl' => 'Nie udało się wygenerować zlecenia.'],
            ['key' => 'pm.runDueSuccess', 'en' => 'Generated {{generated}} work orders from overdue plans.', 'pl' => 'Wygenerowano {{generated}} zleceń z planów zaległych.'],
            ['key' => 'pm.runDueError', 'en' => 'Failed to run overdue plans.', 'pl' => 'Nie udało się uruchomić zaległych planów.'],
            ['key' => 'pm.statusUpdated', 'en' => 'Plan status updated.', 'pl' => 'Zmieniono status planu.'],
            ['key' => 'pm.statusUpdateError', 'en' => 'Failed to update plan status.', 'pl' => 'Nie udało się zmienić statusu planu.'],
            ['key' => 'pm.confirmDelete', 'en' => 'Delete plan "{{title}}"?', 'pl' => 'Usunąć plan "{{title}}"?'],
            ['key' => 'pm.deleteSuccess', 'en' => 'Plan has been deleted.', 'pl' => 'Plan został usunięty.'],
            ['key' => 'pm.deleteError', 'en' => 'Failed to delete plan.', 'pl' => 'Nie udało się usunąć planu.'],
            ['key' => 'pm.running', 'en' => 'Running...', 'pl' => 'Uruchamianie...'],
            ['key' => 'pm.runDue', 'en' => 'Run overdue', 'pl' => 'Uruchom zaległe'],
            ['key' => 'pm.totalPlans', 'en' => 'All plans', 'pl' => 'Wszystkie plany'],
            ['key' => 'pm.activePlans', 'en' => 'Active plans', 'pl' => 'Aktywne plany'],
            ['key' => 'pm.duePlans', 'en' => 'To run now', 'pl' => 'Do uruchomienia teraz'],
            ['key' => 'pm.createPlan', 'en' => 'Add preventive plan', 'pl' => 'Dodaj plan prewencji'],
            ['key' => 'pm.planTitle', 'en' => 'Plan name', 'pl' => 'Nazwa planu'],
            ['key' => 'pm.description', 'en' => 'Description', 'pl' => 'Opis'],
            ['key' => 'pm.equipment', 'en' => 'Equipment', 'pl' => 'Sprzęt'],
            ['key' => 'pm.selectEquipment', 'en' => 'Select equipment', 'pl' => 'Wybierz sprzęt'],
            ['key' => 'pm.priority', 'en' => 'Priority', 'pl' => 'Priorytet'],
            ['key' => 'pm.selectPriority', 'en' => 'Select priority', 'pl' => 'Wybierz priorytet'],
            ['key' => 'pm.frequency', 'en' => 'Frequency', 'pl' => 'Częstotliwość'],
            ['key' => 'pm.weekly', 'en' => 'Weekly (7 days)', 'pl' => 'Co tydzień (7 dni)'],
            ['key' => 'pm.biweekly', 'en' => 'Every 2 weeks (14 days)', 'pl' => 'Co 2 tygodnie (14 dni)'],
            ['key' => 'pm.monthly', 'en' => 'Monthly (30 days)', 'pl' => 'Co miesiąc (30 dni)'],
            ['key' => 'pm.quarterly', 'en' => 'Quarterly (90 days)', 'pl' => 'Co kwartał (90 dni)'],
            ['key' => 'pm.custom', 'en' => 'Custom interval', 'pl' => 'Własny interwał'],
            ['key' => 'pm.intervalDays', 'en' => 'Interval (days)', 'pl' => 'Interwał (dni)'],
            ['key' => 'pm.firstDueAt', 'en' => 'First due date (optional)', 'pl' => 'Pierwszy termin (opcjonalnie)'],
            ['key' => 'pm.isActive', 'en' => 'Plan is active', 'pl' => 'Plan aktywny'],
            ['key' => 'pm.creating', 'en' => 'Saving...', 'pl' => 'Zapisywanie...'],
            ['key' => 'pm.create', 'en' => 'Add plan', 'pl' => 'Dodaj plan'],
            ['key' => 'pm.currentPlans', 'en' => 'Current preventive plans', 'pl' => 'Aktualne plany prewencji'],
            ['key' => 'pm.noPlans', 'en' => 'No preventive plans. Add the first plan on the left side.', 'pl' => 'Brak planów prewencji. Dodaj pierwszy plan po lewej stronie.'],
            ['key' => 'pm.plan', 'en' => 'Plan', 'pl' => 'Plan'],
            ['key' => 'pm.interval', 'en' => 'Interval', 'pl' => 'Interwał'],
            ['key' => 'pm.nextDue', 'en' => 'Next due', 'pl' => 'Następny termin'],
            ['key' => 'pm.status', 'en' => 'Status', 'pl' => 'Status'],
            ['key' => 'pm.dueNowBadge', 'en' => 'DUE', 'pl' => 'TERMIN'],
            ['key' => 'pm.active', 'en' => 'Active', 'pl' => 'Aktywny'],
            ['key' => 'pm.inactive', 'en' => 'Inactive', 'pl' => 'Nieaktywny'],
            ['key' => 'pm.generate', 'en' => 'Generate work order', 'pl' => 'Wygeneruj zlecenie'],

            ['key' => 'kpi.title', 'en' => 'KPI and analytics', 'pl' => 'KPI i analityka'],
            ['key' => 'kpi.loading', 'en' => 'Loading data...', 'pl' => 'Ładowanie danych...'],
            ['key' => 'kpi.actions.refresh', 'en' => 'Refresh', 'pl' => 'Odśwież'],
            ['key' => 'kpi.filters.from', 'en' => 'From', 'pl' => 'Od'],
            ['key' => 'kpi.filters.to', 'en' => 'To', 'pl' => 'Do'],
            ['key' => 'kpi.period.label', 'en' => 'Data for period:', 'pl' => 'Dane za okres:'],
            ['key' => 'kpi.period.labelShort', 'en' => 'Period:', 'pl' => 'Zakres:'],
            ['key' => 'kpi.period.from', 'en' => 'Period from', 'pl' => 'Zakres od'],
            ['key' => 'kpi.period.to', 'en' => 'Period to', 'pl' => 'Zakres do'],
            ['key' => 'kpi.errors.invalidRange', 'en' => 'Start date must be earlier than or equal to end date.', 'pl' => 'Data początkowa musi być wcześniejsza lub równa dacie końcowej.'],
            ['key' => 'kpi.errors.loadFailed', 'en' => 'Failed to load KPI data.', 'pl' => 'Nie udało się załadować danych KPI.'],
            ['key' => 'kpi.empty.period', 'en' => 'No data for the selected period.', 'pl' => 'Brak danych dla wybranego okresu.'],
            ['key' => 'kpi.cards.total', 'en' => 'All work orders', 'pl' => 'Wszystkich zgłoszeń'],
            ['key' => 'kpi.cards.totalShort', 'en' => 'All', 'pl' => 'Wszystkich'],
            ['key' => 'kpi.cards.overdue', 'en' => 'Overdue', 'pl' => 'Zaległe'],
            ['key' => 'kpi.cards.effectiveness', 'en' => 'effectiveness', 'pl' => 'skuteczność'],
            ['key' => 'kpi.cards.mttrSub', 'en' => 'Avg. repair time', 'pl' => 'Śr. czas naprawy'],
            ['key' => 'kpi.cards.mtbfSub', 'en' => 'Avg. time between failures', 'pl' => 'Śr. czas między awariami'],
            ['key' => 'kpi.sections.summary', 'en' => 'Summary', 'pl' => 'Podsumowanie'],
            ['key' => 'kpi.sections.statuses', 'en' => 'Statuses', 'pl' => 'Statusy'],
            ['key' => 'kpi.sections.statusesChart', 'en' => 'Work order statuses', 'pl' => 'Statusy zgłoszeń'],
            ['key' => 'kpi.sections.byPriority', 'en' => 'Work orders by priority', 'pl' => 'Zgłoszenia wg priorytetu'],
            ['key' => 'kpi.sections.topEquipment', 'en' => 'Top equipment', 'pl' => 'Top urządzenia'],
            ['key' => 'kpi.sections.topEquipmentChart', 'en' => 'Top 8 equipment by work orders', 'pl' => 'Top 8 urządzeń — liczba zgłoszeń'],
            ['key' => 'kpi.sections.topWorkTime', 'en' => 'Top work time', 'pl' => 'Top czas pracy'],
            ['key' => 'kpi.sections.topWorkTimeChart', 'en' => 'Equipment with highest work time', 'pl' => 'Urządzenia z największym czasem pracy'],
            ['key' => 'kpi.sections.trend', 'en' => 'Trend', 'pl' => 'Trend'],
            ['key' => 'kpi.sections.trendMonthly', 'en' => 'Work order trend (monthly)', 'pl' => 'Trend zgłoszeń (miesięcznie)'],
            ['key' => 'kpi.sections.trendMonthlyShort', 'en' => 'Monthly trend', 'pl' => 'Trend miesięczny'],
            ['key' => 'kpi.sections.metrics', 'en' => 'KPI metrics', 'pl' => 'Wskaźniki KPI'],
            ['key' => 'kpi.common.metric', 'en' => 'Metric', 'pl' => 'Metryka'],
            ['key' => 'kpi.common.value', 'en' => 'Value', 'pl' => 'Wartość'],
            ['key' => 'kpi.common.count', 'en' => 'Count', 'pl' => 'Ilość'],
            ['key' => 'kpi.common.month', 'en' => 'Month', 'pl' => 'Miesiąc'],
            ['key' => 'kpi.trend.created', 'en' => 'Created', 'pl' => 'Utworzone'],
            ['key' => 'kpi.trend.completed', 'en' => 'Completed', 'pl' => 'Zakończone'],
            ['key' => 'kpi.charts.workOrdersCount', 'en' => 'Work orders count', 'pl' => 'Liczba zgłoszeń'],
            ['key' => 'kpi.workTime.direct', 'en' => 'Direct [min]', 'pl' => 'Direct [min]'],
            ['key' => 'kpi.workTime.total', 'en' => 'Total [min]', 'pl' => 'Total [min]'],
            ['key' => 'kpi.summary.overdueAfterDue', 'en' => 'Overdue (past due date)', 'pl' => 'Zaległe (po terminie)'],
            ['key' => 'kpi.summary.completionRate', 'en' => 'Completion rate', 'pl' => 'Skuteczność zamknięcia'],
            ['key' => 'kpi.summary.completionRateShort', 'en' => 'Effectiveness', 'pl' => 'Skuteczność'],
            ['key' => 'kpi.summary.closedToAll', 'en' => 'Completed / all', 'pl' => 'Zakończone / wszystkich'],
            ['key' => 'kpi.summary.equipmentTotal', 'en' => 'Equipment in database', 'pl' => 'Urządzeń w bazie'],
            ['key' => 'kpi.alerts.overdueAttention', 'en' => 'work orders are overdue and require attention.', 'pl' => 'zgłoszeń jest po terminie i wymaga uwagi.'],

            ['key' => 'user.list', 'en' => 'Users', 'pl' => 'Użytkownicy'],
            ['key' => 'user.listSubtitle', 'en' => 'Total {{count}} users', 'pl' => 'Łącznie {{count}} użytkowników'],
            ['key' => 'user.create', 'en' => 'Add User', 'pl' => 'Dodaj użytkownika'],
            ['key' => 'user.edit', 'en' => 'Edit User', 'pl' => 'Edytuj użytkownika'],
            ['key' => 'user.createSubtitle', 'en' => 'Fill in the details below', 'pl' => 'Uzupełnij poniższe dane'],
            ['key' => 'user.loadError', 'en' => 'Failed to load user data', 'pl' => 'Nie udało się załadować danych użytkownika'],
            ['key' => 'user.loading', 'en' => 'Loading users...', 'pl' => 'Ładowanie użytkowników...'],
            ['key' => 'user.saveError', 'en' => 'Failed to save user', 'pl' => 'Nie udało się zapisać użytkownika'],
            ['key' => 'user.createSuccess', 'en' => 'User created successfully', 'pl' => 'Użytkownik został utworzony'],
            ['key' => 'user.updateSuccess', 'en' => 'User updated successfully', 'pl' => 'Użytkownik został zaktualizowany'],
            ['key' => 'user.deleteSuccess', 'en' => 'User deleted successfully', 'pl' => 'Użytkownik został usunięty'],
            ['key' => 'user.deleteError', 'en' => 'Failed to delete user', 'pl' => 'Nie udało się usunąć użytkownika'],
            ['key' => 'user.toggleError', 'en' => 'Failed to toggle user status', 'pl' => 'Nie udało się zmienić statusu użytkownika'],
            ['key' => 'user.activated', 'en' => 'User activated', 'pl' => 'Użytkownik został aktywowany'],
            ['key' => 'user.deactivated', 'en' => 'User deactivated', 'pl' => 'Użytkownik został dezaktywowany'],
            ['key' => 'user.activate', 'en' => 'Activate', 'pl' => 'Aktywuj'],
            ['key' => 'user.deactivate', 'en' => 'Deactivate', 'pl' => 'Dezaktywuj'],
            ['key' => 'user.active', 'en' => 'Active', 'pl' => 'Aktywny'],
            ['key' => 'user.inactive', 'en' => 'Inactive', 'pl' => 'Nieaktywny'],
            ['key' => 'user.total', 'en' => 'Total', 'pl' => 'Łącznie'],
            ['key' => 'user.activeUsers', 'en' => 'Active', 'pl' => 'Aktywni'],
            ['key' => 'user.inactiveUsers', 'en' => 'Inactive', 'pl' => 'Nieaktywni'],
            ['key' => 'user.admins', 'en' => 'Administrators', 'pl' => 'Administratorzy'],
            ['key' => 'user.noUsers', 'en' => 'No users to display', 'pl' => 'Brak użytkowników do wyświetlenia'],
            ['key' => 'user.noUsersHint', 'en' => 'Add a new user to get started', 'pl' => 'Dodaj nowego użytkownika, aby rozpocząć'],
            ['key' => 'user.basicInfo', 'en' => 'Basic Information', 'pl' => 'Podstawowe informacje'],
            ['key' => 'user.security', 'en' => 'Security', 'pl' => 'Bezpieczeństwo'],
            ['key' => 'user.rolesAndPermissions', 'en' => 'Roles & Permissions', 'pl' => 'Role i uprawnienia'],
            ['key' => 'user.noRoles', 'en' => 'No role assigned', 'pl' => 'Brak przypisanej roli'],
            ['key' => 'user.fullName', 'en' => 'Full Name', 'pl' => 'Imię i nazwisko'],
            ['key' => 'user.firstName', 'en' => 'First Name', 'pl' => 'Imię'],
            ['key' => 'user.lastName', 'en' => 'Last Name', 'pl' => 'Nazwisko'],
            ['key' => 'user.email', 'en' => 'Email', 'pl' => 'Email'],
            ['key' => 'user.phone', 'en' => 'Phone', 'pl' => 'Telefon'],
            ['key' => 'user.password', 'en' => 'Password', 'pl' => 'Hasło'],
            ['key' => 'user.confirmPassword', 'en' => 'Confirm Password', 'pl' => 'Potwierdź hasło'],
            ['key' => 'user.passwordHint', 'en' => 'Leave empty to keep current password', 'pl' => 'Pozostaw puste, aby zachować obecne hasło'],
            ['key' => 'user.role', 'en' => 'Role', 'pl' => 'Rola'],
            ['key' => 'user.roles', 'en' => 'Roles', 'pl' => 'Role'],
            ['key' => 'user.status', 'en' => 'Status', 'pl' => 'Status'],
            ['key' => 'user.isActive', 'en' => 'Active account', 'pl' => 'Aktywne konto'],
            ['key' => 'user.activity', 'en' => 'Activity', 'pl' => 'Aktywność'],
            ['key' => 'user.lastLogin', 'en' => 'Last Login', 'pl' => 'Ostatnie logowanie'],
            ['key' => 'user.created', 'en' => 'User created successfully', 'pl' => 'Użytkownik utworzony pomyślnie'],
            ['key' => 'user.updated', 'en' => 'User updated successfully', 'pl' => 'Użytkownik zaktualizowany pomyślnie'],
            ['key' => 'user.deleted', 'en' => 'User deleted successfully', 'pl' => 'Użytkownik usunięty pomyślnie'],
            ['key' => 'user.not_found', 'en' => 'User not found', 'pl' => 'Nie znaleziono użytkownika'],
            ['key' => 'user.registered', 'en' => 'User registered successfully', 'pl' => 'Użytkownik zarejestrowany pomyślnie'],
            ['key' => 'user.email_exists', 'en' => 'Email already exists', 'pl' => 'Email już istnieje'],
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