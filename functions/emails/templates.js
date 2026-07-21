/** Format stored service value for customer-facing emails */
function formatServiceName(booking) {
  if (booking.serviceLabel) return booking.serviceLabel;
  if (!booking.service) return 'Your selected service';
  const parts = String(booking.service).split(':');
  if (parts.length >= 2) {
    const category = parts[0].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return `${category} — ${parts.slice(1).join(':')}`;
  }
  return booking.service;
}

/** Format YYYY-MM-DD as a friendly date */
function formatBookingDate(dateStr) {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Format HH:MM (24h) as friendly time */
function formatBookingTime(timeStr) {
  if (!timeStr) return '—';
  const [hour, minute] = timeStr.split(':').map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return timeStr;
  const date = new Date(2000, 0, 1, hour, minute);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailShell({ title, statusLabel, statusTone, bodyHtml }) {
  const tones = {
    pending: { bg: '#FFF8E8', color: '#B76E79', border: '#F3D9C6' },
    confirmed: { bg: '#E8F6EE', color: '#2F7A4F', border: '#B7E4C7' },
    cancelled: { bg: '#FDEEEE', color: '#9B4D4D', border: '#F5CFCF' },
  };
  const tone = tones[statusTone] || tones.pending;
  const statusBg = tone.bg;
  const statusColor = tone.color;
  const statusBorder = tone.border;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#FDF8F8;font-family:'Poppins',Arial,sans-serif;color:#333333;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#FDF8F8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(183,110,121,0.12);">
          <tr>
            <td style="background:linear-gradient(135deg,#F8D7DA 0%,#FFFFFF 55%,#FFF5F6 100%);padding:36px 32px 28px;text-align:center;border-bottom:1px solid rgba(183,110,121,0.15);">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.2;color:#B76E79;font-weight:600;">Looks By Leema</div>
              <div style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#9A6A72;margin-top:8px;">Luxury Beauty Studio</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:${statusBg};border:1px solid ${statusBorder};color:${statusColor};font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:22px;">
                ${escapeHtml(statusLabel)}
              </div>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#FFF9FA;border:1px solid rgba(183,110,121,0.12);border-radius:14px;">
                <tr>
                  <td style="padding:18px 20px;font-size:13px;line-height:1.7;color:#666666;text-align:center;">
                    Looks By Leema · Queens, New York<br>
                    <a href="mailto:looksbyleema@gmail.com" style="color:#B76E79;text-decoration:none;">looksbyleema@gmail.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildDetailsTable({ serviceName, date, time }) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0 28px;background:#FFF9FA;border:1px solid rgba(183,110,121,0.12);border-radius:14px;">
    <tr>
      <td style="padding:18px 20px;">
        <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#B76E79;font-weight:600;margin-bottom:12px;">Appointment Details</div>
        <div style="font-size:15px;line-height:1.9;color:#444444;">
          <strong style="color:#222222;">Service:</strong> ${escapeHtml(serviceName)}<br>
          <strong style="color:#222222;">Date:</strong> ${escapeHtml(date)}<br>
          <strong style="color:#222222;">Time:</strong> ${escapeHtml(time)}
        </div>
      </td>
    </tr>
  </table>`;
}

/** Email sent immediately after a booking request is submitted */
function buildBookingReceivedEmail(booking) {
  const customerName = booking.fullName || 'there';
  const serviceName = formatServiceName(booking);
  const date = formatBookingDate(booking.date);
  const time = formatBookingTime(booking.time);

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.3;color:#222222;font-weight:600;">
      Your Appointment Request Has Been Received ✨
    </h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#444444;">
      Hi ${escapeHtml(customerName)},
    </p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#444444;">
      Thank you for choosing <strong style="color:#B76E79;">Looks By Leema</strong>! ✨
    </p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#444444;">
      We have successfully received your appointment request for <strong>${escapeHtml(serviceName)}</strong> on <strong>${escapeHtml(date)}</strong> at <strong>${escapeHtml(time)}</strong>.
    </p>
    ${buildDetailsTable({ serviceName, date, time })}
    <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#444444;">
      Your booking is currently being processed. Our team will review your request and send you a confirmation email shortly.
    </p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#444444;">
      We’re excited to welcome you! 💕
    </p>
    <p style="margin:0;font-size:16px;line-height:1.8;color:#444444;">
      Thank you for choosing Looks By Leema.<br><br>
      Best regards,<br>
      <strong style="color:#B76E79;">Looks By Leema Team</strong>
    </p>`;

  return {
    subject: 'Your Appointment Request Has Been Received ✨',
    html: buildEmailShell({
      title: 'Appointment Request Received',
      statusLabel: 'In Process',
      statusTone: 'pending',
      bodyHtml,
    }),
    text: [
      `Hi ${customerName},`,
      '',
      'Thank you for choosing Looks By Leema!',
      '',
      `We have successfully received your appointment request for ${serviceName} on ${date} at ${time}.`,
      '',
      'Status: In Process',
      'Your booking is currently being processed. Our team will review your request and send you a confirmation email shortly.',
      '',
      'We’re excited to welcome you!',
      '',
      'Best regards,',
      'Looks By Leema Team',
    ].join('\n'),
  };
}

/** Email sent when admin confirms the appointment */
function buildBookingConfirmedEmail(booking) {
  const customerName = booking.fullName || 'there';
  const serviceName = formatServiceName(booking);
  const date = formatBookingDate(booking.date);
  const time = formatBookingTime(booking.time);

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.3;color:#222222;font-weight:600;">
      Your Appointment Is Confirmed ✨
    </h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#444444;">
      Hi ${escapeHtml(customerName)},
    </p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#444444;">
      Wonderful news — your appointment at <strong style="color:#B76E79;">Looks By Leema</strong> has been confirmed! ✨
    </p>
    ${buildDetailsTable({ serviceName, date, time })}
    <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#444444;">
      We can’t wait to welcome you and help you look and feel your absolute best. If you need to make any changes, simply reply to this email or contact our team.
    </p>
    <p style="margin:0;font-size:16px;line-height:1.8;color:#444444;">
      See you soon! 💕<br><br>
      Best regards,<br>
      <strong style="color:#B76E79;">Looks By Leema Team</strong>
    </p>`;

  return {
    subject: 'Your Appointment Is Confirmed ✨',
    html: buildEmailShell({
      title: 'Appointment Confirmed',
      statusLabel: 'Confirmed',
      statusTone: 'confirmed',
      bodyHtml,
    }),
    text: [
      `Hi ${customerName},`,
      '',
      'Wonderful news — your appointment at Looks By Leema has been confirmed!',
      '',
      `Service: ${serviceName}`,
      `Date: ${date}`,
      `Time: ${time}`,
      '',
      'Status: Confirmed',
      '',
      'We can’t wait to welcome you!',
      '',
      'Best regards,',
      'Looks By Leema Team',
    ].join('\n'),
  };
}

/** Email sent when admin cancels/rejects the appointment */
function buildBookingCancelledEmail(booking) {
  const customerName = booking.fullName || 'there';
  const serviceName = formatServiceName(booking);
  const date = formatBookingDate(booking.date);
  const time = formatBookingTime(booking.time);

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.3;color:#222222;font-weight:600;">
      Appointment Update
    </h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#444444;">
      Hi ${escapeHtml(customerName)},
    </p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#444444;">
      We’re writing to let you know that your appointment request at <strong style="color:#B76E79;">Looks By Leema</strong> could not be confirmed at this time.
    </p>
    ${buildDetailsTable({ serviceName, date, time })}
    <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#444444;">
      If you would like to reschedule or have any questions, please reply to this email or contact us — we would love to help you find another time.
    </p>
    <p style="margin:0;font-size:16px;line-height:1.8;color:#444444;">
      Best regards,<br>
      <strong style="color:#B76E79;">Looks By Leema Team</strong>
    </p>`;

  return {
    subject: 'Update on Your Appointment Request — Looks By Leema',
    html: buildEmailShell({
      title: 'Appointment Cancelled',
      statusLabel: 'Not Confirmed',
      statusTone: 'cancelled',
      bodyHtml,
    }),
    text: [
      `Hi ${customerName},`,
      '',
      `Your appointment request for ${serviceName} on ${date} at ${time} could not be confirmed at this time.`,
      '',
      'Please contact us to reschedule.',
      '',
      'Best regards,',
      'Looks By Leema Team',
    ].join('\n'),
  };
}

module.exports = {
  formatServiceName,
  formatBookingDate,
  formatBookingTime,
  buildBookingReceivedEmail,
  buildBookingConfirmedEmail,
  buildBookingCancelledEmail,
};
