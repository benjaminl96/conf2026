import React from 'react';
import ReactDOM from 'react-dom/client';
import layout from '@splunk/react-page';
import App from './App';

const application = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (import.meta.env.MODE === 'development') {
  ReactDOM.createRoot(document.getElementById('root')).render(application);
} else {
  layout(application);
}
