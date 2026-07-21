/** Fire-and-forget booking email notification (never blocks booking save) */
export async function notifyBookingEmail(bookingId, type) {
  if (!bookingId || !type) return;

  try {
    const res = await fetch('/api/booking-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, type }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.warn('[booking-email] API returned error:', data.error || res.status);
    }
  } catch (err) {
    console.warn('[booking-email] Failed to request email notification:', err.message);
  }
}
