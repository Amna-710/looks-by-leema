import { isFirebaseConfigured } from './config';

/** Basic pre-flight check before Firestore writes */
export function assertFirestoreReady() {
  if (!isFirebaseConfigured()) {
    throw new Error('Firestore is not configured. Check your .env Firebase credentials.');
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('No internet connection. Please check your network and try again.');
  }
}

/** Log Firestore errors with context for debugging */
export function logFirestoreError(operation, err, context = {}) {
  console.error(`[Firestore] ${operation} failed:`, {
    code: err?.code,
    message: err?.message,
    ...context,
  });
}

/** Convert Firebase errors to user-friendly messages */
export function formatFirestoreError(err) {
  if (!err) return 'Unknown error';

  switch (err.code) {
    case 'unavailable':
      return 'Cannot reach Firestore. Enable Firestore Database in Firebase Console, deploy security rules, and check your internet connection.';
    case 'permission-denied':
      return 'Permission denied. Make sure you are logged in as an admin and Firestore rules allow authenticated writes.';
    case 'not-found':
      return 'Document not found in Firestore. Try refreshing the page to re-sync data.';
    case 'failed-precondition':
      return 'Firestore is not ready yet. Please wait a moment and try again.';
    default:
      if (err.message?.includes('INTERNAL ASSERTION FAILED')) {
        return 'Firestore client error. Please hard-refresh the page (Cmd+Shift+R) and try again.';
      }
      return err.message || 'Firestore operation failed';
  }
}
