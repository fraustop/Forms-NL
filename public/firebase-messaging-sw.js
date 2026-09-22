// Service Worker para Notificaciones Push (Firebase Messaging + Web Push API)
// Compatible con segundo plano, pantalla apagada y pestañas en segundo plano.

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando Service Worker de Notificaciones...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activado y tomando control de clientes.');
  event.waitUntil(clients.claim());
});

// 1. Cargar Firebase Compat Libraries para FCM
try {
  importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

  firebase.initializeApp({
    apiKey: "AIzaSyC-nW-pjxi6FaSUInScpaSSCkFROoSHaZc",
    authDomain: "forms-nl.firebaseapp.com",
    projectId: "forms-nl",
    storageBucket: "forms-nl.firebasestorage.app",
    messagingSenderId: "777579072207",
    appId: "1:777579072207:web:f88c493f24db7f73d685ba",
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[Service Worker] Mensaje FCM recibido en segundo plano:', payload);

    const title = payload.notification?.title || payload.data?.title || '🌟 Nuevo Formulario Registrado';
    const options = {
      body: payload.notification?.body || payload.data?.body || 'Se ha recibido un nuevo registro en tiempo real.',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      tag: payload.data?.tag || `form_${Date.now()}`,
      renotify: true,
      data: {
        url: payload.data?.url || '/?Respuestas',
      },
    };

    return self.registration.showNotification(title, options);
  });
} catch (e) {
  console.warn('[Service Worker] Error inicializando Firebase Messaging Compat en SW:', e);
}

// 2. Soporte nativo para eventos Web Push estándar
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Evento push recibido.');
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Nuevo Formulario', body: event.data.text() };
    }
  }

  const title = data.title || data.notification?.title || '🌟 Nuevo Formato de Caracterización';
  const options = {
    body: data.body || data.notification?.body || 'Se ha completado un nuevo formulario en tiempo real.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
    tag: data.tag || `push_${Date.now()}`,
    renotify: true,
    data: {
      url: data.url || data.data?.url || '/?Respuestas',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 3. Manejo de clic en la notificación para abrir o enfocar el Panel de Respuestas
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/?Respuestas';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Si ya hay una ventana abierta con la app, enfocarla
      for (const client of windowClients) {
        if (client.url && client.url.includes('Respuestas') && 'focus' in client) {
          return client.focus();
        }
      }
      for (const client of windowClients) {
        if ('navigate' in client && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Si no hay ventana abierta, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
