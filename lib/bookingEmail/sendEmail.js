import nodemailer from 'nodemailer';

let cachedTransporter = null;

function getSmtpConfig() {
  const user = process.env.SMTP_USER || 'looksbyleema@gmail.com';
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const from = process.env.EMAIL_FROM || `Looks By Leema <${user}>`;

  console.log('[booking-email] SMTP config loaded', {
    host,
    port,
    user,
    from,
    hasPassword: Boolean(pass),
  });

  if (!pass) {
    throw new Error(
      'SMTP_PASS is not configured on the server. Add your Gmail App Password to Vercel environment variables.'
    );
  }

  return { user, pass, host, port, from };
}

function getTransporter() {
  if (!cachedTransporter) {
    const config = getSmtpConfig();
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: { user: config.user, pass: config.pass },
    });
  }
  return cachedTransporter;
}

export async function sendBookingEmail({ to, subject, html, text }) {
  if (!to) throw new Error('Recipient email address is missing');

  console.log('[booking-email] 6. Preparing SMTP send', {
    to,
    subject,
  });

  const transporter = getTransporter();

  try {
    await transporter.verify();
    console.log('[booking-email] 7. SMTP connection verified');
  } catch (err) {
    console.error('[booking-email] 7. SMTP verification failed', err);
    throw new Error(`SMTP connection failed: ${err.message}`);
  }

  const config = getSmtpConfig();
  const info = await transporter.sendMail({
    from: config.from,
    to,
    replyTo: config.user,
    subject,
    html,
    text,
  });

  console.log('[booking-email] 8. Email sent via SMTP', {
    messageId: info.messageId,
    response: info.response,
  });

  return info.messageId || info.response || 'sent';
}
