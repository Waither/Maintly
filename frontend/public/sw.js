// Maintly CMMS - Service Worker
const CACHE_NAME = 'maintly-v1';
const urlsToCache = [
	'/',
	'/index.html',
	'/manifest.json'
];

// Instalacja Service Worker
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => cache.addAll(urlsToCache))
	);
});

// Aktywacja Service Worker
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

// Obsługa żądań
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request)
			.then((response) => {
				// Zwróć z cache lub pobierz z sieci
				return response || fetch(event.request);
			})
	);
});
