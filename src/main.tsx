import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Registro del Service Worker oficial para notificaciones Push
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js', { scope: '/' })
      .then((reg) => {
        console.log('[Service Worker] Notificaciones SW registrado con éxito. Scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[Service Worker] Registro de SW fallido:', err);
      });

    // Limpieza selectiva: desregistrar solo service workers de otros proyectos que no correspondan a esta app
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        const scriptUrl = registration.active?.scriptURL || registration.installing?.scriptURL || '';
        if (scriptUrl && !scriptUrl.includes('firebase-messaging-sw.js')) {
          registration.unregister().then((success) => {
            if (success) {
              console.log('[Cleanup] Service Worker ajeno desregistrado:', scriptUrl);
            }
          });
        }
      }
    });
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
