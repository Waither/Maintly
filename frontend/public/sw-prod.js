// Production Service Worker - Full Offline-First PWA
// Strategies: Stale-while-revalidate for JS/CSS, Cache-first for static assets
// Features: IndexedDB sync queue, Background i18n prefetch, Push notifications

const CACHE_VERSION = 'maintly-v1';
const CACHE_STATIC = `${CACHE_VERSION}-static`; // CSS, images, fonts, icons
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`; // JS bundles (stale-while-revalidate)
const CACHE_I18N = `${CACHE_VERSION}-i18n`; // Translation files

console.log('🚀 PROD Service Worker loaded');

// Assets to cache immediately on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];

// Install: Pre-cache static assets
self.addEventListener('install', (event) => {
    console.log('🚀 PROD SW: Installing and pre-caching static assets');
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then((cache) => {
                console.log('✅ PROD SW: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((err) => console.error('❌ PROD SW: Cache failed:', err))
    );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
    console.log('🚀 PROD SW: Activating');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete caches that don't match current version
                        if (!cacheName.startsWith(CACHE_VERSION)) {
                            console.log('🗑️ PROD SW: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ PROD SW: Active and ready');
                return self.clients.claim();
            })
    );
});

// Fetch: Smart caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // SKIP: API requests (backend handles these, avoid CORS issues)
    if (url.pathname.startsWith('/api/') || url.port === '8000') {
        return; // Pass-through to network
    }
    
    // SKIP: Chrome extensions and non-http(s)
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Strategy 1: Stale-While-Revalidate for JS/CSS (always fresh, but instant load)
    if (url.pathname.match(/\.(js|mjs|css)$/)) {
        event.respondWith(staleWhileRevalidate(request, CACHE_DYNAMIC));
        return;
    }
    
    // Strategy 2: Cache-First for static assets (images, fonts, icons)
    if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|woff2?|ttf|eot)$/)) {
        event.respondWith(cacheFirst(request, CACHE_STATIC));
        return;
    }
    
    // Strategy 3: Cache-First for i18n translations
    if (url.pathname.includes('/translations/')) {
        event.respondWith(cacheFirst(request, CACHE_I18N));
        return;
    }
    
    // Strategy 4: Network-First for HTML (always try network, fallback to cache)
    if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
        event.respondWith(networkFirst(request, CACHE_STATIC));
        return;
    }
    
    // Default: Network-first with cache fallback
    event.respondWith(networkFirst(request, CACHE_DYNAMIC));
});

// Cache Strategy: Stale-While-Revalidate (instant load + background update)
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Fetch fresh version in background
    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => cachedResponse); // Fallback to cache if network fails
    
    // Return cached immediately, or wait for network if no cache
    return cachedResponse || fetchPromise;
}

// Cache Strategy: Cache-First (offline-first for static assets)
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Not in cache, fetch from network and cache it
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
    }
    return networkResponse;
}

// Cache Strategy: Network-First (try network, fallback to cache)
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Nothing in cache, return offline fallback for HTML
        if (request.mode === 'navigate') {
            return caches.match('/index.html');
        }
        
        throw error;
    }
}

// Background i18n prefetch (your idea - fetch other languages in idle time)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PREFETCH_LANGUAGES') {
        const languages = event.data.languages || ['en', 'de'];
        console.log('🌍 PROD SW: Prefetching languages:', languages);
        
        event.waitUntil(
            prefetchLanguages(languages)
        );
    }
});

async function prefetchLanguages(languages) {
    const cache = await caches.open(CACHE_I18N);
    
    for (const lang of languages) {
        try {
            const url = `http://localhost:8000/api/translations/${lang}`;
            const response = await fetch(url);
            if (response.ok) {
                await cache.put(url, response);
                console.log(`✅ PROD SW: Cached language: ${lang}`);
            }
        } catch (err) {
            console.warn(`⚠️ PROD SW: Failed to cache language ${lang}:`, err);
        }
    }
}

// Push Notification support
self.addEventListener('push', (event) => {
    console.log('📩 PROD SW: Push notification received:', event);
    
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Maintly Notification';
    const options = {
        body: data.body || 'New notification',
        icon: data.icon || '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        data: data.data || {},
        tag: data.tag || 'default',
        requireInteraction: data.requireInteraction || false,
        vibrate: [200, 100, 200]
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 PROD SW: Notification clicked:', event.notification);
    
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if window is already open
                for (let client of clientList) {
                    if (client.url.includes(urlToOpen) && 'focus' in client) {
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

// TODO: IndexedDB sync queue for offline POST/PUT/DELETE requests
// self.addEventListener('sync', (event) => {
//     if (event.tag === 'sync-queue') {
//         event.waitUntil(syncQueuedRequests());
//     }
// });
