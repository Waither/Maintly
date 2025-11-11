/**
 * i18next Configuration with localStorage cache
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

// Cache settings
const CACHE_KEY = 'i18next_cache';
const CACHE_VERSION = 1;
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24h

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

const savedLocale = localStorage.getItem('locale') || 'pl';
const cachedTranslations = getCachedTranslations(savedLocale);

i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
        lng: savedLocale,
        fallbackLng: 'en',
        
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
    localStorage.setItem('locale', lng);
});

i18n.on('loaded', (loaded) => {
    console.log('✅ Translations loaded:', Object.keys(loaded));
});

i18n.on('failedLoading', (lng, ns, msg) => {
    console.error('❌ Failed loading translations:', { lng, ns, msg });
});

export default i18n;
