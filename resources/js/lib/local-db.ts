// Simple IndexedDB Wrapper for Note App

const DB_NAME = 'NoteAppDB';
const DB_VERSION = 1;
const STORE_NOTES = 'notes';
const STORE_CATEGORIES = 'categories';

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
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export const LocalDB = {
    async saveNotes(notes: any[]) {
        const db = await initDB();
        const tx = db.transaction(STORE_NOTES, 'readwrite');
        const store = tx.objectStore(STORE_NOTES);
        
        // Clear existing local notes first to handle deletions
        store.clear();
        
        notes.forEach(note => {
            store.put(note);
        });

        return new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },

    async getNotes(): Promise<any[]> {
        const db = await initDB();
        const tx = db.transaction(STORE_NOTES, 'readonly');
        const store = tx.objectStore(STORE_NOTES);
        const request = store.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    },

    async saveCategories(categories: any[]) {
        const db = await initDB();
        const tx = db.transaction(STORE_CATEGORIES, 'readwrite');
        const store = tx.objectStore(STORE_CATEGORIES);
        
        store.clear();
        
        categories.forEach(cat => {
            store.put(cat);
        });

        return new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },

    async getCategories(): Promise<any[]> {
        const db = await initDB();
        const tx = db.transaction(STORE_CATEGORIES, 'readonly');
        const store = tx.objectStore(STORE_CATEGORIES);
        const request = store.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }
};
