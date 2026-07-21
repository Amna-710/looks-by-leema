import {
  buildBookingReceivedEmail,
  buildBookingConfirmedEmail,
  buildBookingCancelledEmail,
} from './templates.js';
import { sendBookingEmail } from './sendEmail.js';
import { getProjectId, getBooking, patchBooking } from './firestoreRest.js';

const EMAIL_CONFIG = {
  received: {
    sentField: 'receivedEmailSentAt',
    messageIdField: 'receivedEmailMessageId',
    build: buildBookingReceivedEmail,
  },
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
  if (!bookingId || !type) {
    throw new Error('bookingId and type are required');
  }

  const config = EMAIL_CONFIG[type];
  if (!config) {
    throw new Error(`Invalid email type: ${type}`);
  }

  const projectId = getProjectId();
  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is not configured on the server');
  }

  const booking = await getBooking(projectId, bookingId);

  if (!booking.email) {
    throw new Error('Booking has no customer email address');
  }

  if (booking[config.sentField]) {
    return { ok: true, skipped: true, reason: 'already_sent' };
  }

  const email = config.build(booking);
  const messageId = await sendBookingEmail({
    to: booking.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });

  await patchBooking(projectId, bookingId, {
    [config.sentField]: new Date().toISOString(),
    [config.messageIdField]: messageId,
  });

  return { ok: true, messageId };
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
    const result = await processBookingEmail(body);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (error) {
    console.error('[booking-email]', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error.message || 'Email delivery failed' }));
  }
}
