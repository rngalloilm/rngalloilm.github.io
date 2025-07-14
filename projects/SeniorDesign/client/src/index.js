import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// Register service worker
function registerServiceWorker() {
  // Check for service worker support in the browser
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported in this browser.');
    return;
  }

  // Register the service worker script located at the root
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered successfully with scope:', registration.scope);

      // Check for an existing waiting worker immediately upon registration
      // Remove if using return self.skipWaiting();
      if (registration.waiting) {
        console.log('Service worker found waiting on registration.');
        // Show prompt
        newServiceWorkerReady(registration.waiting);
      }

      // Log the initial state of the service worker
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.active) {
        console.log('Service worker active');
      }

      // Listen for new updates being found
      registration.addEventListener('updatefound', () => {
        console.log('New service worker update found. New worker:', registration.installing);
        const newWorker = registration.installing;
        if (newWorker) {
          // Remove if using return self.skipWaiting();
          // Listen for state changes on the new (installing) worker
          newWorker.addEventListener('statechange', () => {
            console.log('New worker state changed:', newWorker.state);
            // When the new worker has installed, but is waiting (because the old one is active)
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New worker installed and waiting (controller exists). Showing update prompt.');
              newServiceWorkerReady(newWorker);
            }
          });
        }
      });
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
  
  // Listen for messages FROM the Service Worker
  navigator.serviceWorker.addEventListener('message', event => {
    console.log('Message from service worker:', event.data);
    // You could add logic here to update React state based on message type
    if (event.data && event.data.type === 'FETCH_INTERCEPTED') {
      console.log(`SW told us it intercepted: ${event.data.url}`);
    }
  });

  // Listen for the controller changing
  // When a new SW takes over (after skipWaiting)
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return; // Prevent reload loops
    console.log('Controller changed, reloading page to apply update...');
    window.location.reload();
    refreshing = true;
  });
}

// Helper function to create and show the update SW prompt
// Remove if using return self.skipWaiting();
function newServiceWorkerReady(worker) {
  console.log('newServiceWorkerReady called for worker:', worker);
  // Prevent multiple popups
  if (document.querySelector('.sw-update-popup')) {
     console.log('Update popup already showing.');
     return;
  }

  const popup = document.createElement('div');
  // Simple styling for visibility
  popup.className = "sw-update-popup"; // Class for potential CSS styling
  popup.style.position = 'fixed';
  popup.style.bottom = '20px';
  popup.style.right = '20px';
  popup.style.padding = '15px';
  popup.style.backgroundColor = '#333';
  popup.style.color = 'white';
  popup.style.border = '1px solid white';
  popup.style.borderRadius = '5px';
  popup.style.zIndex = '10000';
  popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
  popup.style.textAlign = 'center';

  popup.innerHTML = '<div style="margin-bottom: 10px; font-weight: bold;">New Version Available!</div>';

  const buttonOk = document.createElement('button');
  buttonOk.innerHTML = 'Update';
  // Basic button styling
  buttonOk.style.marginRight = '10px';
  buttonOk.style.padding = '5px 10px';
  buttonOk.style.cursor = 'pointer';
  buttonOk.addEventListener('click', () => {
    console.log('Update button clicked. Sending skipWaiting message to SW.');
    // Send message to the waiting service worker
    worker.postMessage({ action: 'skipWaiting' });
    // Popup will be removed by page reload via 'controllerchange' or worker activation state change
  });
  popup.appendChild(buttonOk);

  const buttonCancel = document.createElement('button');
  buttonCancel.innerHTML = 'Dismiss';
  buttonCancel.style.padding = '5px 10px';
  buttonCancel.style.cursor = 'pointer';
  buttonCancel.addEventListener('click', () => {
    console.log('Dismiss button clicked.');
    if (document.body.contains(popup)) {
       document.body.removeChild(popup);
    }
  });
  popup.appendChild(buttonCancel);

  document.body.appendChild(popup);

  // Listener to remove popup if worker activates without reload
   worker.addEventListener('statechange', () => {
      if (worker.state === 'activated') {
          console.log('Worker activated state detected, removing popup if still present.');
          if (document.body.contains(popup)) {
              document.body.removeChild(popup);
          }
      }
  });
}

// // Detect when the user goes offline
// window.addEventListener('offline', () => {
//   console.log('You are offline. Changes will be stored locally.');
// });

// // Detect when the user comes back online
// window.addEventListener('online', () => {
//   console.log('You are back online. Attempting to sync data...');
//   if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
//     navigator.serviceWorker.controller.postMessage({ action: 'sync' });
//   }
// });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Call the registration function after the app is rendered
registerServiceWorker();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// NODE_ENV=testing node index.js