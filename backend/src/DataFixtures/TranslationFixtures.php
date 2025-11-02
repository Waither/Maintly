<?php

namespace App\DataFixtures;

use App\Entity\Translation;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;

class TranslationFixtures extends Fixture implements FixtureGroupInterface {
    public static function getGroups(): array {
        return ['translation'];
    }

    public function load(ObjectManager $manager): void {
        $translations = [
            // Validation messages
            ['key' => 'validation.email_required', 'en' => 'Valid email is required', 'pl' => 'Wymagany jest poprawny adres email'],
            ['key' => 'validation.password_min_length', 'en' => 'Password must be at least 8 characters', 'pl' => 'Hasło musi mieć co najmniej 8 znaków'],
            ['key' => 'validation.name_required', 'en' => 'First name and last name are required', 'pl' => 'Imię i nazwisko są wymagane'],
            ['key' => 'validation.invalid_role', 'en' => 'Invalid role ID', 'pl' => 'Nieprawidłowe ID roli'],
            ['key' => 'validation.email_invalid', 'en' => 'Invalid email format', 'pl' => 'Nieprawidłowy format email'],
            ['key' => 'validation.role_name_required', 'en' => 'Role name is required', 'pl' => 'Nazwa roli jest wymagana'],
            ['key' => 'validation.missing_fields', 'en' => 'Missing required fields: email, password, firstName, lastName', 'pl' => 'Brakujące wymagane pola: email, hasło, imię, nazwisko'],

            // User messages
            ['key' => 'user.created', 'en' => 'User created successfully', 'pl' => 'Użytkownik utworzony pomyślnie'],
            ['key' => 'user.updated', 'en' => 'User updated successfully', 'pl' => 'Użytkownik zaktualizowany pomyślnie'],
            ['key' => 'user.deleted', 'en' => 'User deleted successfully', 'pl' => 'Użytkownik usunięty pomyślnie'],
            ['key' => 'user.not_found', 'en' => 'User not found', 'pl' => 'Nie znaleziono użytkownika'],
            ['key' => 'user.registered', 'en' => 'User registered successfully', 'pl' => 'Użytkownik zarejestrowany pomyślnie'],
            ['key' => 'user.email_exists', 'en' => 'Email already exists', 'pl' => 'Email już istnieje'],

            // Role messages
            ['key' => 'role.created', 'en' => 'Role created successfully', 'pl' => 'Rola utworzona pomyślnie'],
            ['key' => 'role.updated', 'en' => 'Role updated successfully', 'pl' => 'Rola zaktualizowana pomyślnie'],
            ['key' => 'role.deleted', 'en' => 'Role deleted successfully', 'pl' => 'Rola usunięta pomyślnie'],
            ['key' => 'role.not_found', 'en' => 'Role not found', 'pl' => 'Nie znaleziono roli'],

            // Role names
            ['key' => 'role.admin', 'en' => 'Administrator', 'pl' => 'Administrator'],
            ['key' => 'role.manager', 'en' => 'Manager', 'pl' => 'Menedżer'],
            ['key' => 'role.technician', 'en' => 'Technician', 'pl' => 'Technik'],
            ['key' => 'role.reporter', 'en' => 'Reporter', 'pl' => 'Zgłaszający'],

            // Permission/Access messages
            ['key' => 'permission.create_user_denied', 'en' => 'You are not allowed to create users with this role', 'pl' => 'Nie masz uprawnień do tworzenia użytkowników z tą rolą'],
            ['key' => 'permission.delete_user_denied', 'en' => 'You are not allowed to delete users with this role', 'pl' => 'Nie masz uprawnień do usuwania użytkowników z tą rolą'],
            ['key' => 'permission.access_denied', 'en' => 'Access denied', 'pl' => 'Dostęp zabroniony'],
            ['key' => 'permission.not_authenticated', 'en' => 'Not authenticated', 'pl' => 'Nie uwierzytelniono'],
            ['key' => 'permission.unauthorized', 'en' => 'Unauthorized', 'pl' => 'Brak autoryzacji'],

            // Error messages
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

            // Translation system
            ['key' => 'translations.fetch_failed', 'en' => 'Failed to fetch translations', 'pl' => 'Nie udało się pobrać tłumaczeń'],

            // UI Elements (examples for frontend)
            ['key' => 'button.add', 'en' => 'Add', 'pl' => 'Dodaj'],
            ['key' => 'button.edit', 'en' => 'Edit', 'pl' => 'Edytuj'],
            ['key' => 'button.delete', 'en' => 'Delete', 'pl' => 'Usuń'],
            ['key' => 'button.save', 'en' => 'Save', 'pl' => 'Zapisz'],
            ['key' => 'button.cancel', 'en' => 'Cancel', 'pl' => 'Anuluj'],
            ['key' => 'button.submit', 'en' => 'Submit', 'pl' => 'Wyślij'],
        ];

        foreach ($translations as $item) {
            // Create English translation
            $enTranslation = new Translation();
            $enTranslation->setMessageKey($item['key']);
            $enTranslation->setLocale('en');
            $enTranslation->setText($item['en']);
            $manager->persist($enTranslation);

            // Create Polish translation
            $plTranslation = new Translation();
            $plTranslation->setMessageKey($item['key']);
            $plTranslation->setLocale('pl');
            $plTranslation->setText($item['pl']);
            $manager->persist($plTranslation);
        }

        $manager->flush();
    }
}
