// Enhanced IndexedDB Wrapper for Note App PWA

const DB_NAME = 'NoteAppDB';
const DB_VERSION = 2; // bump version to trigger upgrade for new store
const STORE_NOTES = 'notes';
const STORE_CATEGORIES = 'categories';
const STORE_SYNC_QUEUE = 'sync_queue'; // NEW: queue for offline edits

function initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NOTES)) {
                db.createObjectStore(STORE_NOTES, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORE_CATEGORIES)) {
                db.createObjectStore(STORE_CATEGORIES, { keyPath: 'id' });
            }
            // NEW: sync queue store — auto-increment id
            if (!db.objectStoreNames.contains(STORE_SYNC_QUEUE)) {
                db.createObjectStore(STORE_SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export const LocalDB = {
    // --- NOTES ---
    async saveNotes(notes: any[]) {
        const db = await initDB();
        const tx = db.transaction(STORE_NOTES, 'readwrite');
        const store = tx.objectStore(STORE_NOTES);
        store.clear();
        notes.forEach(note => store.put(note));
        return new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },

    async saveNote(note: any) {
        const db = await initDB();
        const tx = db.transaction(STORE_NOTES, 'readwrite');
        tx.objectStore(STORE_NOTES).put(note);
        return new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },

    async getNotes(): Promise<any[]> {
        const db = await initDB();
        const tx = db.transaction(STORE_NOTES, 'readonly');
        const request = tx.objectStore(STORE_NOTES).getAll();
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    },

    async getNoteById(id: number): Promise<any | null> {
        const db = await initDB();
        const tx = db.transaction(STORE_NOTES, 'readonly');
        const request = tx.objectStore(STORE_NOTES).get(id);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    },

    // --- CATEGORIES ---
    async saveCategories(categories: any[]) {
        const db = await initDB();
        const tx = db.transaction(STORE_CATEGORIES, 'readwrite');
        const store = tx.objectStore(STORE_CATEGORIES);
        store.clear();
        categories.forEach(cat => store.put(cat));
        return new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },

    async getCategories(): Promise<any[]> {
        const db = await initDB();
        const tx = db.transaction(STORE_CATEGORIES, 'readonly');
        const request = tx.objectStore(STORE_CATEGORIES).getAll();
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    },

    // --- SYNC QUEUE (offline edits waiting to be synced) ---
    async addToSyncQueue(item: { noteId: number; type: 'update'; data: any }) {
        const db = await initDB();
        const tx = db.transaction(STORE_SYNC_QUEUE, 'readwrite');
        tx.objectStore(STORE_SYNC_QUEUE).add({ ...item, timestamp: Date.now() });
        return new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },

    async getSyncQueue(): Promise<any[]> {
        const db = await initDB();
        const tx = db.transaction(STORE_SYNC_QUEUE, 'readonly');
        const request = tx.objectStore(STORE_SYNC_QUEUE).getAll();
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    },

    async clearSyncQueue() {
        const db = await initDB();
        const tx = db.transaction(STORE_SYNC_QUEUE, 'readwrite');
        tx.objectStore(STORE_SYNC_QUEUE).clear();
        return new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },

    async removeSyncQueueItem(id: number) {
        const db = await initDB();
        const tx = db.transaction(STORE_SYNC_QUEUE, 'readwrite');
        tx.objectStore(STORE_SYNC_QUEUE).delete(id);
        return new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },
};
