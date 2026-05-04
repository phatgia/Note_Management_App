// ============================================================
// Service Worker - Note App PWA
// Strategy: Cache-First for assets, Network-First for pages/API
// ============================================================

const CACHE_VERSION = 'v3';
const STATIC_CACHE = `note-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `note-dynamic-${CACHE_VERSION}`;

// Static assets to pre-cache on install
const PRECACHE_ASSETS = [
    '/offline.html',
    '/manifest.json',
    '/favicon.ico',
    '/favicon.svg',
    '/apple-touch-icon.png',
];

// ---- INSTALL: pre-cache static assets ----
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// ---- ACTIVATE: clean up old caches ----
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
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

    // STRATEGY 2: Network-First for navigation & page requests
    // If network fails → serve from dynamic cache → fallback to offline.html
    if (request.mode === 'navigate' || request.headers.get('Accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(request)
                        .then((cached) => cached || caches.match('/offline.html'));
                })
        );
        return;
    }

    // STRATEGY 3: Network-First for all other requests (images, fonts, etc.)
    // Falls back to cache silently
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
                }
                return response;
            })
            .catch(() => caches.match(request))
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
