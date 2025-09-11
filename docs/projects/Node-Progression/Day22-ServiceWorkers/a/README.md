# Activity 22.a: A Service Worker for the NC Parks App

In this activity, we will add a service worker to the NC Parks app and add functionality to manage its lifecycle. We will also explore how to send messages between the service worker and the app.

## Activity Resources

1. [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) on MDN
2. Assets
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

## Task 2: Registering Our First Service Worker

### Steps

1. Create a new file called `serviceWorker.js` in the `static` folder of the app.
2. Add the following code to the `serviceWorker.js` file. This code will create a helper function `log` that will log messages to the console with a prefix indicating that the message is coming from a specific service worker, so we can differentiate between different versions of the service worker. We will call this method in the body of the service worker to show when the script is run.
    ```js
    function log(...data) {
      console.log("SWv1.0", ...data);
    }

    log("SW Script executing - adding event listeners");
    ```
3. Add event listeners to the service worker to handle the `install` and `activate` events. In each event listener, use the `log` function to log a message to the console indicating that the event has been triggered and the event object. For example:
    ```js
    self.addEventListener("install", event => {
      log('install', event);
    });
    ```
4. Now open the `common.js` file in the `static/js` folder of the app. Remember that this file is included in every one of our pages, so it is a good place to register our service worker.
5. Find the function called `registerServiceWorker`, which we will use to handle the bulk of the service worker logic on the app side. You will notice that we are calling this function right away.
6. In this function, first check that the browser supports service workers. If it doesn't, return early. Being able to stop the function early is why we are using a function instead of just running the code directly.
  	```js
    if (!navigator.serviceWorker) { // Are SWs supported?
      return;
    }
    ```
7. Next, register the service worker by calling `navigator.serviceWorker.register` with the path to the service worker script. This will return a promise that resolves to the service worker registration object.
    ```js
    navigator.serviceWorker.register('/serviceWorker.js')
      .then((registration) => {
        // YOUR CODE HERE
      })
      .catch(error => {
        console.error(`Registration failed with error: ${error}`);
      });
    ```
8. When the promise resolves, inspect the `installing`, `waiting`, and `active` properties of the registration object to check on the state of the service worker. Log messages to the console indicating the state of the service worker.
    ```js
    if (registration.installing) {
      console.log('Service worker installing');
    } else if (registration.waiting) {
      console.log('Service worker installed, but waiting');
    } else if (registration.active) {
      console.log('Service worker active');
    }
    ```
9. Make sure that the browser's developer tools are open and refresh the page. In the JavaScript console, you should see the logs from the service worker and the app. This indicates that the service worker script was executed and that the app detected the service worker in the "installing" state.
    * `SWv1.0 SW Script executing - adding event listeners`
    * `Service worker installing`
    * `SWv1.0 install` (with the event object)
    * `SWv1.0 activate` (with the event object)

## Task 3: Exploring the Lifecycle of a Service Worker

In this task, you will explore what happens when you load a page with an unchanged service worker and with a changed service worker. You will also add logic to intercept network requests made by the app.

### Steps

1. Refresh the page one more time and inspect the browser's JavaScript console. This time you should only see the message from the app's registration logic saying that the service worker is active. This is because the service worker is already installed and active, so the script will not run again.
2. Open the "Application" tab in the browser's developer tools and click on the "Service Workers" section. You should see the service worker listed as "Active" with some additional details on the service worker.
3. Click on the "Unregister" button to unregister the service worker.
4. Refresh the page again and inspect the browser's JavaScript console. You should see the logs from the service worker indicating that it is installing and activating again.
5. Open the `serviceWorker.js` file make these changes:
    1. Change the version number in the `log` function to `SWv2.0`.
    2. Add a new event listener for the `fetch` event. In this event listener, log a message to the console indicating that the service worker is intercepting a fetch request.
    ```js
    self.addEventListener('fetch', event => {
      log('fetch', event);
    });
    ```
6. Save the changes and refresh the page. Inspect the browser's JavaScript console and the "Service Workers" section in the "Application" tab. You should see the logs from the service worker indicating that it is installing. Notice that the service worker 2.0 is not yet active.
7. Open the Application tab in the browser's developer tools and click on the "Service Workers" section. You should see the old service worker listed as active and the new service worker as waiting to activate.
8. Refresh the page again. You should see only a console log that says that the service worker is installed, but waiting.
9. Close the browser or navigate away to a different site (e.g., ncsu.edu) and then come back to the NC Parks app. You should now see that the new service worker became active and is intercepting fetch requests. The old service worker is now deleted. You will see a log for every fetch request made by the app, including requests for the HTML, CSS, and JavaScript files.

## Task 4: Sending Messages from the Service Worker to the App

In this task, you will send a message from the service worker to the app to let it know that it intercepted a fetch request.

### Steps

1. In the `common.js` file, add an event listener for the `message` event on the `navigator.serviceWorker` object at the end (but inside) of the `registerServiceWorker` function. This event listener will log a message to the console when it receives a message from the service worker.
    ```js
    navigator.serviceWorker.addEventListener('message', event => {
      console.log('Message from service worker:', event.data);
    });
    ```
2. Now in the `serviceWorker.js` file, change the version number of the `log` function to `SWv3.0` and add the following code to the `fetch` event listener to send the URL being requested to the app when it intercepts a fetch request. The event object will contain the request object that was intercepted, which has a `url` property.
    ```js
    self.clients.get(event.clientId).then(client => {
    if(client)
      client.postMessage({url: event.request.url});
    });
    ```
3. Now that the service worker has changed, you will need to navigate away and come back (or close and reopen the page) to activate the new service worker.
4. You should now see the console logs from the service worker with the fetch request and the console logs from the app with the URLs being intercepted.

## Task 5: Giving the User the Option to Skip Waiting

In this task, you will add logic to the app to detect when a new service worker is waiting to activate and give the user the option to activate the new service worker manually. If the user chooses to activate the new service worker, the app will send a message to the service worker to skip waiting.

### Steps

1. At the end of the `common.js` file, add a helper method that accepts a service worker object and shows a prompt to the user asking if they want to activate the new service worker. If the user confirms, we will sends a message to the service worker to skip waiting by calling the `postMessage` method. If they refuse, they can dismiss the message.
    ```js
    function newServiceWorkerReady(worker) {
      const popup =  document.createElement('div');
      popup.className = "popup";
      popup.innerHTML = '<div>New Version Available</div>';

      const buttonOk = document.createElement('button');
      buttonOk.innerHTML = 'Update';
      buttonOk.addEventListener('click', e => {
        worker.postMessage({action: 'skipWaiting'});
      });
      popup.appendChild(buttonOk);

      const buttonCancel = document.createElement('button');
      buttonCancel.innerHTML = 'Dismiss';
      buttonCancel.addEventListener('click', e => {
        document.body.removeChild(popup);
      });
      popup.appendChild(buttonCancel);

      document.body.appendChild(popup);
    }
    ```
2. Now in the `serviceWorker.js` file, change the version number of the `log` function to `SWv4.0` and add an event listener for the `message` event to handle the message from the app. If the message contains an `action` property with the value `skipWaiting`, call the `skipWaiting` method on the service worker to activate the new service worker immediately.
    ```js
    self.addEventListener('message', event => {
      log('message', event.data);
      if(event.data.action === 'skipWaiting') {
        self.skipWaiting();
      }
    });
    ```
3. Because we are manually activating the new service worker, we need to refresh any open pages of our app. Back in the `common.js` file, add an event listener for the `controllerchange` event on the `navigator.serviceWorker` object at the end (but inside) of the `registerServiceWorker` function. This event is raised when the service worker controlling the page changes, such as when we chose to skip waiting on a separete tab.
    ```js
    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload" in dev tools.
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if(refreshing) return;
      window.location.reload();
      refreshing = true;
    });
    ```
4. The next step is to show the prompt to the user. There are two situations where we will need to do this.
    1. When we try to register new service worker and we detect that the service worker is waiting to activate. When the registration promise resolves and you are checking the state of the worker, call the `newServiceWorkerReady` function if the worker is waiting. Remember to pass the worker object as a parameter.
        ```js
        else if (registration.waiting) {
          console.log('Service worker installed, but waiting');
          newServiceWorkerReady(registration.waiting); // Show prompt to user
        }
        ```
    2. When we are installing a new service worker, perhaos on a different tab. In that case, we would need to be notified of the change. We can add an event listener to the `updatefound` event on the registration object. This event is fired whenever the `registration.installing` property gets a new service worker. In this event listener, call the `newServiceWorkerReady` function with the new service worker as a parameter. The following code should be added when the `register` method resolves with a registration object.	
        ```js
        registration.addEventListener('updatefound', () => { //This is fired whenever registration.installing gets a new worker
          console.log("SW update found", registration, navigator.serviceWorker.controller);
          newServiceWorkerReady(registration.installing);
        });
        ```
5. Refresh the page to get the new service worker, navigate away, and then come back to the page.
6. Open the `serviceWorker.js` file and change the version number in the `log` function to `SWv5.0`.
7. Open a new tab and navigate to the NC Parks app. You should see the prompt to update the service worker on the new tab and the old tab.
8. Click the "Update" button to activate the new service worker. You will see that both tabs refresh and the new service worker is now active without having to close any tabs or navigate away.