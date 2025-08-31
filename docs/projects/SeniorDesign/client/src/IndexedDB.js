const DB_NAME = 'OfflineDB';
const DB_VERSION = 1;

const fieldOfflineTable = [
  { name: 'trees', keyPath: 'treeId' },
  { name: 'cones', keyPath: 'id' },
  { name: 'seeds', keyPath: 'id' },
  { name: 'ramets', keyPath: 'id' },
  { name: 'locations', keyPath: 'location' },
  { name: 'species', keyPath: 'species' },
  { name: 'populations', keyPath: 'id' },
  { name: 'geneticIds', keyPath: 'id' },
];

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      fieldOfflineTable.forEach(table => {
        if (!db.objectStoreNames.contains(table.name)) {
          const storeOptions = { keyPath: table.keyPath };
           if (table.autoIncrement) {
              storeOptions.autoIncrement = true;
           }
           db.createObjectStore(table.name, storeOptions);
        }
      });
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// Generic function to save an entry in a specific table
async function saveEntry(table, entry) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(table, 'readwrite');
    const store = transaction.objectStore(table);
    const keyPath = store.keyPath;
    if (!entry[store.keyPath]) return reject(new Error(`Missing keyPath "${store.keyPath}"`));
    const request = store.put(entry);
    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// Get an entry offline
async function getEntryById(table, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(table, 'readonly');
    const store = transaction.objectStore(table);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// Adds a new entry created while offline.
async function addOfflineEntry(table, entryData) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(table, 'readwrite');
    const store = transaction.objectStore(table);
    const tableConfig = fieldOfflineTable.find(t => t.name === table);
    if (!tableConfig) {
      return reject(new Error(`Table configuration not found for "${table}"`));
    }
    const keyPath = store.keyPath;

    // --- Crucial Check: Ensure the primary key exists ---
    if (!entryData[keyPath]) {
      return reject(new Error(`Missing required primary key "${keyPath}" for offline add.`));
    }
    const request = store.add(entryData);

    request.onsuccess = () => resolve({ ...entryData });
    request.onerror = (event) => reject(event.target.error);
  });
}

async function editOfflineEntry(table, updatedEntryData) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(table, 'readwrite');
    const store = transaction.objectStore(table);
    const tableConfig = fieldOfflineTable.find(t => t.name === table);
    if (!tableConfig) {
        return reject(new Error(`Table configuration not found for "${table}"`));
    }
    const keyPath = tableConfig.keyPath;

    // Ensure the primary key value exists in the entry being updated
    if (!updatedEntryData[keyPath]) {
        return reject(new Error(`Missing required primary key "${keyPath}" for offline edit.`));
    }

    // Use put to overwrite the existing record or insert if not found
    const request = store.put(updatedEntryData);

    request.onsuccess = () => resolve({ ...updatedEntryData });
    request.onerror = (event) => reject(event.target.error);
  });
}

// Retrieve all entries from a specific table
async function getAllEntries(table) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(table, 'readonly');
    const store = transaction.objectStore(table);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Archive a specific entry from a table
async function archiveEntry(table, entry) {
  const db = await openDB();
  return new Promise(async (resolve, reject) => {
    const transaction = db.transaction(table, 'readwrite');
    const store = transaction.objectStore(table);
    store.delete(entry);
    transaction.oncomplete = () => {
      resolve(`Entry ${entry} archived (deleted locally).`);
    };
    transaction.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Clear all stored entries in a table
async function clearEntries(table) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(table, 'readwrite');
    const store = transaction.objectStore(table);
    store.clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export { openDB, saveEntry, editOfflineEntry, getAllEntries, addOfflineEntry, archiveEntry, clearEntries, getEntryById, fieldOfflineTable};
