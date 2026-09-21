import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Limpieza automática de Service Workers antiguos o residuales de otros proyectos en localhost
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      // Si el service worker es de una versión anterior o de otra app, desregistrarlo para evitar conflictos
      registration.unregister().then((success) => {
        if (success) {
          console.log('[Cleanup] Service Worker antiguo desregistrado con éxito.');
        }
      });
    }
  });

  // Limpiar cachés antiguas si existen
  if ('caches' in window) {
    caches.keys().then((names) => {
      for (const name of names) {
        if (name.includes('ucnl') || name.includes('v4') || name.includes('old')) {
          caches.delete(name);
          console.log('[Cleanup] Caché antigua eliminada:', name);
        }
      }
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
