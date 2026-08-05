import {
  buildBookingConfirmedEmail,
  buildBookingCancelledEmail,
} from './templates.js';
import { sendBookingEmail } from './sendEmail.js';
import { getBooking, patchBooking } from './rtdbRest.js';

const EMAIL_CONFIG = {
  confirmed: {
    sentField: 'confirmedEmailSentAt',
    messageIdField: 'confirmedEmailMessageId',
    build: buildBookingConfirmedEmail,
  },
  cancelled: {
    sentField: 'cancelledEmailSentAt',
    messageIdField: 'cancelledEmailMessageId',
    build: buildBookingCancelledEmail,
  },
};

export async function processBookingEmail({ bookingId, type }) {
  console.log('[booking-email] processBookingEmail start', { bookingId, type });

  if (!bookingId || !type) {
    throw new Error('bookingId and type are required');
  }

  const config = EMAIL_CONFIG[type];
  if (!config) {
    throw new Error(`Invalid email type: ${type}. Only confirmed and cancelled are supported.`);
  }

  const booking = await getBooking(bookingId);
  console.log('[booking-email] Booking loaded from RTDB', {
    bookingId,
    email: booking.email,
    fullName: booking.fullName,
    status: booking.status,
    hasSentMarker: Boolean(booking[config.sentField]),
  });

  if (!booking.email) {
    throw new Error('Booking has no customer email address');
  }

  if (booking[config.sentField]) {
    console.log('[booking-email] Email already sent — skipping', {
      bookingId,
      type,
      sentAt: booking[config.sentField],
    });
    return { ok: true, skipped: true, reason: 'already_sent', emailSent: true };
  }

  const email = config.build(booking);
  console.log('[booking-email] Email payload built', {
    to: booking.email,
    subject: email.subject,
    type,
  });

  const messageId = await sendBookingEmail({
    to: booking.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });

  const sentAt = new Date().toISOString();
  await patchBooking(bookingId, {
    [config.sentField]: sentAt,
    [config.messageIdField]: messageId,
    emailSent: true,
    emailSentAt: sentAt,
    lastEmailType: type,
  });
  console.log('[booking-email] RTDB updated with email status', {
    bookingId,
    emailSent: true,
    emailSentAt: sentAt,
    type,
  });

  return { ok: true, messageId, emailSent: true, emailSentAt: sentAt };
}

export async function handleBookingEmailRequest(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.log('[booking-email] API request received', body);
    const result = await processBookingEmail(body);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (error) {
    console.error('[booking-email] API handler error', {
      message: error.message,
      stack: error.stack,
    });
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error.message || 'Email delivery failed' }));
  }
}
