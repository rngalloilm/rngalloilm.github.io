import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

// Find the root div in index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component
root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
);