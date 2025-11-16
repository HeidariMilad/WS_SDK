import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// This file is intentionally minimal; a future story can wire it into
// whichever bundler or framework (e.g., Vite, Next) is chosen.

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
