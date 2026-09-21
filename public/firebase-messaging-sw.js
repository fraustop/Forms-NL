// Firebase Messaging Service Worker for Web Push Notifications
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
  console.log('[firebase-messaging-sw.js] Mensaje en segundo plano recibido:', payload);

  const notificationTitle = payload.notification?.title || 'Nuevo Formulario Registrado';
  const notificationOptions = {
    body: payload.notification?.body || 'Se ha completado una nueva caracterización infantil.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: {
      url: payload.data?.url || '/?Respuestas',
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/?Respuestas';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
