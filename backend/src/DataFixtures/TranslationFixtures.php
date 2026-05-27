<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\Translation;
use App\Repository\TranslationRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class TranslationFixtures extends Fixture implements FixtureGroupInterface, DependentFixtureInterface {
    public function __construct(
        private TranslationRepository $translationRepository,
    ) {}

    public static function getGroups(): array {
        return ['translation', 'default'];
    }

    public function getDependencies(): array {
        return [
            MasterFixtures::class,
        ];
    }

    public function load(ObjectManager $manager): void {
        $translations = [
            // ========================================
            // NAVIGATION
            // ========================================
            ['key' => 'nav.dashboard', 'en' => 'Dashboard', 'pl' => 'Pulpit'],
            ['key' => 'nav.workOrders', 'en' => 'Work Orders', 'pl' => 'Zlecenia'],
            ['key' => 'nav.equipment', 'en' => 'Equipment', 'pl' => 'Sprzęt'],
            ['key' => 'nav.reports', 'en' => 'Reports', 'pl' => 'Raporty'],
            ['key' => 'nav.users', 'en' => 'Users', 'pl' => 'Użytkownicy'],
            ['key' => 'nav.auditLogs', 'en' => 'Audit Logs', 'pl' => 'Logi audytu'],
            ['key' => 'nav.settings', 'en' => 'Settings', 'pl' => 'Ustawienia'],
            ['key' => 'nav.profile', 'en' => 'Profile', 'pl' => 'Profil'],
            ['key' => 'nav.logout', 'en' => 'Logout', 'pl' => 'Wyloguj'],
            ['key' => 'nav.preventive', 'en' => 'Preventive Maintenance', 'pl' => 'Prewencja'],
            ['key' => 'nav.kpi', 'en' => 'KPI', 'pl' => 'KPI'],

            // ========================================
            // COMMON / SHARED
            // ========================================
            ['key' => 'common.loading', 'en' => 'Loading...', 'pl' => 'Ładowanie...'],
            ['key' => 'common.save', 'en' => 'Save', 'pl' => 'Zapisz'],
            ['key' => 'common.cancel', 'en' => 'Cancel', 'pl' => 'Anuluj'],
            ['key' => 'common.create', 'en' => 'Create', 'pl' => 'Utwórz'],
            ['key' => 'common.edit', 'en' => 'Edit', 'pl' => 'Edytuj'],
            ['key' => 'common.delete', 'en' => 'Delete', 'pl' => 'Usuń'],
            ['key' => 'common.view', 'en' => 'View', 'pl' => 'Podgląd'],
            ['key' => 'common.search', 'en' => 'Search...', 'pl' => 'Szukaj...'],
            ['key' => 'common.select', 'en' => 'Select...', 'pl' => 'Wybierz...'],
            ['key' => 'common.noData', 'en' => 'No data to display', 'pl' => 'Brak danych do wyświetlenia'],
            ['key' => 'common.actions', 'en' => 'Actions', 'pl' => 'Akcje'],
            ['key' => 'common.saving', 'en' => 'Saving...', 'pl' => 'Zapisywanie...'],
            ['key' => 'common.loadError', 'en' => 'Failed to load data', 'pl' => 'Nie udało się załadować danych'],
            ['key' => 'common.clearFilters', 'en' => 'Clear filters', 'pl' => 'Wyczyść filtry'],
            ['key' => 'common.rowsPerPage', 'en' => 'Rows per page', 'pl' => 'Wierszy na stronę'],
            ['key' => 'common.of', 'en' => 'of', 'pl' => 'z'],
            ['key' => 'common.all', 'en' => 'All', 'pl' => 'Wszystkie'],
            ['key' => 'common.yes', 'en' => 'Yes', 'pl' => 'Tak'],
            ['key' => 'common.no', 'en' => 'No', 'pl' => 'Nie'],
            ['key' => 'common.confirm', 'en' => 'Confirm', 'pl' => 'Potwierdź'],
            ['key' => 'common.back', 'en' => 'Back', 'pl' => 'Wróć'],
            ['key' => 'common.viewAll', 'en' => 'View all', 'pl' => 'Zobacz wszystkie'],
            ['key' => 'common.new', 'en' => 'New', 'pl' => 'Nowe'],
            ['key' => 'common.clear', 'en' => 'Clear', 'pl' => 'Wyczyść'],
            ['key' => 'common.details', 'en' => 'Details', 'pl' => 'Szczegóły'],
            ['key' => 'common.preview', 'en' => 'Preview', 'pl' => 'Podgląd'],
            ['key' => 'common.download', 'en' => 'Download', 'pl' => 'Pobierz'],
            ['key' => 'common.createdAt', 'en' => 'Created', 'pl' => 'Utworzono'],
            ['key' => 'common.updatedAt', 'en' => 'Updated', 'pl' => 'Zaktualizowano'],

            // ========================================
            // AUTH / ACCESS
            // ========================================
            ['key' => 'auth.accessDenied.title', 'en' => 'Access denied', 'pl' => 'Brak dostępu'],
            ['key' => 'auth.accessDenied.message', 'en' => 'You do not have permission to view this page.', 'pl' => 'Nie masz uprawnień do tej strony.'],
            ['key' => 'auth.accessDenied.back', 'en' => 'Back to dashboard', 'pl' => 'Wróć do pulpitu'],

            // ========================================
            // WORK ORDERS
            // ========================================
            ['key' => 'workOrder.list', 'en' => 'Work Orders', 'pl' => 'Zlecenia pracy'],
            ['key' => 'workOrder.listSubtitle', 'en' => 'Total {{count}} orders', 'pl' => 'Łącznie {{count}} zleceń'],
            ['key' => 'workOrder.create', 'en' => 'New Work Order', 'pl' => 'Nowe zlecenie'],
            ['key' => 'workOrder.edit', 'en' => 'Edit Work Order', 'pl' => 'Edytuj zlecenie'],
            ['key' => 'workOrder.detail', 'en' => 'Work Order Details', 'pl' => 'Szczegóły zlecenia'],
            ['key' => 'workOrder.title', 'en' => 'Title', 'pl' => 'Tytuł'],
            ['key' => 'workOrder.description', 'en' => 'Description', 'pl' => 'Opis'],
            ['key' => 'workOrder.status', 'en' => 'Status', 'pl' => 'Status'],
            ['key' => 'workOrder.priority', 'en' => 'Priority', 'pl' => 'Priorytet'],
            ['key' => 'workOrder.equipment', 'en' => 'Equipment', 'pl' => 'Sprzęt'],
            ['key' => 'workOrder.createdBy', 'en' => 'Created by', 'pl' => 'Utworzył'],
            ['key' => 'workOrder.createdAt', 'en' => 'Created at', 'pl' => 'Data utworzenia'],
            ['key' => 'workOrder.dueDate', 'en' => 'Due date', 'pl' => 'Termin'],
            ['key' => 'workOrder.plannedStartDate', 'en' => 'Planned start date', 'pl' => 'Planowana data rozpoczęcia'],
            ['key' => 'workOrder.plannedEndDate', 'en' => 'Planned end date', 'pl' => 'Planowana data zakończenia'],
            ['key' => 'workOrder.assignedUsers', 'en' => 'Assigned users', 'pl' => 'Przypisani użytkownicy'],
            ['key' => 'workOrder.noWorkOrders', 'en' => 'No work orders to display', 'pl' => 'Brak zleceń do wyświetlenia'],
            ['key' => 'workOrder.noWorkOrdersHint', 'en' => 'Try changing filters or add a new order', 'pl' => 'Spróbuj zmienić filtry lub dodaj nowe zlecenie'],
            ['key' => 'workOrder.loadingOrders', 'en' => 'Loading orders...', 'pl' => 'Ładowanie zleceń...'],
            ['key' => 'workOrder.loadError', 'en' => 'Failed to load work orders', 'pl' => 'Nie udało się załadować zleceń'],
            ['key' => 'workOrder.createSuccess', 'en' => 'Work order created successfully', 'pl' => 'Zlecenie zostało utworzone'],
            ['key' => 'workOrder.updateSuccess', 'en' => 'Work order updated successfully', 'pl' => 'Zlecenie zostało zaktualizowane'],
            ['key' => 'workOrder.deleteSuccess', 'en' => 'Work order deleted successfully', 'pl' => 'Zlecenie zostało usunięte'],
            ['key' => 'workOrder.saveError', 'en' => 'Failed to save work order', 'pl' => 'Nie udało się zapisać zlecenia'],
            ['key' => 'workOrder.deleteError', 'en' => 'Failed to delete work order', 'pl' => 'Nie udało się usunąć zlecenia'],
            ['key' => 'workOrder.filterByStatus', 'en' => 'Filter by status', 'pl' => 'Filtruj wg statusu'],
            ['key' => 'workOrder.filterByPriority', 'en' => 'Filter by priority', 'pl' => 'Filtruj wg priorytetu'],
            ['key' => 'workOrder.allStatuses', 'en' => 'All statuses', 'pl' => 'Wszystkie statusy'],
            ['key' => 'workOrder.allPriorities', 'en' => 'All priorities', 'pl' => 'Wszystkie priorytety'],
            ['key' => 'workOrder.total', 'en' => 'Total', 'pl' => 'Wszystkie'],
            ['key' => 'workOrder.inProgress', 'en' => 'In progress', 'pl' => 'W trakcie'],
            ['key' => 'workOrder.critical', 'en' => 'Critical', 'pl' => 'Krytyczne'],
            ['key' => 'workOrder.overdue', 'en' => 'Overdue', 'pl' => 'Przeterminowane'],

            // ========================================
            // WORK ORDER STATUSES
            // ========================================
            ['key' => 'status.open', 'en' => 'Open', 'pl' => 'Otwarte'],
            ['key' => 'status.in_progress', 'en' => 'In Progress', 'pl' => 'W trakcie'],
            ['key' => 'status.on_hold', 'en' => 'On Hold', 'pl' => 'Wstrzymane'],
            ['key' => 'status.completed', 'en' => 'Completed', 'pl' => 'Zakończone'],
            ['key' => 'status.cancelled', 'en' => 'Cancelled', 'pl' => 'Anulowane'],

            // ========================================
            // WORK ORDER PRIORITIES
            // ========================================
            ['key' => 'priority.low', 'en' => 'Low', 'pl' => 'Niski'],
            ['key' => 'priority.medium', 'en' => 'Medium', 'pl' => 'Średni'],
            ['key' => 'priority.high', 'en' => 'High', 'pl' => 'Wysoki'],
            ['key' => 'priority.critical', 'en' => 'Critical', 'pl' => 'Krytyczny'],

            // ========================================
            // EQUIPMENT
            // ========================================
            ['key' => 'equipment.list', 'en' => 'Equipment', 'pl' => 'Lista sprzętu'],
            ['key' => 'equipment.create', 'en' => 'Add Equipment', 'pl' => 'Dodaj sprzęt'],
            ['key' => 'equipment.edit', 'en' => 'Edit Equipment', 'pl' => 'Edytuj sprzęt'],
            ['key' => 'equipment.detail', 'en' => 'Equipment Details', 'pl' => 'Szczegóły sprzętu'],
            ['key' => 'equipment.name', 'en' => 'Name', 'pl' => 'Nazwa'],
            ['key' => 'equipment.code', 'en' => 'Code', 'pl' => 'Kod'],
            ['key' => 'equipment.location', 'en' => 'Location', 'pl' => 'Lokalizacja'],
            ['key' => 'equipment.status', 'en' => 'Status', 'pl' => 'Status'],
            ['key' => 'equipment.manufacturer', 'en' => 'Manufacturer', 'pl' => 'Producent'],
            ['key' => 'equipment.model', 'en' => 'Model', 'pl' => 'Model'],
            ['key' => 'equipment.serialNumber', 'en' => 'Serial Number', 'pl' => 'Numer seryjny'],
            ['key' => 'equipment.purchaseDate', 'en' => 'Purchase Date', 'pl' => 'Data zakupu'],
            ['key' => 'equipment.warrantyExpiry', 'en' => 'Warranty Expiry', 'pl' => 'Koniec gwarancji'],
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

            // ========================================
            // DASHBOARD
            // ========================================
            ['key' => 'dashboard.title', 'en' => 'Dashboard', 'pl' => 'Dashboard'],
            ['key' => 'dashboard.subtitle', 'en' => 'CMMS Maintly system overview', 'pl' => 'Przegląd systemu CMMS Maintly'],
            ['key' => 'dashboard.workOrders', 'en' => 'Work Orders', 'pl' => 'Zlecenia'],
            ['key' => 'dashboard.equipment', 'en' => 'Equipment', 'pl' => 'Sprzęt'],
            ['key' => 'dashboard.users', 'en' => 'Users', 'pl' => 'Użytkownicy'],
            ['key' => 'dashboard.reports', 'en' => 'Reports', 'pl' => 'Raporty'],
            ['key' => 'dashboard.newWorkOrders', 'en' => 'New orders', 'pl' => 'Nowe zlecenia'],
            ['key' => 'dashboard.inProgress', 'en' => 'In progress', 'pl' => 'W realizacji'],
            ['key' => 'dashboard.completed', 'en' => 'Completed', 'pl' => 'Ukończone'],
            ['key' => 'dashboard.overdue', 'en' => 'Overdue', 'pl' => 'Przeterminowane'],
            ['key' => 'dashboard.recentWorkOrders', 'en' => 'Recent work orders', 'pl' => 'Ostatnie zlecenia'],
            ['key' => 'dashboard.noRecentWorkOrders', 'en' => 'No work orders to display', 'pl' => 'Brak zleceń do wyświetlenia'],
            ['key' => 'dashboard.maintenanceSchedule', 'en' => 'Maintenance', 'pl' => 'Konserwacja'],
            ['key' => 'dashboard.inMaintenance', 'en' => 'In maintenance', 'pl' => 'W konserwacji'],
            ['key' => 'dashboard.activeEquipment', 'en' => 'Active equipment', 'pl' => 'Sprawny sprzęt'],
            ['key' => 'dashboard.manageEquipment', 'en' => 'Manage equipment', 'pl' => 'Zarządzaj sprzętem'],
            ['key' => 'dashboard.inProgressCount', 'en' => '{{count}} in progress', 'pl' => '{{count}} w trakcie'],
            ['key' => 'dashboard.activeCount', 'en' => '{{count}} active', 'pl' => '{{count}} aktywnych'],
            ['key' => 'dashboard.pendingCount', 'en' => '{{count}} in queue', 'pl' => '{{count}} w kolejce'],

            // ========================================
            // PREVENTIVE MAINTENANCE (PM)
            // ========================================
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

            // ========================================
            // KPI
            // ========================================
            ['key' => 'kpi.title', 'en' => 'KPI and analytics', 'pl' => 'KPI i analityka'],
            ['key' => 'kpi.loading', 'en' => 'Loading data...', 'pl' => 'Ładowanie danych...'],
            ['key' => 'kpi.actions.refresh', 'en' => 'Refresh', 'pl' => 'Odśwież'],
            ['key' => 'kpi.filters.from', 'en' => 'From', 'pl' => 'Od'],
            ['key' => 'kpi.filters.to', 'en' => 'To', 'pl' => 'Do'],
            ['key' => 'kpi.period.label', 'en' => 'Data for period:', 'pl' => 'Dane za okres:' ],
            ['key' => 'kpi.period.labelShort', 'en' => 'Period:', 'pl' => 'Zakres:' ],
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

            // ========================================
            // REPORTS
            // ========================================
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

            // ========================================
            // AUDIT LOGS
            // ========================================
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

            // ========================================
            // VALIDATION
            // ========================================
            ['key' => 'validation.required', 'en' => 'This field is required', 'pl' => 'To pole jest wymagane'],
            ['key' => 'validation.email_required', 'en' => 'Valid email is required', 'pl' => 'Wymagany jest poprawny adres email'],
            ['key' => 'validation.password_min_length', 'en' => 'Password must be at least 8 characters', 'pl' => 'Hasło musi mieć co najmniej 8 znaków'],
            ['key' => 'validation.name_required', 'en' => 'First name and last name are required', 'pl' => 'Imię i nazwisko są wymagane'],
            ['key' => 'validation.invalid_role', 'en' => 'Invalid role ID', 'pl' => 'Nieprawidłowe ID roli'],
            ['key' => 'validation.email_invalid', 'en' => 'Invalid email format', 'pl' => 'Nieprawidłowy format email'],
            ['key' => 'validation.role_name_required', 'en' => 'Role name is required', 'pl' => 'Nazwa roli jest wymagana'],
            ['key' => 'validation.missing_fields', 'en' => 'Missing required fields: email, password, firstName, lastName', 'pl' => 'Brakujące wymagane pola: email, hasło, imię, nazwisko'],

            // ========================================
            // USER MESSAGES
            // ========================================
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

            // ========================================
            // ROLE MESSAGES
            // ========================================
            ['key' => 'role.created', 'en' => 'Role created successfully', 'pl' => 'Rola utworzona pomyślnie'],
            ['key' => 'role.updated', 'en' => 'Role updated successfully', 'pl' => 'Rola zaktualizowana pomyślnie'],
            ['key' => 'role.deleted', 'en' => 'Role deleted successfully', 'pl' => 'Rola usunięta pomyślnie'],
            ['key' => 'role.not_found', 'en' => 'Role not found', 'pl' => 'Nie znaleziono roli'],
            ['key' => 'role.admin', 'en' => 'Administrator', 'pl' => 'Administrator'],
            ['key' => 'role.manager', 'en' => 'Manager', 'pl' => 'Menedżer'],
            ['key' => 'role.technician', 'en' => 'Technician', 'pl' => 'Technik'],
            ['key' => 'role.reporter', 'en' => 'Reporter', 'pl' => 'Zgłaszający'],

            // ========================================
            // PERMISSION MESSAGES
            // ========================================
            ['key' => 'permission.create_user_denied', 'en' => 'You are not allowed to create users with this role', 'pl' => 'Nie masz uprawnień do tworzenia użytkowników z tą rolą'],
            ['key' => 'permission.delete_user_denied', 'en' => 'You are not allowed to delete users with this role', 'pl' => 'Nie masz uprawnień do usuwania użytkowników z tą rolą'],
            ['key' => 'permission.access_denied', 'en' => 'Access denied', 'pl' => 'Dostęp zabroniony'],
            ['key' => 'permission.not_authenticated', 'en' => 'Not authenticated', 'pl' => 'Nie uwierzytelniono'],
            ['key' => 'permission.unauthorized', 'en' => 'Unauthorized', 'pl' => 'Brak autoryzacji'],

            // ========================================
            // ERROR MESSAGES
            // ========================================
            ['key' => 'error.resource_not_found', 'en' => 'Resource not found', 'pl' => 'Nie znaleziono zasobu'],
            ['key' => 'error.internal_server', 'en' => 'Internal server error', 'pl' => 'Wewnętrzny błąd serwera'],
            ['key' => 'error.fetch_users_failed', 'en' => 'Failed to fetch users', 'pl' => 'Nie udało się pobrać użytkowników'],
            ['key' => 'error.create_user_failed', 'en' => 'Failed to create user', 'pl' => 'Nie udało się utworzyć użytkownika'],
            ['key' => 'error.update_user_failed', 'en' => 'Failed to update user', 'pl' => 'Nie udało się zaktualizować użytkownika'],
            ['key' => 'error.delete_user_failed', 'en' => 'Failed to delete user', 'pl' => 'Nie udało się usunąć użytkownika'],
            ['key' => 'error.fetch_user_failed', 'en' => 'Failed to fetch user', 'pl' => 'Nie udało się pobrać użytkownika'],
            ['key' => 'error.fetch_roles_failed', 'en' => 'Failed to fetch roles', 'pl' => 'Nie udało się pobrać ról'],
            ['key' => 'error.create_role_failed', 'en' => 'Failed to create role', 'pl' => 'Nie udało się utworzyć roli'],
            ['key' => 'error.update_role_failed', 'en' => 'Failed to update role', 'pl' => 'Nie udało się zaktualizować roli'],
            ['key' => 'error.delete_role_failed', 'en' => 'Failed to delete role', 'pl' => 'Nie udało się usunąć roli'],
            ['key' => 'error.fetch_role_failed', 'en' => 'Failed to fetch role', 'pl' => 'Nie udało się pobrać roli'],
            ['key' => 'error.fetch_user_info_failed', 'en' => 'Failed to fetch user info', 'pl' => 'Nie udało się pobrać informacji o użytkowniku'],
            ['key' => 'error.register_user_failed', 'en' => 'Failed to register user', 'pl' => 'Nie udało się zarejestrować użytkownika'],
            ['key' => 'translations.fetch_failed', 'en' => 'Failed to fetch translations', 'pl' => 'Nie udało się pobrać tłumaczeń'],

            // ========================================
            // BUTTONS (legacy - can use common.*)
            // ========================================
            ['key' => 'button.add', 'en' => 'Add', 'pl' => 'Dodaj'],
            ['key' => 'button.edit', 'en' => 'Edit', 'pl' => 'Edytuj'],
            ['key' => 'button.delete', 'en' => 'Delete', 'pl' => 'Usuń'],
            ['key' => 'button.save', 'en' => 'Save', 'pl' => 'Zapisz'],
            ['key' => 'button.cancel', 'en' => 'Cancel', 'pl' => 'Anuluj'],
            ['key' => 'button.submit', 'en' => 'Submit', 'pl' => 'Wyślij'],

            // ========================================
            // DELETE CONFIRMATION MODAL
            // ========================================
            ['key' => 'modal.deleteTitle', 'en' => 'Confirm Deletion', 'pl' => 'Potwierdź usunięcie'],
            ['key' => 'modal.deleteMessage', 'en' => 'Are you sure you want to delete "{{name}}"? This action cannot be undone.', 'pl' => 'Czy na pewno chcesz usunąć "{{name}}"? Tej operacji nie można cofnąć.'],
            ['key' => 'modal.deleting', 'en' => 'Deleting...', 'pl' => 'Usuwanie...'],
        ];

        foreach ($translations as $item) {
            // Create or update English translation
            $enTranslation = $this->translationRepository->findOneBy([
                'messageKey' => $item['key'],
                'locale' => 'en',
            ]);
            if (!$enTranslation) {
                $enTranslation = new Translation();
                $enTranslation->setMessageKey($item['key']);
                $enTranslation->setLocale('en');
            }
            $enTranslation->setText($item['en']);
            $manager->persist($enTranslation);

            // Create or update Polish translation
            $plTranslation = $this->translationRepository->findOneBy([
                'messageKey' => $item['key'],
                'locale' => 'pl',
            ]);
            if (!$plTranslation) {
                $plTranslation = new Translation();
                $plTranslation->setMessageKey($item['key']);
                $plTranslation->setLocale('pl');
            }
            $plTranslation->setText($item['pl']);
            $manager->persist($plTranslation);
        }

        $manager->flush();
    }
}
