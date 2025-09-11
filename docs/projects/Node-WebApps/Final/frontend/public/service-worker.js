const STATIC_CACHE_NAME = 'minipack-static-v1';
const OFFLINE_URL = '/offline.html';
const APP_SHELL_URL = '/index.html';


const STATIC_ASSETS = [
  '/',
  APP_SHELL_URL,
  OFFLINE_URL,
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/css/main.chunk.css',
  '/manifest.json',
  'icon-192x192.png',
  'icon-256x256.png',
  'icon-384x384.png',
  'icon-512x512.png'
  
];

self.addEventListener('install', event => {
    console.log('SWv1.0 Install → caching app shell');
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
        .then(cache => cache.addAll(STATIC_ASSETS))
    );
});

// Helper: fetch from network and cache successful GETs
function fetchAndCache(request) {
    return fetch(request)
    .then(response => {
        if (response.ok && request.method === 'GET') {
            const clone = response.clone();
            caches.open(STATIC_CACHE_NAME)
            .then(cache => cache.put(request, clone));
        }
        return response;
    });
}
  
// Helper: cache‑first for non‑API assets
function cacheFirst(request) {
    return caches.match(request)
    .then(cached => cached || fetchAndCache(request))
    .catch(() => {
        // If HTML page fails altogether, show offline shell
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline');
        }
    });
}
  
// Helper: network‑first for API GET requests
function networkFirst(request) {
    return fetchAndCache(request)
    .catch(() => caches.match(request))
    .then(response => response || caches.match('/offline'));
}
  
// The hybrid fetch listener
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
  
    // If same‑origin API GET, try network first
    if (
        url.origin === location.origin &&
        url.pathname.startsWith('/api') &&
        request.method === 'GET'
    ) {
        event.respondWith(networkFirst(request));
        return;
    }
  
    // Otherwise, serve from cache first
    event.respondWith(cacheFirst(request));
});

self.addEventListener('activate', event => {
    console.log('SWv1.0 Activate → clearing out old caches');
    event.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames
                .filter(name => name !== STATIC_CACHE_NAME)
                .map(name => caches.delete(name))
            );
        })
        .then(() => {
            // Start controlling all open clients without reloading
            return self.clients.claim();
        })
    );
});