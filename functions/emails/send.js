const nodemailer = require('nodemailer');

let cachedTransporter = null;
let cachedConfigKey = null;

function getSmtpConfig() {
  const user = process.env.SMTP_USER || 'looksbyleema@gmail.com';
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const from =
    process.env.EMAIL_FROM || `Looks By Leema <${user}>`;

  if (!pass) {
    throw new Error(
      'SMTP_PASS is not configured. Set it as a Firebase Functions secret before deploying.'
    );
  }

  return { user, pass, host, port, from };
}

function getTransporter() {
  const config = getSmtpConfig();
  const configKey = `${config.host}:${config.port}:${config.user}`;

  if (!cachedTransporter || cachedConfigKey !== configKey) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
    cachedConfigKey = configKey;
  }

  return { transporter: cachedTransporter, from: config.from };
}

/** Send an email via Gmail SMTP. Throws on failure — caller handles gracefully. */
async function sendBookingEmail({ to, subject, html, text }) {
  if (!to) {
    throw new Error('Recipient email address is missing');
  }

  const { transporter, from } = getTransporter();

  const info = await transporter.sendMail({
    from,
    to,
    replyTo: process.env.SMTP_USER || 'looksbyleema@gmail.com',
    subject,
    html,
    text,
  });

  return info.messageId || info.response || 'sent';
}

module.exports = {
  sendBookingEmail,
  getSmtpConfig,
};
