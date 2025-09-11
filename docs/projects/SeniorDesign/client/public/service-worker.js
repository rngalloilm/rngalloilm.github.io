const SW_VERSION = "SWv5-Cache-v2-CacheFirst";
const STATIC_CACHE_NAME = 'roots-static-v5';

const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const CORE_ASSETS = [
    '/',
    '/index.html',                    // The main index.html shell
    OFFLINE_URL,            // The offline fallback page
    '/roots-logo.ico',      // All pictures from /public. Not sure whats required.
    '/roots-logo.png',
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png',
    
    // Note: Bundled JS/CSS will be cached dynamically later
    // Note: External resources like Google Fonts cannot be reliably added here
    //       and should also be cached dynamically via fetch.
];

function log(...data) {
  console.log(SW_VERSION, ...data);
}

log("SW Script executing - adding event listeners");

// --- Helper Fucntions ---

// Helper: Cache First Strategy
function cacheFirstStatic(request) {
    return caches.match(request)
    .then(cachedResponse => {
        // Return cached response if found, otherwise fetch from network and cache
        return cachedResponse || fetch(request).then(networkResponse => {
            // Cache the new response if valid
            if (networkResponse.ok && networkResponse.status === 200 && request.method === 'GET') {
                const responseToCache = networkResponse.clone();
                caches.open(STATIC_CACHE_NAME)
                    .then(cache => {
                        cache.put(request, responseToCache);
                    });
            }
            return networkResponse;
        });
    })
    .catch(error => {
        // Handle potential errors during fetch/cache match for static assets
        console.error("Error in cacheFirstStatic:", error);
        // Fallback for static assets might be less critical, could return simple error
        return new Response("Error fetching static asset", { status: 500 });
    });
}

// Helper: Network First, then Cache
function networkFirst(request) {
    return fetch(request)
      .then(networkResponse => {
        // Check if we received a valid response
        if (networkResponse.ok) {
          log('Network First: Network successful for:', request.url);
          // IMPORTANT: Clone the response. The browser and cache each consume a stream.
          const responseToCache = networkResponse.clone();
          caches.open(STATIC_CACHE_NAME)
            .then(cache => {
              log('Network First: Caching response for:', request.url);
              cache.put(request, responseToCache);
            });
          return networkResponse;
        }
        // If response is not ok (404, 500, ...), don't cache, just return it
        log('Network First: Network responded with error for:', request.url, networkResponse.status);
        return networkResponse;
    })
    .catch(error => {
        // Network failed, probably offline
        log('Network First: Network failed for:', request.url, error);
        log('Network First: Trying cache...');
        return caches.match(request)
          .then(cachedResponse => {
            if (cachedResponse) {
              log('Network First: Serving from cache after network failure:', request.url);
              return cachedResponse;
            }
            // If neither network nor cache works, return an error or offline page
            log('Network First: Not in cache either. Serving offline response/error.');
            // You could return the offline page or a specific API error response
            // For API calls, an error response:
            return new Response(JSON.stringify({ error: "offline or fetch failed" }), {
              headers: { 'Content-Type': 'application/json' },
              status: 503,
              statusText: 'Service Unavailable (Offline/Network Error)'
            });
            // return caches.match(OFFLINE_URL); // Less useful for API calls
          });
    });
}

function openQueueDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('offlineQueueDB', 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore('queue', { keyPath: 'timestamp' });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function saveToQueue(data) {
    openQueueDB().then(db => {
        const tx = db.transaction('queue', 'readwrite');
        const store = tx.objectStore('queue');
        store.put(data);
        return tx.complete;
    }).catch(err => log('Failed to save to queue:', err));
}

function flushQueue() {
    openQueueDB().then(db => {
        const tx = db.transaction('queue', 'readwrite');
        const store = tx.objectStore('queue');
        const getAllReq = store.getAll();

        getAllReq.onsuccess = async () => {
            const allRequests = getAllReq.result;
            for (const req of allRequests) {
                try {
                    await fetch(req.url, {
                        method: req.method,
                        headers: req.headers.reduce((acc, [k, v]) => { acc[k] = v; return acc; }, {}),
                        body: req.body
                    });
                    store.delete(req.timestamp);
                    log('Flushed offline request:', req.url);
                } catch (err) {
                    log('Failed to send queued request, keeping it:', req.url);
                }
            }
        };
    });
}

// --- Event Listeners ---

// Fired when the browser installs the service worker.
// Often used to cache static assets.
self.addEventListener("install", event => {
    log('Install event triggered', event);
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
        .then(cache => {
            log('Cache opened:', STATIC_CACHE_NAME);
            log('Attempting to cache core assets:', CORE_ASSETS);
            // Fails if any asset fails
            return cache.addAll(CORE_ASSETS);
        })
        .then(() => {
            log('Core assets cached successfully.');
            // Optional: Force the waiting SW to become the active SW
            // Use this if you don't want to use the update prompt, only if you're sure activation cleanup is safe
            // return self.skipWaiting();
        })
        .catch(error => {
            console.error('Failed to cache core assets during install:', error);
            // Optional: Decide if installation should fail if caching fails.
            // Usually, you do want it to fail if core assets aren't cached.
        })
    );
});

// Fired when the service worker becomes active.
// Often used to clean up old caches or claim clients.
self.addEventListener("activate", event => {
    log('Activate event triggered', event);
    // Clean up old caches and then claim clients
    event.waitUntil(
        caches.keys()
        .then(cacheNames => {
            log('Found caches:', cacheNames);
            // Filter for caches belonging to this app but not the current static cache
            return cacheNames.filter(
            // Process goes through each cache name, like roots-static-v2
            cacheName => cacheName.startsWith('roots-static-') &&
                cacheName !== STATIC_CACHE_NAME
            );
        })
        .then(oldCacheNames => {
            if (oldCacheNames.length > 0) {
                log('Deleting old caches:', oldCacheNames);
                return Promise.all(
                    oldCacheNames.map(cacheName => caches.delete(cacheName))
                );
            } else {
                log('No old caches to delete.');
                // Resolve immediately if no caches to delete
                return Promise.resolve();
            }
        })
        .then(() => {
            log('Old caches deleted successfully (if any). Claiming clients...');
            // Claim clients after cleanup
            return self.clients.claim();
        })
        .then(() => {
            // Flush the API queue
            if (typeof flushQueue === 'function') {
                log('Flushing offline queue...');
                return flushQueue();
            } else {
                log('flushQueue is not defined or not a function.');
                return Promise.resolve();
            }
        })
        .catch(error => {
            console.error('Error during cache cleanup or claiming clients:', error);
        })
    );
});

// Fired whenever the browser attempts to fetch a resource
// (HTML, CSS, JS, images, API calls, etc.) controlled by the SW.
self.addEventListener("fetch", event => {
    const requestUrl = new URL(event.request.url);


    // Use Network First for API calls, Cache First for others
    if (requestUrl.pathname.startsWith('/api/')) {
        log('Handling fetch event with Network First for API:', event.request.url);
        event.respondWith(networkFirst(event.request)); // Use the new helper
    }
    // Handle navigation requests (HTML pages) with Cache First, falling back to offline page
    else if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        log('Handling fetch event with Cache First (offline fallback) for Navigation:', event.request.url);
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        log('Serving navigation request directly from cache:', event.request.url);
                        return cachedResponse;
                    }

                    // 2. If not in cache, try the network
                    log('Navigation request not in cache, trying network:', event.request.url);
                    return fetch(event.request)
                        .catch(networkError => {
                            log('Network fetch failed for navigation request:', event.request.url, networkError);
                            // 3. Fallback to the index.html from cache INSTEAD of offline.html
                            log('Attempting to serve app shell (/index.html) from cache');
                            return caches.match('/index.html')
                               .then(appShellResponse => {
                                   if (appShellResponse) {
                                     log('Serving app shell for SPA route:', event.request.url);
                                        return appShellResponse;
                                    } else {
                                        log('App shell not found in cache, serving offline page.');
                                        return caches.match(OFFLINE_URL);
                                    }
                                 });
                        });
                })
                .catch(error => { // Catch potential errors from caches.match itself (No change here)
                    log('Serving offline page due to unexpected error.');
                    return caches.match(OFFLINE_URL);
                })
        );
    } else if ((event.request.method === 'POST' || event.request.method === 'PUT') && requestUrl.pathname.startsWith('/api/')) {
            event.respondWith(
                fetch(event.request.clone())
                .catch(() => {
                    log('Queuing offline request:', event.request.url);
                    event.request.clone().text().then(body => {
                        const queuedRequest = {
                            url: event.request.url,
                            method: event.request.method,
                            headers: [...event.request.headers],
                            body,
                            timestamp: Date.now()
                        };
                        saveToQueue(queuedRequest); // Save request to IndexedDB, not cache
                    });
                    return new Response(JSON.stringify({ queued: true, message: "Request saved for later." }), {
                        status: 202,
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
            );
            return; // Prevent other caching strategies from applying here
        }
    // Use Cache First for other same-origin static assets (JS, CSS, images)
    else if (requestUrl.origin === location.origin) {
        log('Handling fetch event with Cache First for Static Asset:', event.request.url);
        event.respondWith(cacheFirstStatic(event.request)); // Use a potentially simpler cacheFirst for static
    }
    // Let non-origin requests pass through (like before)
    else {
        log('Ignoring non-origin fetch event:', event.request.url);
    }

    // Keep the message posting for debugging if needed
    if (event.clientId) {
        self.clients.get(event.clientId).then(client => {
            if (client && 'postMessage' in client) { client.postMessage({ type: 'FETCH_HANDLED', strategy: 'Dynamic', url: event.request.url }); }
        }).catch(err => { log('Error getting client for message:', err); });
    }
});

// Listen for messages FROM the client (the update prompt)
// Remove if using return self.skipWaiting();
self.addEventListener('message', event => {
    log('Message received:', event.data);
    if (event.data && event.data.action === 'skipWaiting') {
        log('skipWaiting action received, calling self.skipWaiting()...');
        // Tells the waiting service worker to activate immediately
        self.skipWaiting();
    }
});