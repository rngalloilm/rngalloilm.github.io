import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';


// Find the root div in index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

function registerServiceWorker() {
  // Check for service worker support
  if (!navigator.serviceWorker) {
    console.log('Service workers not supported');
    return;
  }

  // Register the service worker
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service worker registered successfully');
      
      // Check service worker state
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed, but waiting');
        newServiceWorkerReady(registration.waiting);
      } else if (registration.active) {
        console.log('Service worker active');
      }

      // Track updates
      registration.addEventListener('updatefound', () => {
        console.log('New service worker update found', registration, navigator.serviceWorker.controller);
        newServiceWorkerReady(registration.installing);
      });
    })
    .catch(error => {
      console.error(`Service worker registration failed: ${error}`);
    });

  // Handle messages from service worker
  navigator.serviceWorker.addEventListener('message', event => {
    console.log('Message from service worker:', event.data);
  });

  // Handle controller change (when new SW takes over)
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
};

function newServiceWorkerReady(worker) {
  // Create update popup
  const popup = document.createElement('div');
  popup.className = "popup";
  popup.innerHTML = '<div>New Version Available</div>';

  // Update button
  const buttonOk = document.createElement('button');
  buttonOk.innerHTML = 'Update';
  buttonOk.addEventListener('click', e => {
    // Tell SW to skip waiting
    worker.postMessage({ action: 'skipWaiting' });
    document.body.removeChild(popup);
  });
  popup.appendChild(buttonOk);

  // Dismiss button
  const buttonCancel = document.createElement('button');
  buttonCancel.innerHTML = 'Dismiss';
  buttonCancel.addEventListener('click', e => {
    document.body.removeChild(popup);
  });
  popup.appendChild(buttonCancel);

  document.body.appendChild(popup);

  // Listen for state changes
  worker.addEventListener('statechange', () => {
    if (worker.state === 'activated') {
      // New SW activated, no need for the popup anymore
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }
    }
  });
}

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Start the service worker registration
registerServiceWorker();