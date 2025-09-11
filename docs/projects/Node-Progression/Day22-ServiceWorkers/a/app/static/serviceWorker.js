function log(...data) {
    console.log("SWv5.0", ...data);
}

log("SW Script executing - adding event listeners");

// Install event listener
self.addEventListener("install", event => {
    log('Install event triggered', event);
    // Optional: Skip waiting to activate the new SW immediately
    // self.skipWaiting();
});

// Activate event listener
self.addEventListener("activate", event => {
    log('Activate event triggered', event);
    // Optional: Claim clients to take control of all pages
    // event.waitUntil(self.clients.claim());
});

// Fetch event listener
self.addEventListener("fetch", event => {
    log('Fetch event triggered', event);

    self.clients.get(event.clientId).then(client => {
    if(client)
        client.postMessage({url: event.request.url});
    });
});

// Message event listener
self.addEventListener('message', event => {
    log('message', event.data);
    if(event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });