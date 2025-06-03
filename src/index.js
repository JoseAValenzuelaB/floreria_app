import React from 'react';
import App from './App';
import './styles.css'; // Import the CSS file
import 'semantic-ui-css/semantic.min.css';
import { createRoot } from 'react-dom/client';



// Get the root element
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Render the App component
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
