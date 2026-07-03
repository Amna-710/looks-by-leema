import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

/** True when all required Firebase env vars are set */
export const isFirebaseConfigured = () =>
  Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );

/** True when Realtime Database URL is configured */
export const isRtdbConfigured = () => Boolean(firebaseConfig.databaseURL);

let app = null;
let auth = null;
let db = null;
let storage = null;
let rtdb = null;
let analytics = null;

if (isFirebaseConfigured()) {
  // Initialize app only once (prevents duplicate-app errors on HMR)
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  auth = getAuth(app);

  // Standard Firestore init — avoid memoryLocalCache() which triggers SDK ca9/b815
  // assertion failures when mixed with onSnapshot + one-shot reads (firebase-js-sdk#10008)
  db = getFirestore(app);

  storage = getStorage(app);

  if (isRtdbConfigured()) {
    rtdb = getDatabase(app);
  }

  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }
}

export { app, auth, db, storage, rtdb, analytics };
