<?php

namespace App\DataFixtures;

use App\Entity\Translation;
use App\Repository\TranslationRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;

class TranslationFixtures extends Fixture implements FixtureGroupInterface {
    public function __construct(
        private TranslationRepository $translationRepository
    ) {}
    public static function getGroups(): array {
        return ['translation'];
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
                'locale' => 'en'
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
                'locale' => 'pl'
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
