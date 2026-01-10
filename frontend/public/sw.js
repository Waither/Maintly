// Service Worker for PWA with API request exclusion
const CACHE_NAME = 'maintly-v2'; // Incremented to force cache refresh
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('✅ Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ Service Worker: Caching static assets');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker: Activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - EXCLUDE /api/* requests from caching
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // CRITICAL: Don't intercept API requests (prevent CORS issues)
    if (url.pathname.startsWith('/api/') || url.port === '8000') {
        return; // Let request go directly to network
    }
    
    // Cache-first strategy for static assets
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response; // Return cached version
                }
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-GET requests or non-200 responses
                        if (event.request.method !== 'GET' || !response || response.status !== 200) {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    });
            })
            .catch(() => {
                // Offline fallback (optional)
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            })
    );
});
