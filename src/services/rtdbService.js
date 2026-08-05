import { ref, set, onValue, off, get, push, update } from 'firebase/database';
import { rtdb, isRtdbConfigured } from '../firebase/config';
import { defaultSiteSettings, defaultTestimonials } from '../data/defaultSiteSettings';
import { notifyBookingEmail } from './bookingEmailService';

const PATHS = {
  site: 'site/settings',
  testimonials: 'site/testimonials',
  bookings: 'bookings',
};

function requireRtdb() {
  if (!isRtdbConfigured() || !rtdb) {
    throw new Error(
      'Firebase Realtime Database is not configured. Set VITE_FIREBASE_DATABASE_URL in your environment.'
    );
  }
  return rtdb;
}

function normalizeBooking(id, data) {
  if (!data) return null;
  const createdAt =
    typeof data.createdAt === 'number'
      ? new Date(data.createdAt)
      : data.createdAt
        ? new Date(data.createdAt)
        : null;

  return {
    id,
    ...data,
    createdAt,
  };
}

function sortBookings(list) {
  return list.sort((a, b) => {
    const ta = a.createdAt?.getTime?.() || 0;
    const tb = b.createdAt?.getTime?.() || 0;
    return tb - ta;
  });
}

/** Push latest site data to Realtime Database for live sync */
export async function syncToRealtimeDB({ settings, testimonials }) {
  if (!isRtdbConfigured() || !rtdb) return;

  const updates = {};
  if (settings) updates[PATHS.site] = settings;
  if (testimonials) updates[PATHS.testimonials] = testimonials;

  await Promise.all(
    Object.entries(updates).map(([path, data]) => set(ref(rtdb, path), data))
  );
}

/** Subscribe to site settings from Realtime Database */
export function subscribeRtdbSettings(callback) {
  if (!isRtdbConfigured() || !rtdb) {
    callback(defaultSiteSettings);
    return () => {};
  }

  const settingsRef = ref(rtdb, PATHS.site);
  const listener = (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : defaultSiteSettings);
  };

  onValue(settingsRef, listener, () => callback(defaultSiteSettings));

  return () => off(settingsRef, 'value', listener);
}

/** Subscribe to testimonials from Realtime Database */
export function subscribeRtdbTestimonials(callback) {
  if (!isRtdbConfigured() || !rtdb) {
    callback(defaultTestimonials);
    return () => {};
  }

  const testimonialsRef = ref(rtdb, PATHS.testimonials);
  const listener = (snapshot) => {
    if (!snapshot.exists()) {
      callback(defaultTestimonials);
      return;
    }
    const data = snapshot.val();
    const list = Array.isArray(data)
      ? data
      : Object.values(data || {});
    callback(list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  };

  onValue(testimonialsRef, listener, () => callback(defaultTestimonials));

  return () => off(testimonialsRef, 'value', listener);
}

/** Seed Realtime Database only if empty */
export async function seedRtdbIfEmpty() {
  if (!isRtdbConfigured() || !rtdb) return;

  const settingsRef = ref(rtdb, PATHS.site);
  const snap = await get(settingsRef);
  if (!snap.exists()) {
    await syncToRealtimeDB({
      settings: defaultSiteSettings,
      testimonials: defaultTestimonials,
    });
  }
}

/** Create a customer booking in Realtime Database (no email on submit) */
export async function createBooking(bookingData) {
  const db = requireRtdb();
  const { serviceLabel, ...rest } = bookingData;
  const bookingsRef = ref(db, PATHS.bookings);
  const newRef = push(bookingsRef);
  const now = Date.now();

  await set(newRef, {
    ...rest,
    ...(serviceLabel ? { serviceLabel } : {}),
    status: 'pending',
    createdAt: now,
  });

  return { id: newRef.key };
}

/** Subscribe to all bookings (newest first) */
export function subscribeBookings(callback, onError) {
  if (!isRtdbConfigured() || !rtdb) {
    callback([]);
    return () => {};
  }

  const bookingsRef = ref(rtdb, PATHS.bookings);

  const listener = (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const data = snapshot.val();
    const bookings = Object.entries(data)
      .map(([id, value]) => normalizeBooking(id, value))
      .filter(Boolean);
    callback(sortBookings(bookings));
  };

  const errorHandler = (err) => {
    const message = err?.message || 'Could not load bookings from Realtime Database';
    console.error('[bookings] subscribeBookings failed:', err);
    if (onError) onError(message);
    else callback([]);
  };

  onValue(bookingsRef, listener, errorHandler);

  return () => off(bookingsRef, 'value', listener);
}

/** Admin confirms a pending booking and sends confirmation email */
export async function confirmBooking(bookingId) {
  const db = requireRtdb();
  const bookingRef = ref(db, `${PATHS.bookings}/${bookingId}`);
  const snap = await get(bookingRef);

  if (!snap.exists()) {
    throw new Error('Booking not found');
  }

  const booking = snap.val();
  console.log('[bookings] Confirm clicked — booking loaded', {
    bookingId,
    email: booking.email,
    fullName: booking.fullName,
    status: booking.status,
  });

  if (booking.status === 'confirmed') {
    console.log('[bookings] Already confirmed — skipping', { bookingId });
    return;
  }
  if (booking.status === 'cancelled') {
    throw new Error('This booking was already cancelled');
  }

  await update(bookingRef, {
    status: 'confirmed',
    statusUpdatedAt: Date.now(),
    emailSent: false,
  });

  console.log('[bookings] Status saved as confirmed — calling email API', { bookingId });

  try {
    await notifyBookingEmail(bookingId, 'confirmed');
    console.log('[bookings] Confirmation email flow completed', { bookingId });
  } catch (err) {
    console.error('[bookings] Confirmation email failed', { bookingId, error: err.message });
    await update(bookingRef, {
      emailSent: false,
      emailError: err.message || 'Email delivery failed',
      emailAttemptedAt: Date.now(),
    });
    throw err;
  }
}

/** Admin cancels a booking with reason and sends cancellation email */
export async function cancelBooking(bookingId, cancellationReason) {
  const reason = cancellationReason?.trim();
  if (!reason) {
    throw new Error('Cancellation reason is required');
  }

  const db = requireRtdb();
  const bookingRef = ref(db, `${PATHS.bookings}/${bookingId}`);
  const snap = await get(bookingRef);

  if (!snap.exists()) {
    throw new Error('Booking not found');
  }

  const booking = snap.val();
  if (booking.status === 'cancelled') {
    return;
  }

  await update(bookingRef, {
    status: 'cancelled',
    cancellationReason: reason,
    statusUpdatedAt: Date.now(),
    emailSent: false,
  });

  console.log('[bookings] Status saved as cancelled — calling email API', { bookingId });

  try {
    await notifyBookingEmail(bookingId, 'cancelled');
    console.log('[bookings] Cancellation email flow completed', { bookingId });
  } catch (err) {
    console.error('[bookings] Cancellation email failed', { bookingId, error: err.message });
    await update(bookingRef, {
      emailSent: false,
      emailError: err.message || 'Email delivery failed',
      emailAttemptedAt: Date.now(),
    });
    throw err;
  }
}
