import nodemailer from 'nodemailer';

let cachedTransporter = null;

function getSmtpConfig() {
  const user = process.env.SMTP_USER || 'looksbyleema@gmail.com';
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const from = process.env.EMAIL_FROM || `Looks By Leema <${user}>`;

  if (!pass) {
    throw new Error('SMTP_PASS is not configured on the server. Add it to Vercel/Firebase environment variables.');
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

  const config = getSmtpConfig();
  const info = await getTransporter().sendMail({
    from: config.from,
    to,
    replyTo: config.user,
    subject,
    html,
    text,
  });

  return info.messageId || info.response || 'sent';
}
