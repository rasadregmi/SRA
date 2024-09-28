import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import App from './App'; // Import your main App component
import reportWebVitals from './reportWebVitals'; // Optional for performance metrics

// Create a root for the application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App wrapped in Router
root.render(
  <Router>
    <App />
  </Router>
);

// Optional: Report performance metrics
reportWebVitals();
