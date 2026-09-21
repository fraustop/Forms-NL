import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, AUTHORIZED_ADMIN_EMAIL } from '../firebase/config';
import type { User } from 'firebase/auth';

/**
 * Solicita permiso de notificaciones en el navegador y registra el dispositivo
 */
export async function registerAdminDeviceForNotifications(user: User | null): Promise<{ success: boolean; message: string }> {
  if (!user || user.email?.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return { success: false, message: 'Solo la cuenta administradora puede registrar dispositivos.' };
  }

  if (!('Notification' in window)) {
    return { success: false, message: 'Este navegador no soporta notificaciones push.' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, message: 'Permiso de notificaciones denegado en el navegador.' };
    }

    // Generar un identificador único para el dispositivo actual
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

    return {
      success: true,
      message: '¡Dispositivo registrado exitosamente para recibir notificaciones!',
    };
  } catch (error: any) {
    console.error('Error registrando dispositivo:', error);
    return { success: false, message: error?.message || 'Error al registrar dispositivo.' };
  }
}
