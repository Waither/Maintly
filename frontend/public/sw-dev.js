// Development Service Worker - Minimal (Push Notifications only, zero cache)
// This SW is active in development mode to enable push notification testing
// It does NOT cache anything to avoid stale code issues during development

console.log('🔧 DEV Service Worker loaded');

const DEV_CACHE = 'maintly-dev-shell-v1';
const DEV_SHELL_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
];

// Install immediately without caching anything
self.addEventListener('install', (event) => {
    console.log('🔧 DEV SW: Installing (no cache)');
    event.waitUntil(
        caches.open(DEV_CACHE)
            .then((cache) => cache.addAll(DEV_SHELL_ASSETS))
            .catch(() => {
                // Dev mode: ignore pre-cache failures.
            })
            .then(() => self.skipWaiting())
    );
});

// Activate and take control immediately
self.addEventListener('activate', (event) => {
    console.log('🔧 DEV SW: Activating');
    event.waitUntil(
        // Clear any old caches from previous versions
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('🗑️ DEV SW: Deleting old cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            console.log('✅ DEV SW: Active and ready');
            return self.clients.claim();
        })
    );
});

// Fetch: Cache only i18n translations (for prefetch testing)
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Keep SPA shell available offline on reload/navigation.
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    const responseClone = networkResponse.clone();
                    caches.open(DEV_CACHE).then((cache) => {
                        cache.put('/index.html', responseClone);
                    });
                    return networkResponse;
                })
                .catch(async () => {
                    const cached = await caches.match('/index.html');
                    return cached || new Response('Offline', { status: 503, statusText: 'Offline' });
                })
        );
        return;
    }
    
    // Cache i18n translations only (for testing background prefetch)
    if (url.pathname.includes('/translations/')) {
        event.respondWith(
            caches.open('maintly-dev-i18n').then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('🌍 DEV SW: Serving cached i18n:', url.pathname);
                        return cachedResponse;
                    }
                    
                    // Not cached, fetch and cache it
                    return fetch(event.request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                            console.log('🌍 DEV SW: Cached i18n:', url.pathname);
                        }
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }
    
    // Everything else: pass-through
    // This ensures fresh code/assets during development
});

// Background i18n prefetch (testing your idea in DEV mode)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PREFETCH_LANGUAGES') {
        const languages = event.data.languages || ['en'];
        console.log('🌍 DEV SW: Prefetching languages:', languages);
        
        event.waitUntil(
            prefetchLanguages(languages)
        );
    }
});

async function prefetchLanguages(languages) {
    const cache = await caches.open('maintly-dev-i18n');
    
    for (const lang of languages) {
        try {
            const url = `http://localhost:8000/api/translations/${lang}`;
            const response = await fetch(url);
            if (response.ok) {
                await cache.put(url, response);
                console.log(`✅ DEV SW: Prefetched language: ${lang}`);
            }
        } catch (err) {
            console.warn(`⚠️ DEV SW: Failed to prefetch language ${lang}:`, err);
        }
    }
}

// Push Notification support (for testing)
self.addEventListener('push', (event) => {
    console.log('📩 DEV SW: Push notification received:', event);
    
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Maintly Notification';
    const options = {
        body: data.body || 'New notification',
        icon: data.icon || '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        data: data.data || {},
        tag: data.tag || 'default',
        requireInteraction: data.requireInteraction || false
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 DEV SW: Notification clicked:', event.notification);
    
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if window is already open
                for (let client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Open new window if not found
                if (self.clients.openWindow) {
                    return self.clients.openWindow(urlToOpen);
                }
            })
    );
});
