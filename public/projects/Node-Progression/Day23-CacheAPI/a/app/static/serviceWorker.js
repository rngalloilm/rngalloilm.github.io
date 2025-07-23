function log(...data) {
  console.log("SWv6.0", ...data);
}

log("SW Script executing - adding event listeners");

const STATIC_CACHE_NAME = 'ncparks-static-v2';
const OFFLINE_URL = '/offline';

// Install event listener
self.addEventListener("install", event => {
  log('Install event triggered', event);
  
  event.waitUntil(
      caches.open(STATIC_CACHE_NAME)
          .then(cache => {
              return cache.addAll([
                  OFFLINE_URL,
                  '/css/base.css',
                  '/css/error.css',
                  '/css/home.css',
                  '/css/login.css',
                  '/css/park.css',
                  '/img/ncparkmap.png',
                  '/img/park.jpg',
                  '/js/APIClient.js',
                  '/js/auth.js',
                  '/js/common.js',
                  '/js/home.js',
                  '/js/HTTPClient.js',
                  '/js/login.js',
                  '/js/park.js',
                  'https://unpkg.com/leaflet@1.9.1/dist/leaflet.css',
                  'https://unpkg.com/leaflet@1.9.1/dist/leaflet.js',
                  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css'
              ]);
          })
  );
});

// Activate event listener
self.addEventListener("activate", event => {
  log('Activate event triggered', event);
  
  event.waitUntil(
      caches.keys()
          .then(cacheNames => {
              return cacheNames.filter(
                  cacheName => cacheName.startsWith('ncparks-') && 
                             cacheName !== STATIC_CACHE_NAME
              );
          })
          .then(oldCaches => {
              return Promise.all(
                  oldCaches.map(cacheName => caches.delete(cacheName))
              );
          })
          .then(() => self.clients.claim())
  );
});

function fetchAndCache(request) {
  return fetch(request)
      .then(response => {
          if (response.ok && request.method === 'GET') {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE_NAME)
                  .then(cache => cache.put(request, responseClone));
          }
          return response;
      });
}

function cacheFirst(request) {
  return caches.match(request)
      .then(cachedResponse => {
          return cachedResponse || fetchAndCache(request);
      })
      .catch(() => {
          if (request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
          }
      });
}

// Fetch event listener
self.addEventListener("fetch", event => {
  if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(cacheFirst(event.request));
  }
});

// Message event listener
self.addEventListener('message', event => {
  log('message', event.data);
  if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
  }
});