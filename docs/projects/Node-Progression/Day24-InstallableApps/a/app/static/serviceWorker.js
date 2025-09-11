function log(...data) {
  console.log("SWv1.0", ...data);
}

log("SW Script executing - adding event listeners");

const STATIC_CACHE_NAME = 'ncparks-static-v1';

self.addEventListener('install', event => {
  log('install', event);

  // As soon as this method returns, the service worker is considered installed
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      return cache.addAll([
        '/offline',
        //CSS
        '/css/base.css',
        '/css/error.css',
        '/css/home.css',
        '/css/login.css',
        '/css/offline.css',
        '/css/park.css',
        //Images
        '/img/ncparkmap.png',
        '/img/park.jpg',
        //Scripts
        '/js/APIClient.js',
        '/js/auth.js',
        '/js/common.js',
        '/js/home.js',
        '/js/HTTPClient.js',
        '/js/login.js',
        '/js/park.js',
        //External Resources
        'https://unpkg.com/leaflet@1.9.1/dist/leaflet.css',
        'https://unpkg.com/leaflet@1.9.1/dist/leaflet.js',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  log('activate', event);

  // As soon as this method returns, the service worker is considered active
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => cacheName.startsWith('ncparks-') && cacheName != STATIC_CACHE_NAME)
    }).then(oldCaches => {
      return Promise.all(
        oldCaches.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);
  //Treat API calls (to our own API) differently
  if(requestURL.origin === location.origin && requestURL.pathname.startsWith('/api')) {
    //If we are here, we are intercepting a call to our API
    if(event.request.method === "GET") {
      //Only intercept (and cache) GET API requests
      event.respondWith(
        networkFirst(event.request)
      );
    }
  }
  else {
    //If we are here, this was not a call to our API
    event.respondWith(
      cacheFirst(event.request)
    );
  }

});

function fetchAndCache(request) {
  return fetch(request).then(response => {
    const requestUrl = new URL(request.url);
    //Cache successful GET requests that are not browser extensions
    if(response.ok && request.method === "GET") {
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        cache.put(request, response);
      });
    }
    return response.clone();
  });
}


function cacheFirst(request) {
  return caches.match(request)
  .then(response => {
    //Return a response if we have one cached. Otherwise, get from the network
    return response || fetchAndCache(request);
  })
  .catch(error => {
    // This will only be called if there is an error fetching from the network
    return caches.match('/offline');
  });
}

function networkFirst(request) {
  return fetchAndCache(request)
  .catch(error => {
    //If we get an error, try to return from cache
    return caches.match(request);
  })
  .then(response => {
    return response || caches.match('/offline');
  });
}

self.addEventListener('message', event => {
  log('message', event.data);
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
