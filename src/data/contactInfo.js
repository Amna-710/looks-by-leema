/** Canonical LooksByLeema contact details — used on Contact Us and site settings defaults. */
export const CONTACT_EMAIL = 'looksbyleema@gmail.com';
export const CONTACT_PHONE = '+1 347 888 3225';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
export const CONTACT_TEL = 'tel:+13478883225';

/** Placeholder values that should never be shown for this business. */
export const LEGACY_PLACEHOLDER_PHONES = [
  '(555) 123-4567',
  '555-123-4567',
  '5551234567',
  '+1 555 123 4567',
];

export function normalizeContactFields(contact = {}) {
  const phone = LEGACY_PLACEHOLDER_PHONES.includes(contact.phone)
    ? CONTACT_PHONE
    : contact.phone || CONTACT_PHONE;

  return {
    ...contact,
    email: CONTACT_EMAIL,
    phone,
  };
}
