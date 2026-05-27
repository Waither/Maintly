/**
 * i18next Configuration with localStorage cache
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

// Cache settings
const CACHE_KEY = 'i18next_cache';
const CACHE_VERSION = 4;
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24h
const SUPPORTED_LANGUAGES = ['pl', 'en'] as const;

const normalizeLocale = (lng: string | null | undefined): string => {
    const baseLocale = (lng || 'pl').split(/[-_]/)[0].toLowerCase();

    return SUPPORTED_LANGUAGES.includes(baseLocale as typeof SUPPORTED_LANGUAGES[number])
        ? baseLocale
        : 'pl';
};

const getCachedTranslations = (lng: string) => {
    try {
        const cached = localStorage.getItem(`${CACHE_KEY}_${lng}`);
        if (!cached) return null;
        
        const { data, timestamp, version } = JSON.parse(cached);
        
        if (Date.now() - timestamp > CACHE_EXPIRATION || version !== CACHE_VERSION) {
            localStorage.removeItem(`${CACHE_KEY}_${lng}`);
            return null;
        }
        
        return data;
    }
    catch {
        return null;
    }
};

const setCachedTranslations = (lng: string, data: any) => {
    try {
        localStorage.setItem(`${CACHE_KEY}_${lng}`, JSON.stringify({
            data,
            timestamp: Date.now(),
            version: CACHE_VERSION
        }));
    }
    catch (e) {
        console.warn('Failed to cache translations:', e);
    }
};

const savedLocale = normalizeLocale(localStorage.getItem('locale'));
const cachedTranslations = getCachedTranslations(savedLocale);

i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
        lng: savedLocale,
        fallbackLng: 'en',
        supportedLngs: [...SUPPORTED_LANGUAGES],
        
        // Load from cache if available
        ...(cachedTranslations && {
            resources: {
                [savedLocale]: {
                    translation: cachedTranslations
                }
            }
        }),
        
        ns: ['translation'],
        defaultNS: 'translation',
        
        // Backend configuration
        backend: {
            loadPath: 'http://localhost:8000/api/translations/{{lng}}',
            
            // Parse response and cache translations
            parse: (data: string, languages: string | readonly string[]) => {
                const parsed = JSON.parse(data);
                const translations = parsed.data;
                
                const currentLang = Array.isArray(languages) ? languages[0] : languages;
                setCachedTranslations(currentLang, translations);
                
                return translations;
            },
            
            requestOptions: {
                cache: 'default',
            },
            
            crossDomain: true,
            withCredentials: false,
        },
        
        interpolation: {
            escapeValue: false, // React already escapes
        },

        returnNull: false,
        returnEmptyString: false,
        parseMissingKeyHandler: (key: string) => key,
        
        debug: false,
        
        react: {
            useSuspense: true,
        },
        
        load: 'currentOnly',
        partialBundledLanguages: true,
        keySeparator: '.',
        nsSeparator: ':',
    });

// Save language to localStorage on change
i18n.on('languageChanged', (lng) => {
    const normalizedLocale = normalizeLocale(lng);
    localStorage.setItem('locale', normalizedLocale);
    console.log(`✅ Language changed to: ${normalizedLocale.toUpperCase()}`);
});

i18n.on('failedLoading', (lng, ns, msg) => {
    console.error('❌ Failed loading translations:', { lng, ns, msg });
});

void i18n.reloadResources([savedLocale], ['translation']);

export default i18n;
