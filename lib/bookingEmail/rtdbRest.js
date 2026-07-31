/** Server-side Realtime Database access for the booking email API */

export const BOOKING_RTDDB_PROJECT_ID = 'looksbyleema-52909';

const DEFAULT_DATABASE_URL =
  'https://looksbyleema-52909-default-rtdb.firebaseio.com';

export function getDatabaseUrl() {
  return (
    process.env.FIREBASE_DATABASE_URL ||
    process.env.VITE_FIREBASE_DATABASE_URL ||
    DEFAULT_DATABASE_URL
  );
}

function bookingsUrl(bookingId) {
  const base = getDatabaseUrl().replace(/\/$/, '');
  return `${base}/bookings/${encodeURIComponent(bookingId)}.json`;
}

export async function getBooking(bookingId) {
  const res = await fetch(bookingsUrl(bookingId));
  if (!res.ok) {
    throw new Error(`Failed to load booking from Realtime Database (${res.status})`);
  }

  const booking = await res.json();
  if (!booking || typeof booking !== 'object') {
    throw new Error(`Booking not found in Realtime Database (${BOOKING_RTDDB_PROJECT_ID})`);
  }

  return booking;
}

export async function patchBooking(bookingId, fields) {
  const res = await fetch(bookingsUrl(bookingId), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Failed to update booking email status (${res.status}): ${body.slice(0, 200)}`
    );
  }
}
