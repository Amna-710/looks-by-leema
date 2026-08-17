import { MIN_BOOKING_AMOUNT, MIN_BOOKING_MESSAGE } from '../config/booking';

/** Parse leading dollar amount from service price strings (e.g. "$150+", "$3–$5") */
export function parseServicePrice(priceStr) {
  if (!priceStr) return null;
  const match = String(priceStr).match(/\$?\s*(\d+)/);
  return match ? Number.parseInt(match[1], 10) : null;
}

export function meetsMinimumBooking(priceStr) {
  const amount = parseServicePrice(priceStr);
  return amount !== null && amount >= MIN_BOOKING_AMOUNT;
}

export function assertMinimumBooking(priceStr) {
  if (!meetsMinimumBooking(priceStr)) {
    throw new Error(MIN_BOOKING_MESSAGE);
  }
}
