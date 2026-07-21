import { handleBookingEmailRequest } from '../lib/bookingEmail/processBookingEmail.js';

/** Vercel serverless handler — sends booking notification emails via Gmail SMTP */
export default async function handler(req, res) {
  return handleBookingEmailRequest(req, res);
}
