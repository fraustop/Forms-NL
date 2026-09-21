import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider, AUTHORIZED_ADMIN_EMAIL } from '../firebase/config';

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthorized: boolean;
  error: string | null;
}

export const checkIsAdmin = (user: User | null): boolean => {
  if (!user || !user.email) return false;
  return user.email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
};

export const loginWithGoogle = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('Error al iniciar sesión con Google:', error);
    return { success: false, error: error?.message || 'Error al autenticar con Google' };
  }
};

export const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return { success: true, user: result.user };
  } catch (error: any) {
    // Si el usuario no existe y es el correo admin, intentar registrarlo
    if (error?.code === 'auth/user-not-found' || error?.code === 'auth/invalid-credential') {
      try {
        const createResult = await createUserWithEmailAndPassword(auth, email, pass);
        return { success: true, user: createResult.user };
      } catch (createErr: any) {
        return { success: false, error: createErr?.message || error?.message };
      }
    }
    return { success: false, error: error?.message || 'Error al iniciar sesión' };
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error cerrando sesión:', error);
  }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
