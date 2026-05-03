const CACHE_NAME = 'note-app-cache-v1';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    '/offline.html',
    // In a real PWA, you'd cache the built JS/CSS files here, but since Vite hashes them, 
    // we rely on the runtime cache to pick them up when the user visits the site online.
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // We only want to handle GET requests
    if (event.request.method !== 'GET') return;

    // For API requests or Inertia XHR requests, we try network first, then cache
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Don't cache non-successful responses or opaque responses (unless we really want to)
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response because it's a stream and can only be consumed once
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            })
            .catch(() => {
                // If network fails, look in cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // If it's a navigation request and it's not in cache, fallback to a generic HTML or `/home` cached version
                    if (event.request.mode === 'navigate') {
                        return caches.match('/home') || caches.match('/offline.html');
                    }
                });
            })
    );
});
