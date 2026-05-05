// ============================================================
// Service Worker - Note App PWA
// Strategy: Cache-First for assets, Network-First for pages/API
// ============================================================

const CACHE_VERSION = 'v5';
const STATIC_CACHE = `note-static-${CACHE_VERSION}`;
const DYNAMIC_HTML_CACHE = `note-html-${CACHE_VERSION}`;
const DYNAMIC_INERTIA_CACHE = `note-inertia-${CACHE_VERSION}`;
const DYNAMIC_ASSETS_CACHE = `note-assets-${CACHE_VERSION}`;

// Static assets to pre-cache on install
const PRECACHE_ASSETS = [
    '/offline.html',
    '/manifest.json',
    '/favicon.ico',
    '/favicon.svg',
    '/apple-touch-icon.png',
];

// ---- INSTALL: pre-cache static assets robustly ----
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                // Tải từng file độc lập để không làm hỏng toàn bộ quá trình install nếu 1 file bị lỗi 404
                return Promise.allSettled(
                    PRECACHE_ASSETS.map(url => 
                        fetch(url).then(response => {
                            if (!response.ok) throw new Error('Not ok');
                            return cache.put(url, response);
                        }).catch(err => console.warn('[SW] Failed to cache asset:', url))
                    )
                );
            })
            .then(() => self.skipWaiting())
    );
});

// ---- ACTIVATE: clean up old caches ----
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => !name.includes(CACHE_VERSION))
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// ---- FETCH: smart caching strategy ----
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Only handle same-origin GET requests
    if (request.method !== 'GET' || url.origin !== self.location.origin) return;

    // Skip hot-reload and dev server requests
    if (url.pathname.startsWith('/@') || url.pathname.includes('__vite')) return;

    // STRATEGY 1: Cache-First for Vite build assets (hashed filenames = safe to cache forever)
    if (url.pathname.startsWith('/build/')) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // STRATEGY 2: Network-First for navigation & HTML requests
    if (request.mode === 'navigate' || request.headers.get('Accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(DYNAMIC_HTML_CACHE).then((cache) => cache.put(request.url, clone));
                    }
                    return response;
                })
                .catch(() => {
                    return caches.open(DYNAMIC_HTML_CACHE).then(cache => cache.match(request.url, { ignoreSearch: true }))
                        .then((cached) => cached || caches.match('/offline.html'));
                })
        );
        return;
    }

    // STRATEGY 3: Network-First for Inertia JSON requests
    if (request.headers.has('x-inertia')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        // Cache using the full URL including Inertia headers by using request object
                        caches.open(DYNAMIC_INERTIA_CACHE).then((cache) => cache.put(request.url, clone));
                    }
                    return response;
                })
                .catch(() => {
                    return caches.open(DYNAMIC_INERTIA_CACHE).then(cache => cache.match(request.url, { ignoreSearch: true })).then((cached) => {
                        if (cached) return cached;
                        // If no Inertia cache, we can't fall back to HTML because Inertia expects JSON
                        return new Response(JSON.stringify({ error: 'offline' }), {
                            status: 503,
                            headers: { 'Content-Type': 'application/json', 'X-Inertia': 'true' }
                        });
                    });
                })
        );
        return;
    }

    // STRATEGY 4: Network-First for all other requests (images, fonts, APIs)
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(DYNAMIC_ASSETS_CACHE).then((cache) => cache.put(request.url, clone));
                }
                return response;
            })
            .catch(() => caches.open(DYNAMIC_ASSETS_CACHE).then(cache => cache.match(request.url, { ignoreSearch: true })))
    );
});

// ---- BACKGROUND SYNC: flush offline edits when back online ----
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-notes') {
        event.waitUntil(flushSyncQueue());
    }
});

async function flushSyncQueue() {
    // Open IndexedDB and get pending sync items
    const db = await openIDB();
    const items = await getAllFromStore(db, 'sync_queue');

    for (const item of items) {
        try {
            const response = await fetch(`/note-detail/${item.noteId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-HTTP-Method-Override': 'PUT',
                    'X-CSRF-TOKEN': item.data._token || '',
                },
                body: JSON.stringify(item.data),
            });

            if (response.ok) {
                await deleteFromStore(db, 'sync_queue', item.id);
                console.log(`[SW] Synced note ${item.noteId} successfully`);
            }
        } catch (err) {
            console.log(`[SW] Failed to sync note ${item.noteId}:`, err);
        }
    }
}

// Minimal IndexedDB helpers for Service Worker (cannot import modules)
function openIDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('NoteAppDB', 2);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('notes')) db.createObjectStore('notes', { keyPath: 'id' });
            if (!db.objectStoreNames.contains('categories')) db.createObjectStore('categories', { keyPath: 'id' });
            if (!db.objectStoreNames.contains('sync_queue')) db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
        };
    });
}

function getAllFromStore(db, storeName) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const req = tx.objectStore(storeName).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
    });
}

function deleteFromStore(db, storeName, id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}
