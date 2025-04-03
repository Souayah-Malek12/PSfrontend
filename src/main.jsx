// eslint-disable-next-line no-unused-vars
import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './Context/UserContext.jsx';

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <StrictMode>
        <App />
    </StrictMode>
  </UserProvider>
)
