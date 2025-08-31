# Activity 23.a: Using the NC Parks App While Offline

In this activity, you will use the browser's Cache API in the NC Parks app service worker to store assets for offline use.

## Activity Resources

1. [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) on MDN
2. [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) on MDN
3. [CacheStorage API](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) on MDN
4. Assets
   * [Starter Files](files/)

## Task 1: Setting Up the Folder Structure

In this task, you will initialize the folder structure for this activity and populate necessary environment variables.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Place the provided files in this new folder.
3. Create a file called `.env` and populate it with the contents of the provided `.env.example` file. Fill in the values for the environment variables as needed.
4. Open a terminal and navigate to the folder of this activity.
5. Run the Docker Compose stack by executing the following command:
    ```bash
    docker compose up
    ```
6. Inspect the output of the command to verify that the containers are running without errors and that the database container has finished initializing. You will see a message indicating that the database is ready to accept connections.
7. Open your browser and navigate to `http://localhost:3000`. You should see the NC Parks app running and prompting you to log in.


## Task 2: Adding an Offline Page

In this task, you will add a new page to the NC Parks app that will be used to display a gracefull offline error message when the user tries to use the app without an internet connection.

### Steps

1. Make sure that you have an `offline.html` file in the `templates` folder of the app.
2. Add a new frontend route to the app on `/offline` that will render the `offline.html` file.
3. You should be able to see this page by navigating to `http://localhost:3000/offline` in your browser.


## Task 3: Initializing a Static Cache When the Service Worker is Installed

In this task, you will initialize the static cache for the app when the service worker installs with the basic static assets needed by the app.

### Steps

1. Open the `static/serviceWorker.js` file.
2. Create a global constant called `STATIC_CACHE_NAME` with the value `ncparks-static-v0`. We are using a version number in the cache name to keep track of changes to the cache.
3. In the `install` event listener, you will want to call the `waitUntil` method on the event object to ensure that the service worker does not finish installing until the cache is populated.
    1. Wait until you open the cache storage using the `caches.open` method using the `STATIC_CACHE_NAME` constant as the name of the cache.
        ```js
        event.waitUntil(
          caches.open(STATIC_CACHE_NAME)
        );
        ```
    2. The `caches.open` method returns a promise that resolves with the cache object. Add a `.then` block to this promise and use the `addAll` method of the cache object to add the following assets to the cache. Remember to return the promise returned by the `addAll` method.
        * The offline page at `/offline`
        * All CSS files
        * All image files
        * All JavaScript files
        * The following external URLs:
            * `https://unpkg.com/leaflet@1.9.1/dist/leaflet.css`
            * `https://unpkg.com/leaflet@1.9.1/dist/leaflet.js`
            * `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css`
4. Test the service worker by refreshing the app and checking the cache storage in the browser's developer tools under the "Application" tab. You should see the `ncparks-static-v0` cache with the assets you added.
5. Change the `STATIC_CACHE_NAME` constant to `ncparks-static-v1` to simulate a new version of the cache. You can also increment the version of the service worker in the log function for debugging purposes.
6. Save the file and refresh the app. Make sure the new service worker is activated. If everything is working proerly, you should see both the old and the new caches with the assets you added.

## Task 4: Cleaning Up Old Caches When the Service Worker Activates

In this task, you will modify the service worker to clean up old caches when a new version of the service worker is about to activate. We have a new service worker with a new cache, so we want to remove the old cache from the old service worker to free up space.

### Steps

1. Change the `STATIC_CACHE_NAME` constant to `ncparks-static-v2` to simulate a new version of the cache. You can also increment the version of the service worker in the log function for debugging purposes.
2. In the `activate` event listener, you will want to call the `waitUntil` method on the event object to ensure that the service worker does not finish activating until the old caches are cleaned up. The parameter to this function should be a promise that resolves when the old caches are cleaned up. Use the `caches.keys` method to get a list of all the cache names:
    ```js
    event.waitUntil(
      caches.keys()
    );
    ```
3. The `caches.keys` method returns a promise that resolves with an array of cache names. Add a `.then` block to this promise and use the `filter` method to filter out the new cache and caches with names that do not start with `ncparks-`. You can use the `STATIC_CACHE_NAME` constant to check if the name of the cache is the new one. This will return an array of cache names that are old caches from the NC Parks app.
    ```js
    return cacheNames.filter(cacheName => cacheName.startsWith('ncparks-') && cacheName != STATIC_CACHE_NAME)
    ```
4. Add another `.then` block to the promise chain that will receive an array of old cache names and use the `Promise.all` method to create an array of promises that resolve when each old cache is deleted. You can use the `map` method to create an array of promises that resolve when each cache is deleted. Remember to return the promise returned by the `Promise.all` method.
    ```js
    return Promise.all(
      oldCaches.map(cacheName => caches.delete(cacheName))
    );
    ```
5. Save the file and refresh the app. Make sure the new service worker is activated. If everything is working properly, you should see only the latest cache with the assets you added and the old caches should be removed.


## Task 5: Storing Fetched Assets in the Cache

In this task, you will modify the service worker to cache intercepted fetch requests beyond the static assets that were cached when the service worker was installed. We will only cache GET requests that are successful.

### Steps

1. Create a new helper function called `fetchAndCache` that takes a request object as parameter. This function will make a request and store successful GET responses in the cache.
    1. Issue a `fetch` request to the network using the request object. Make sure to return the promise returned by the `fetch` method.
        ```js	
        return fetch(request);
        ```
    2. Add a `.then` block to the promise returned by the `fetch` method to handle the response.
    3. If the response is successful (`response.ok` is `true`) and the request method is `GET`, store the response in the cache by opening it using the `caches.open` method with the `STATIC_CACHE_NAME` constant as the name of the cache. You will need to use the `put` method of the cache object to store the response.
    4. At the end (but inside) of the `.then` block, return a clone of the response object.
        ```js
        return response.clone();
        ```
2. Now in the `fetch` event listener, you will want to call the `respondWith` method on the event object to intercept the fetch request and respond with the result of the `fetchAndCache` function:
    ```js
    event.respondWith(
      fetchAndCache(event.request)
    );
    ```
3. Refresh the app and make sure that the new service worker is activated.
4. Log into the app and navigate to different park detail pages.
5. Check the cache storage in the browser's developer tools under the "Application" tab. You should see the following behavior:
    1. The `ncparks-static-v2` cache populated with all the static assets you requested initially
    2. Additional entries for the park detail pages you visited and API calls.
    3. When you switch on offline mode, the parks app is no longer accessible and fetch requests fail. You will see a browser error.

## Task 6: Responding with Cached Assets - Cache First Strategy

In this task, you will implement a cache-first strategy in the service worker to respond with cached assets, if available. If there are no matching cached assets, and the user is offline, the service worker will respond with the offline page.

### Steps

1. Create a helper method called `cacheFirst` that takes a request object as parameter. This function will check if the request is in the cache and respond with the cached response if it exists. If the response is not cached, the function will use the `fetchAndCache` function to fetch the response from the network. If this fails, the function will respond with the offline page.
    1. Use the `caches.match` method to check if the request is in the cache. If it is, respond with the cached response.
        ```js
        return caches.match(request);
        ```
    2. Add a `.then` block to the promise returned by the `caches.match` method to handle the response.
    3. If the response is not `undefined`, return the cached response.
    4. If the response is `undefined`, return the response returned by the `fetchAndCache` function.
    5. Add a `.catch` block after the `.then` block to handle any errors that occur when fetching the response. If an error occurs, respond with the cached offline page.
        ```js
        return caches.match('/offline');
        ```
2. In the `fetch` event listener, you will want to replace parameter to the `respondWith` method with the result of the `cacheFirst` function:
    ```js
    event.respondWith(
      cacheFirst(event.request)
    );
    ```
3. Refresh the app and make sure that the new service worker is activated. If everything is workign properly, you should be able to stop your server (or set the browser to offline mode) and see the following behavior:
    1. You can still navigate to the park detail pages you visited earlier.
    2. For pages you have not visited ealier, you should see the offline page instead of a browser error.

## Bonus Task 7: Responding with Cached Assets - Network First Strategy

In this bonus task, you will implement a network-first strategy in the service worker. This strategy will attempt to fetch the response from the network and only use the cache if the network request fails. If both the network request and the cache request fail, the service worker will respond with the offline page.

### Steps

1. Create a helper method called `networkFirst` that takes a request object as parameter.
2. In this function you will:
    1. Use the `fetchAndCache` function to fetch the response from the network.
    2. If the network request fails, return the result of calling the `caches.match` method with the request object as parameter.
    3. Add a `.then` block after the `.catch` block to handle the response from the cache.
        1. If the response exists, return it.
        2. If the response is `undefined` respond with the offline page from the cache.

3. In the `fetch` event listener, replace the parameter to the `respondWith` method with the result of the `networkFirst` function:
    ```js
    event.respondWith(
      networkFirst(event.request)
    );
    ```
4. Refresh the app and make sure that the new service worker is activated. If everything is workign properly, you should be able to stop your server (or set the browser to offline mode) and see the same behavior as with the cache-first strategy, but the content may take a little longer to show when offline if you are on a slower network. You can test this by setting the network speed in the browser's developer tools to "Slow 3G" and comparing both strategies.

## Bonus Task 8: Hybrid Caching Strategy

In this task, you will use the network-first caching strategy for `GET` API calls and the cache-first strategy for non-API requests.

### Steps

1. In the `fetch` event listener, you will:
    1. Create a constant called `requestURL` and set it to the `url` property of the request object.
        ```js
        const requestURL = new URL(event.request.url);
        ```
    2. Check if the origin of the request URL is the same as the origin of the app, and if the `pathname` of the URL of the request starts with `/api`. If so, and if this is a `GET` request, use the `networkFirst` function to respond to the request.
    3. If the request is not an API request, use the `cacheFirst` function to respond to the request.
2. You can test this by setting the network speed in the browser's developer tools to "Slow 3G" and comparing how quickly your application resolves different requests.