/**
 * Tiny IndexedDB key/value store with a localStorage fallback.
 * Used to persist the studio project (which embeds base64 artwork).
 */

const DB_NAME = "spc-3d-studio";
const STORE = "kv";

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDB(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
  return dbPromise;
}

export async function kvGet(key: string): Promise<string | null> {
  const db = await openDB();
  if (!db) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve((req.result as string | undefined) ?? null);
    req.onerror = () => resolve(null);
  });
}

export async function kvSet(key: string, value: string): Promise<void> {
  const db = await openDB();
  if (!db) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* quota */
    }
    return;
  }
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

export async function kvDel(key: string): Promise<void> {
  const db = await openDB();
  if (!db) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* noop */
    }
    return;
  }
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}
