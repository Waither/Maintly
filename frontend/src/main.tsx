import React, { Suspense, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { ensureOfflineQueueAutoSync } from './lib/offlineQueue';

// i18next configuration
import './lib/i18n';

// Styles
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './styles/main.scss';

// Loading fallback component
const LoadingScreen = () => {
    const [messageIndex, setMessageIndex] = useState(0);
    
    const messages = [
        'Inicjalizowanie aplikacji...',
        'Ładowanie tłumaczeń...',
        'Przygotowywanie interfejsu...',
    ];
    
    useEffect(() => {
        // Pierwszy komunikat - od razu
        setMessageIndex(0);
        
        // Drugi komunikat po 400ms (gdy zaczyna ładować tłumaczenia)
        const timer1 = setTimeout(() => setMessageIndex(1), 400);
        
        // Trzeci komunikat po 1200ms (gdy renderuje komponenty)
        const timer2 = setTimeout(() => setMessageIndex(2), 1200);
        
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);
    
    return (
        <div className="loading-screen">
            <div className="loading-screen__content">
                <i className="fas fa-gear loading-screen__icon"></i>
                <h1 className="loading-screen__title">Maintly</h1>
                <p className="loading-screen__message">{messages[messageIndex]}</p>
            </div>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Suspense fallback={<LoadingScreen />}>
            <App />
        </Suspense>
    </React.StrictMode>
);

// Ensure page-level fallback replay for offline queue on reconnect.
ensureOfflineQueueAutoSync();

// Service Worker registration - Auto-select DEV or PROD version
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Choose SW file based on environment
        const swFile = import.meta.env.PROD ? '/sw-prod.js' : '/sw-dev.js';
        const envLabel = import.meta.env.PROD ? 'PRODUCTION' : 'DEVELOPMENT';
        
        console.log(`🔧 Registering ${envLabel} Service Worker: ${swFile}`);
        
        // Unregister old service workers first (cleanup)
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => {
                if (!registration.active?.scriptURL.includes(swFile)) {
                    registration.unregister();
                    console.log('🗑️ Unregistered old Service Worker:', registration.active?.scriptURL);
                }
            });
        });
        
        // Register new service worker
        navigator.serviceWorker
            .register(swFile)
            .then((registration) => {
                console.log(`✅ ${envLabel} Service Worker registered:`, registration.scope);
                
                // Production: Check for updates periodically
                if (import.meta.env.PROD) {
                    setInterval(() => {
                        registration.update();
                    }, 60000); // Check every 60s
                }
                
                // Background i18n prefetch (works in both DEV and PROD)
                // Wait for SW to become controller, then prefetch all languages
                navigator.serviceWorker.ready.then(() => {
                    // Wait a bit more to ensure page is fully loaded
                    setTimeout(() => {
                        if (navigator.serviceWorker.controller) {
                            navigator.serviceWorker.controller.postMessage({
                                type: 'PREFETCH_LANGUAGES',
                                languages: ['en', 'pl', 'de', 'fr', 'uk'] // All available languages
                            });
                            console.log('🌍 Requested background i18n prefetch for all languages');
                        } else {
                            console.warn('⚠️ SW not controller yet - refresh page to enable i18n prefetch');
                        }
                    }, 3000); // Wait 3 seconds after SW is ready
                });

                // Trigger queued offline sync once connection returns.
                window.addEventListener('online', () => {
                    if (navigator.serviceWorker.controller) {
                        navigator.serviceWorker.controller.postMessage({
                            type: 'SYNC_NOW'
                        });
                    }
                });
            })
            .catch((error) => {
                console.error(`❌ ${envLabel} Service Worker registration failed:`, error);
            });
    });
}
