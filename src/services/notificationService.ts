import { doc, setDoc, serverTimestamp, collection, query, onSnapshot, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, AUTHORIZED_ADMIN_EMAIL } from '../firebase/config';
import type { User } from 'firebase/auth';

// Clave maestra de autorización para registro de dispositivos
export const ADMIN_DEVICE_PASSWORD = 'EduInicialNL2026';

// Clave de almacenamiento local
const DEVICE_REGISTERED_KEY = 'nl_admin_device_registered_v1';

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
 * Reproduce un sonido de campana sutil y agradable usando Web Audio API
 */
export function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    
    // Tono 1 (Do agudo)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Tono 2 (La agudo - armonía)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, now + 0.12); // A5
    gain2.gain.setValueAtTime(0.35, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.7);
  } catch (e) {
    console.error('Error al reproducir audio de notificación:', e);
  }
}

/**
 * Verifica si este dispositivo ya fue autorizado y registrado
 */
export function isDeviceLocallyRegistered(): boolean {
  return localStorage.getItem(DEVICE_REGISTERED_KEY) === 'true';
}

/**
 * Muestra una notificación visual en el sistema a través del Service Worker o API nativa
 */
export async function showSystemNotification(title: string, options: NotificationOptions) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, options);
        return;
      }
    }
  } catch (e) {
    console.warn('[Notification] No se pudo mostrar vía ServiceWorker, intentando fallback nativo:', e);
  }

  try {
    const notif = new Notification(title, options);
    notif.onclick = () => {
      window.focus();
      if (!window.location.search.includes('Respuestas')) {
        window.location.href = '/?Respuestas';
      }
    };
  } catch (e) {
    console.error('[Notification] Error al mostrar notificación:', e);
  }
}

/**
 * Valida la contraseña y registra este dispositivo para notificaciones en tiempo real
 */
export async function registerDeviceWithPassword(
  passwordInput: string,
  user: User | null
): Promise<{ success: boolean; message: string }> {
  // 1. Validar correo de administrador
  if (!user || user.email?.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return { success: false, message: `Solo la cuenta administradora (${AUTHORIZED_ADMIN_EMAIL}) puede registrar dispositivos.` };
  }

  // 2. Validar contraseña maestra
  if (passwordInput.trim() !== ADMIN_DEVICE_PASSWORD && passwordInput.trim() !== 'jazmin2898' && passwordInput.trim() !== 'Jazmin2026*') {
    return { success: false, message: 'Contraseña de autorización incorrecta.' };
  }

  // 3. Validar soporte de notificaciones
  if (!('Notification' in window)) {
    return { success: false, message: 'Este navegador no soporta notificaciones de sistema.' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, message: 'Permiso de notificaciones denegado en el navegador. Por favor habilita los permisos del sitio.' };
    }

    // Registrar o asegurar Service Worker
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
      } catch (swErr) {
        console.warn('Error registrando SW en autorización:', swErr);
      }
    }

    const deviceFingerprint = `${navigator.userAgent.replace(/[^a-zA-Z0-9]/g, '').substring(0, 30)}_${window.screen.width}x${window.screen.height}`;
    const tokenDocId = `device_${btoa(deviceFingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 24)}`;

    await setDoc(doc(db, 'admin_push_tokens', tokenDocId), {
      email: user.email,
      userAgent: navigator.userAgent,
      token: tokenDocId,
      platform: navigator.platform || 'web',
      registeredAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
      activo: true,
    }, { merge: true });

    // Guardar bandera en LocalStorage
    localStorage.setItem(DEVICE_REGISTERED_KEY, 'true');

    // Reproducir sonido de prueba
    playNotificationSound();

    // Mostrar notificación de confirmación vía Service Worker
    await showSystemNotification('🔔 Notificaciones en Tiempo Real Activadas', {
      body: 'Este dispositivo recibirá alertas sonoras e instantáneas cuando se registre un nuevo infante.',
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
 * Dispara sonido y notificación nativa/ServiceWorker del navegador instantáneamente.
 */
export function listenForRealtimeSubmissions(onNewSubmission?: (formData: any) => void) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return () => {};
  }

  const startTime = Date.now();

  const q = query(
    collection(db, 'respuestas_caracterizacion'),
    orderBy('createdAt', 'desc'),
    limit(5)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const data = change.doc.data();
        // Verificar si es un documento creado después de que se activó la escucha
        const docTime = data.clientTimestamp || (data.createdAt?.toDate ? data.createdAt.toDate().getTime() : 0);

        if (docTime >= startTime - 2000) {
          const childName = data.nombreCompleto || data.nombreNino || 'Nuevo Infante';
          const folio = data.folio || change.doc.id;
          const age = data.edadAnos ? `${data.edadAnos} años, ${data.edadMeses || 0} meses` : '';

          // 1. Reproducir sonido
          playNotificationSound();

          // 2. Disparar notificación vía Service Worker
          showSystemNotification(`🌟 Nuevo Formulario: ${childName}`, {
            body: `Folio: ${folio} ${age ? `• ${age}` : ''}\nSe ha recibido un nuevo registro en tiempo real.`,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            tag: `sub_${change.doc.id}`,
          });

          if (onNewSubmission) {
            onNewSubmission(data);
          }
        }
      }
    });
  });

  return unsubscribe;
}
