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
  return getAdminEmails().includes(email.trim().toLowerCase());
}

/** True when a Firebase user is a verified admin */
export function isAdminUser(user) {
  if (!user?.email) return false;
  if (!user.emailVerified) return false;
  return isAdminEmail(user.email);
}
