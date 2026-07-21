import { useEffect, useState, useCallback, useRef } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  auth,
  app,
  isFirebaseConfigured,
  getFirebaseDebugInfo,
  EXPECTED_FIREBASE_PROJECT_ID,
} from '../firebase/config';
import { isAdminEmail, isAdminUser, getAdminEmails } from '../config/admin';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured());
  /** Prevents onAuthStateChanged from signing out mid-login */
  const loginInProgressRef = useRef(false);

  useEffect(() => {
    const firebaseDebug = getFirebaseDebugInfo();
    console.log('[admin-auth] AuthProvider mount', {
      isFirebaseConfigured: isFirebaseConfigured(),
      hasAuth: Boolean(auth),
      adminEmails: getAdminEmails(),
      firebaseProjectIdFromEnv: firebaseDebug.projectId,
      firebaseProjectIdFromApp: app?.options?.projectId ?? null,
      expectedProjectId: EXPECTED_FIREBASE_PROJECT_ID,
      matchesExpectedProject: firebaseDebug.matchesExpectedProject,
    });
    if (!firebaseDebug.matchesExpectedProject) {
      console.error(
        '[admin-auth] WRONG FIREBASE PROJECT — connected to',
        firebaseDebug.projectId,
        'instead of',
        EXPECTED_FIREBASE_PROJECT_ID
      );
    }

    if (!isFirebaseConfigured() || !auth) {
      console.warn('[admin-auth] Firebase Auth not configured — skipping listener');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[admin-auth] onAuthStateChanged', {
        uid: firebaseUser?.uid ?? null,
        email: firebaseUser?.email ?? null,
        emailVerified: firebaseUser?.emailVerified ?? null,
        loginInProgress: loginInProgressRef.current,
      });

      // Drop sessions for non-admin users (skip while login() is handling auth)
      if (firebaseUser && !isAdminUser(firebaseUser)) {
        if (loginInProgressRef.current) {
          console.log('[admin-auth] onAuthStateChanged: non-admin during login — deferring sign-out');
          return;
        }
        console.warn('[admin-auth] onAuthStateChanged: signing out non-admin user');
        await signOut(auth);
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);
      setLoading(false);
      console.log('[admin-auth] onAuthStateChanged: session set', {
        isAdmin: Boolean(firebaseUser),
      });
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const passwordLength = password?.length ?? 0;
    const firebaseDebug = getFirebaseDebugInfo();
    const liveProjectId = app?.options?.projectId ?? firebaseDebug.projectId;

    console.log('[admin-auth] ========== LOGIN ATTEMPT ==========');
    console.log('[admin-auth] 1. email passed to signInWithEmailAndPassword:', JSON.stringify(normalizedEmail));
    console.log('[admin-auth] 2. password length (not value):', passwordLength);
    console.log('[admin-auth] 3. Firebase project ID from .env/config:', JSON.stringify(firebaseDebug.projectId));
    console.log('[admin-auth] 3b. Firebase project ID from initialized app:', JSON.stringify(liveProjectId));
    console.log('[admin-auth] 3c. expected project ID:', JSON.stringify(EXPECTED_FIREBASE_PROJECT_ID));
    console.log('[admin-auth] 3d. authDomain:', firebaseDebug.authDomain);
    console.log('[admin-auth] 3e. matches expected project?:', firebaseDebug.matchesExpectedProject);

    if (!firebaseDebug.matchesExpectedProject) {
      console.error(
        '[admin-auth] PROJECT MISMATCH — signing in against',
        liveProjectId,
        'but your user exists in',
        EXPECTED_FIREBASE_PROJECT_ID
      );
    }

    if (!auth) {
      console.error('[admin-auth] login() aborted: auth instance missing');
      throw new Error('Firebase Auth is not configured');
    }

    if (!isAdminEmail(normalizedEmail)) {
      console.warn('[admin-auth] login() blocked: email not on VITE_ADMIN_EMAILS allowlist', {
        email: normalizedEmail,
        allowlist: getAdminEmails(),
        code: 'auth/unauthorized-admin',
      });
      const err = new Error('This email is not authorized for admin access.');
      err.code = 'auth/unauthorized-admin';
      throw err;
    }

    loginInProgressRef.current = true;
    try {
      console.log('[admin-auth] 4. calling signInWithEmailAndPassword…');
      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const { user: signedInUser } = credential;

      console.log('[admin-auth] 5. Firebase sign-in SUCCESS', {
        uid: signedInUser.uid,
        email: signedInUser.email,
        emailVerified: signedInUser.emailVerified,
        providerId: signedInUser.providerData?.[0]?.providerId,
        projectId: liveProjectId,
      });

      if (!signedInUser.emailVerified) {
        console.warn(
          '[admin-auth] emailVerified=false — allowing allowlisted admin anyway'
        );
      }

      console.log('[admin-auth] ========== LOGIN COMPLETE ==========');
      return credential;
    } catch (err) {
      console.error('[admin-auth] 4. signInWithEmailAndPassword FAILED');
      console.error('[admin-auth] 5. EXACT Firebase error code:', err.code ?? '(no code)');
      console.error('[admin-auth] 5. EXACT Firebase error message:', err.message ?? '(no message)');
      console.error('[admin-auth] full error object:', err);
      throw err;
    } finally {
      loginInProgressRef.current = false;
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('[admin-auth] logout()');
    if (!auth) return;
    await signOut(auth);
  }, []);

  const isAdmin = isAdminUser(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        isConfigured: isFirebaseConfigured(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
