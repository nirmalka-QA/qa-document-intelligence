import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; 
import './styles/globals.css';

// Import the global theme
import { theme } from './theme/mantineTheme'; 

// Import your router setup (assuming you have a router file that renders <App />)
// If your router is defined here, wrap your RouterProvider inside MantineProvider
import { RouterProvider } from 'react-router-dom';
import router from './router'; 

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);