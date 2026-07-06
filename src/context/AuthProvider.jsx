import { useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { isAdminEmail, isAdminUser } from '../config/admin';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured());

  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Drop sessions for non-admin or unverified users
      if (firebaseUser && !isAdminUser(firebaseUser)) {
        await signOut(auth);
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    if (!auth) throw new Error('Firebase Auth is not configured');

    const normalizedEmail = email.trim().toLowerCase();

    if (!isAdminEmail(normalizedEmail)) {
      const err = new Error('This email is not authorized for admin access.');
      err.code = 'auth/unauthorized-admin';
      throw err;
    }

    const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    const { user: signedInUser } = credential;

    if (!signedInUser.emailVerified) {
      await sendEmailVerification(signedInUser);
      await signOut(auth);
      const err = new Error(
        'Please verify your email before signing in. A verification link has been sent to your inbox.'
      );
      err.code = 'auth/email-not-verified';
      throw err;
    }

    return credential;
  }, []);

  const logout = useCallback(async () => {
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
