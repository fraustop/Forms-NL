import { doc, setDoc, serverTimestamp, collection, query, onSnapshot, orderBy, limit, getDocs } from 'firebase/firestore';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import app, { db, AUTHORIZED_ADMIN_EMAIL } from '../firebase/config';
import type { User } from 'firebase/auth';

// Clave maestra de autorización para registro de dispositivos
export const ADMIN_DEVICE_PASSWORD = 'EduInicialNL2026';

// Claves de almacenamiento local
const DEVICE_REGISTERED_KEY = 'nl_admin_device_registered_v1';
const FCM_TOKEN_LOCAL_KEY = 'nl_admin_fcm_token_v1';

/**
 * Obtiene el número total de dispositivos registrados en Firestore
 */
export async function getRegisteredDevicesCount(): Promise<number> {
  try {
    const snap = await getDocs(collection(db, 'admin_push_tokens'));
    return snap.size;
  } catch (e) {
    console.warn('Error consultando dispositivos registrados:', e);
    return 0;
  }
}

/**
 * Reproduce un sonido de campana nítido y claro usando Web Audio API
 */
export function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Tono 1 (Nota Mi6 - 659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Tono 2 (Nota La6 - 880.00 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880.00, now + 0.12);
    gain2.gain.setValueAtTime(0.45, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.8);

    // Tono 3 (Nota Do#7 - 1108.73 Hz)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(1108.73, now + 0.24);
    gain3.gain.setValueAtTime(0.5, now + 0.24);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.24);
    osc3.stop(now + 1.2);
  } catch (e) {
    console.error('Error al reproducir audio de notificación:', e);
  }
}

/**
 * Verifica si este dispositivo ya fue autorizado y registrado localmente
 */
export function isDeviceLocallyRegistered(): boolean {
  return localStorage.getItem(DEVICE_REGISTERED_KEY) === 'true';
}

/**
 * Muestra una notificación visual en el sistema operativo a través del Service Worker o API nativa
 */
export async function showSystemNotification(title: string, options: NotificationOptions) {
  if (!('Notification' in window)) return;

  if (Notification.permission !== 'granted') {
    try {
      const p = await Notification.requestPermission();
      if (p !== 'granted') return;
    } catch {
      return;
    }
  }

  // 1. Intentar mostrar a través del Service Worker (permite fondo y persistencia)
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          ...options,
        });
        return;
      }
    }
  } catch (e) {
    console.warn('[Notification] Error con ServiceWorker, usando fallback nativo:', e);
  }

  // 2. Fallback a Notification nativa
  try {
    const notif = new Notification(title, {
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      ...options,
    });
    notif.onclick = () => {
      window.focus();
      if (!window.location.search.includes('Respuestas')) {
        window.location.href = '/?Respuestas';
      }
    };
  } catch (e) {
    console.error('[Notification] Error mostrando notificación nativa:', e);
  }
}

/**
 * Envía una notificación de prueba sonora y visual al dispositivo actual
 */
export async function triggerTestNotification() {
  playNotificationSound();
  await showSystemNotification('🔔 Notificación de Prueba Exitosa', {
    body: 'El sistema de alertas en tiempo real está funcionando correctamente.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: `test_${Date.now()}`,
  });
}

/**
 * Valida la contraseña y registra este dispositivo para notificaciones en tiempo real
 * Genera el token FCM oficial y la suscripción Web Push para recepción de mensajes en segundo plano.
 */
export async function registerDeviceWithPassword(
  passwordInput: string,
  user: User | null
): Promise<{ success: boolean; message: string }> {
  // 1. Validar correo de administrador
  if (!user || user.email?.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      message: `Solo la cuenta administradora (${AUTHORIZED_ADMIN_EMAIL}) puede registrar dispositivos.`,
    };
  }

  // 2. Validar contraseña maestra
  const cleanPass = passwordInput.trim();
  if (
    cleanPass !== ADMIN_DEVICE_PASSWORD &&
    cleanPass !== 'jazmin2898' &&
    cleanPass !== 'Jazmin2026*'
  ) {
    return { success: false, message: 'Contraseña de autorización incorrecta.' };
  }

  // 3. Validar soporte de notificaciones
  if (!('Notification' in window)) {
    return { success: false, message: 'Este navegador no soporta notificaciones de sistema.' };
  }

  try {
    // 4. Solicitar permiso de notificaciones
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        success: false,
        message: 'Permiso de notificaciones denegado en el navegador. Por favor habilítalo en la barra de direcciones.',
      };
    }

    // 5. Registrar y esperar a que el Service Worker esté listo
    let swReg: ServiceWorkerRegistration | null = null;
    if ('serviceWorker' in navigator) {
      try {
        swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
        await navigator.serviceWorker.ready;
      } catch (swErr) {
        console.warn('Error al registrar Service Worker:', swErr);
      }
    }

    // 6. Obtener Token FCM oficial de Firebase Cloud Messaging
    let realFcmToken = '';
    const messagingSupported = await isSupported();

    if (messagingSupported && swReg) {
      try {
        const messaging = getMessaging(app);
        realFcmToken = await getToken(messaging, {
          serviceWorkerRegistration: swReg,
        });
        console.log('[FCM] Token FCM generado:', realFcmToken ? `${realFcmToken.substring(0, 15)}...` : 'N/A');
        if (realFcmToken) {
          localStorage.setItem(FCM_TOKEN_LOCAL_KEY, realFcmToken);
        }
      } catch (fcmErr) {
        console.warn('[FCM] No se pudo generar token FCM directo (continuando con Web Push):', fcmErr);
      }
    }

    // 7. Obtener suscripción nativa PushManager si está disponible
    let pushSubData: any = null;
    if (swReg && swReg.pushManager) {
      try {
        const sub = await swReg.pushManager.getSubscription();
        if (sub) {
          pushSubData = sub.toJSON();
        }
      } catch (subErr) {
        console.warn('[PushManager] Error al consultar suscripción push:', subErr);
      }
    }

    // 8. Crear identificador único para el dispositivo
    const deviceFingerprint = `${navigator.userAgent.replace(/[^a-zA-Z0-9]/g, '').substring(0, 30)}_${window.screen.width}x${window.screen.height}`;
    const tokenDocId = realFcmToken
      ? `fcm_${realFcmToken.substring(0, 24).replace(/[^a-zA-Z0-9]/g, '')}`
      : `device_${btoa(deviceFingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 24)}`;

    // 9. Guardar registro en Cloud Firestore
    await setDoc(
      doc(db, 'admin_push_tokens', tokenDocId),
      {
        email: user.email,
        fcmToken: realFcmToken || null,
        token: realFcmToken || tokenDocId,
        pushSubscription: pushSubData,
        userAgent: navigator.userAgent,
        platform: navigator.platform || 'web',
        registeredAt: serverTimestamp(),
        lastSeenAt: serverTimestamp(),
        activo: true,
      },
      { merge: true }
    );

    // 10. Guardar bandera en LocalStorage
    localStorage.setItem(DEVICE_REGISTERED_KEY, 'true');

    // 11. Reproducir sonido y notificación de confirmación
    playNotificationSound();
    await showSystemNotification('🔔 Notificaciones en Tiempo Real Activadas', {
      body: 'Este dispositivo recibirá alertas sonoras e instantáneas cuando se complete un nuevo formulario.',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
    });

    return {
      success: true,
      message: '¡Dispositivo autorizado y registrado exitosamente para alertas en tiempo real!',
    };
  } catch (error: any) {
    console.error('Error registrando dispositivo:', error);
    return { success: false, message: error?.message || 'Error al registrar el dispositivo.' };
  }
}

/**
 * Escucha en tiempo real la llegada de NUEVOS formularios completados
 * Dispara sonido y notificación del sistema instantáneamente ante cualquier nuevo registro.
 */
export function listenForRealtimeSubmissions(onNewSubmission?: (formData: any) => void) {
  let isInitialSnapshot = true;
  const processedDocIds = new Set<string>();

  const q = query(
    collection(db, 'respuestas_caracterizacion'),
    orderBy('createdAt', 'desc'),
    limit(15)
  );

  const unsubscribe = onSnapshot(
    q,
    { includeMetadataChanges: false },
    (snapshot) => {
      // En la primera carga, almacenar los IDs existentes para no disparar alertas de registros antiguos
      if (isInitialSnapshot) {
        isInitialSnapshot = false;
        snapshot.docs.forEach((d) => processedDocIds.add(d.id));
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const docId = change.doc.id;
          if (processedDocIds.has(docId)) return;
          processedDocIds.add(docId);

          const data = change.doc.data();
          const childName = data.nombreCompleto || data.nombreNino || 'Nuevo Infante';
          const folio = data.folio || docId;
          const age = data.edadAnos ? `${data.edadAnos} años, ${data.edadMeses || 0} meses` : '';

          console.log('[Realtime] ¡Nuevo formulario recibido!', childName, folio);

          // 1. Reproducir sonido de campana
          playNotificationSound();

          // 2. Disparar notificación visual del sistema
          showSystemNotification(`🌟 Nuevo Formulario: ${childName}`, {
            body: `Folio: ${folio} ${age ? `• ${age}` : ''}\nSe ha recibido un nuevo registro en tiempo real.`,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            tag: `sub_${docId}`,
            data: {
              url: '/?Respuestas',
            },
          });

          // 3. Callback para actualizar estado UI
          if (onNewSubmission) {
            onNewSubmission(data);
          }
        }
      });
    },
    (err) => {
      console.warn('[Realtime] Advertencia en escucha de respuestas:', err.message);
    }
  );

  return unsubscribe;
}
