/** Authorized admin emails — only these accounts can access the admin panel */
const DEFAULT_ADMIN_EMAILS = ['looksbyleema@gmail.com'];

/** Parse admin emails from env or fall back to the default list */
export function getAdminEmails() {
  const fromEnv = import.meta.env.VITE_ADMIN_EMAILS;
  if (!fromEnv?.trim()) return DEFAULT_ADMIN_EMAILS;
  return fromEnv
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/** True when the email is on the admin allowlist */
export function isAdminEmail(email) {
  if (!email) return false;
  const allowlist = getAdminEmails();
  const normalized = email.trim().toLowerCase();
  const allowed = allowlist.includes(normalized);
  console.log('[admin-auth] isAdminEmail()', { email: normalized, allowlist, allowed });
  return allowed;
}

/**
 * True when a Firebase user is an allowlisted admin.
 * Email verification is not required for allowlisted admins — accounts created
 * in Firebase Console start with emailVerified=false and would otherwise be
 * locked out after a successful password sign-in.
 */
export function isAdminUser(user) {
  if (!user?.email) {
    console.log('[admin-auth] isAdminUser() → false (no email)', {
      hasUser: Boolean(user),
      emailVerified: user?.emailVerified,
    });
    return false;
  }
  const allowed = isAdminEmail(user.email);
  console.log('[admin-auth] isAdminUser()', {
    email: user.email,
    emailVerified: user.emailVerified,
    uid: user.uid,
    allowed,
  });
  return allowed;
}
