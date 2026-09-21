import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyC-nW-pjxi6FaSUInScpaSSCkFROoSHaZc",
  authDomain: "forms-nl.firebaseapp.com",
  projectId: "forms-nl",
  storageBucket: "forms-nl.firebasestorage.app",
  messagingSenderId: "777579072207",
  appId: "1:777579072207:web:f88c493f24db7f73d685ba",
  measurementId: "G-6SYMZGRMXK"
};

// Initialize Firebase avoiding multi-init
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const AUTHORIZED_ADMIN_EMAIL = 'jazmin2898@gmail.com';

export default app;
