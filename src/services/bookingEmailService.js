/**
 * Request a booking notification email via the Vercel API.
 * Throws on failure so admin actions can surface errors.
 */
export async function notifyBookingEmail(bookingId, type) {
  if (!bookingId || !type) {
    throw new Error('[booking-email] bookingId and type are required');
  }

  const payload = { bookingId, type };
  console.log('[booking-email] 1. API call starting', payload);

  let res;
  try {
    res = await fetch('/api/booking-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[booking-email] 2. Network error calling /api/booking-email', err);
    throw new Error(`Email API network error: ${err.message}`);
  }

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  console.log('[booking-email] 3. API response', {
    status: res.status,
    ok: res.ok,
    body: data,
  });

  if (!res.ok) {
    const message = data.error || `Email API failed with status ${res.status}`;
    console.error('[booking-email] 4. API error', message);
    throw new Error(message);
  }

  if (data.skipped) {
    console.log('[booking-email] 5. Email skipped', data.reason);
  } else {
    console.log('[booking-email] 5. Email sent successfully', {
      messageId: data.messageId,
      emailSent: data.emailSent,
    });
  }

  return data;
}
