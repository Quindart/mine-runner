/**
 * Photo Storage Utility
 * Manages persistent photo storage using IndexedDB
 * Database: 'running-app-db', Store: 'photos'
 */

const DB_NAME = 'running-app-db';
const STORE_NAME = 'photos';

/**
 * Initialize IndexedDB connection
 * @returns {Promise<IDBDatabase>}
 */
const getDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => {
      reject(new Error(`Failed to open IndexedDB: ${request.error}`));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Save a photo to IndexedDB
 * @param {string} photoId - Unique photo identifier
 * @param {Blob} photoBlob - The image blob to store
 * @returns {Promise<void>}
 */
export const savePhoto = async (photoId, photoBlob) => {
  try {
    const db = await getDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id: photoId, blob: photoBlob });

    return new Promise((resolve, reject) => {
      request.onerror = () => {
        reject(new Error(`Failed to save photo: ${request.error}`));
      };
      request.onsuccess = () => {
        resolve();
      };
    });
  } catch (error) {
    throw new Error(`Photo save failed: ${error.message}`);
  }
};

/**
 * Load a photo from IndexedDB
 * @param {string} photoId - Unique photo identifier
 * @returns {Promise<Blob | null>}
 */
export const loadPhoto = async (photoId) => {
  try {
    const db = await getDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(photoId);

    return new Promise((resolve, reject) => {
      request.onerror = () => {
        reject(new Error(`Failed to load photo: ${request.error}`));
      };
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.blob : null);
      };
    });
  } catch (error) {
    throw new Error(`Photo load failed: ${error.message}`);
  }
};

/**
 * Delete a photo from IndexedDB
 * @param {string} photoId - Unique photo identifier
 * @returns {Promise<void>}
 */
export const deletePhoto = async (photoId) => {
  try {
    const db = await getDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(photoId);

    return new Promise((resolve, reject) => {
      request.onerror = () => {
        reject(new Error(`Failed to delete photo: ${request.error}`));
      };
      request.onsuccess = () => {
        resolve();
      };
    });
  } catch (error) {
    throw new Error(`Photo delete failed: ${error.message}`);
  }
};
