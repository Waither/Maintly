/**
 * Translation Service
 * Serwis do komunikacji z API tłumaczeń (przykład użycia axios)
 */

import apiClient from '../lib/axios';

// TypeScript interfaces
export interface Translation {
    [key: string]: string;
}

export interface TranslationResponse {
    status: string;
    code: number;
    data: Translation;
}

/**
 * Pobiera wszystkie tłumaczenia dla danego języka
 */
export const getTranslations = async (locale: string): Promise<Translation> => {
    try {
        const response = await apiClient.get<TranslationResponse>(`/api/translations/${locale}`);
        return response.data.data;
    }
    catch (error) {
        console.error(`Failed to fetch translations for locale: ${locale}`, error);
        throw error;
    }
};

/**
 * Sprawdza czy API jest dostępne
 */
export const checkApiHealth = async (): Promise<boolean> => {
    try {
        await apiClient.get('/api/translations/pl');
        return true;
    }
    catch (error) {
        return false;
    }
};

// Możesz dodać więcej funkcji API, np.:
// export const createTranslation = async (locale: string, key: string, value: string) => {...}
// export const updateTranslation = async (id: number, value: string) => {...}
// export const deleteTranslation = async (id: number) => {...}
