const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { defineSecret, defineString } = require('firebase-functions/params');
const { setGlobalOptions } = require('firebase-functions/v2');

const { sendBookingEmail } = require('./emails/send');
const {
  buildBookingReceivedEmail,
  buildBookingConfirmedEmail,
  buildBookingCancelledEmail,
} = require('./emails/templates');

initializeApp();

setGlobalOptions({ maxInstances: 10 });

const smtpPass = defineSecret('SMTP_PASS');
const smtpUser = defineString('SMTP_USER', { default: 'looksbyleema@gmail.com' });
const smtpHost = defineString('SMTP_HOST', { default: 'smtp.gmail.com' });
const smtpPort = defineString('SMTP_PORT', { default: '587' });
const emailFrom = defineString('EMAIL_FROM', {
  default: 'Looks By Leema <looksbyleema@gmail.com>',
});

function applyEmailEnv() {
  process.env.SMTP_USER = smtpUser.value();
  process.env.SMTP_PASS = smtpPass.value();
  process.env.SMTP_HOST = smtpHost.value();
  process.env.SMTP_PORT = smtpPort.value();
  process.env.EMAIL_FROM = emailFrom.value();
}

async function recordEmailSuccess(docRef, fields) {
  await docRef.update({
    ...fields,
    emailErrors: FieldValue.delete(),
  });
}

async function recordEmailFailure(docRef, type, error) {
  console.error(`[booking-email] Failed to send ${type} email:`, error);

  await docRef.set(
    {
      emailErrors: FieldValue.arrayUnion({
        type,
        message: error?.message || String(error),
        at: new Date().toISOString(),
      }),
    },
    { merge: true }
  );
}

/** Send "request received / in process" email when a booking is created */
exports.onBookingCreatedSendEmail = onDocumentCreated(
  {
    document: 'bookings/{bookingId}',
    secrets: [smtpPass],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const booking = snapshot.data();
    const docRef = snapshot.ref;

    if (booking.receivedEmailSentAt) {
      console.log('[booking-email] Received email already sent — skipping');
      return;
    }

    applyEmailEnv();

    try {
      const email = buildBookingReceivedEmail(booking);
      const messageId = await sendBookingEmail({
        to: booking.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });

      await recordEmailSuccess(docRef, {
        receivedEmailSentAt: FieldValue.serverTimestamp(),
        receivedEmailMessageId: messageId,
      });

      console.log('[booking-email] Received email sent to', booking.email);
    } catch (error) {
      await recordEmailFailure(docRef, 'received', error);
    }
  }
);

/** Send confirmation email when admin sets status to confirmed */
exports.onBookingUpdatedSendEmail = onDocumentUpdated(
  {
    document: 'bookings/{bookingId}',
    secrets: [smtpPass],
  },
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();
    const docRef = event.data.after.ref;

    if (!after) return;
    if (before.status === after.status) return;
    if (before.status === after.status) return;

    if (after.status === 'confirmed' && !after.confirmedEmailSentAt) {
      applyEmailEnv();
      try {
        const email = buildBookingConfirmedEmail(after);
        const messageId = await sendBookingEmail({
          to: after.email,
          subject: email.subject,
          html: email.html,
          text: email.text,
        });
        await recordEmailSuccess(docRef, {
          confirmedEmailSentAt: FieldValue.serverTimestamp(),
          confirmedEmailMessageId: messageId,
          statusUpdatedAt: FieldValue.serverTimestamp(),
        });
        console.log('[booking-email] Confirmation email sent to', after.email);
      } catch (error) {
        await recordEmailFailure(docRef, 'confirmed', error);
      }
      return;
    }

    if (after.status === 'cancelled' && !after.cancelledEmailSentAt) {
      applyEmailEnv();
      try {
        const email = buildBookingCancelledEmail(after);
        const messageId = await sendBookingEmail({
          to: after.email,
          subject: email.subject,
          html: email.html,
          text: email.text,
        });
        await recordEmailSuccess(docRef, {
          cancelledEmailSentAt: FieldValue.serverTimestamp(),
          cancelledEmailMessageId: messageId,
          statusUpdatedAt: FieldValue.serverTimestamp(),
        });
        console.log('[booking-email] Cancellation email sent to', after.email);
      } catch (error) {
        await recordEmailFailure(docRef, 'cancelled', error);
      }
    }
  }
);
