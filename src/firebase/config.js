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

/** Expected Firebase project (where the admin user was created) */
export const EXPECTED_FIREBASE_PROJECT_ID = 'looksbyleema-52909';

/** Safe summary for debugging (never logs the full API key) */
export function getFirebaseDebugInfo() {
  const projectId = firebaseConfig.projectId || '(missing)';
  const matchesExpected =
    projectId.trim().toLowerCase() === EXPECTED_FIREBASE_PROJECT_ID.toLowerCase();

  return {
    projectId,
    authDomain: firebaseConfig.authDomain || '(missing)',
    storageBucket: firebaseConfig.storageBucket || '(missing)',
    databaseURL: firebaseConfig.databaseURL || '(missing)',
    appId: firebaseConfig.appId || '(missing)',
    apiKeyPrefix: firebaseConfig.apiKey
      ? `${String(firebaseConfig.apiKey).slice(0, 8)}…`
      : '(missing)',
    expectedProjectId: EXPECTED_FIREBASE_PROJECT_ID,
    matchesExpectedProject: matchesExpected,
  };
}

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
  const debug = getFirebaseDebugInfo();
  console.log('[admin-auth] Firebase config loaded from .env', debug);
  if (!debug.matchesExpectedProject) {
    console.error(
      '[admin-auth] PROJECT MISMATCH: app is connected to',
      JSON.stringify(debug.projectId),
      'but expected',
      JSON.stringify(EXPECTED_FIREBASE_PROJECT_ID),
      '— admin users in LooksByLeema-52909 will NOT authenticate against this project.'
    );
  }

  // Initialize app only once (prevents duplicate-app errors on HMR)
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  auth = getAuth(app);
  console.log('[admin-auth] Firebase Auth initialized for project:', app.options.projectId);

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
