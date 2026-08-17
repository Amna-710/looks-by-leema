/** Canonical LooksByLeema contact details — used on Contact Us and site settings defaults. */
export const CONTACT_EMAIL = 'looksbyleema@gmail.com';
export const CONTACT_PHONE = '+1 347 888 3225';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
export const CONTACT_TEL = 'tel:+13478883225';

/** Official social profile URLs */
export const SOCIAL_INSTAGRAM_URL = 'https://www.instagram.com/looks_byleema/';
export const SOCIAL_TIKTOK_URL = 'https://www.tiktok.com/@looks_byleema';
export const SOCIAL_YOUTUBE_URL = 'https://www.youtube.com/@looks_byleema';

export const CONTACT_SOCIAL_LINKS = [
  { name: 'Instagram', href: SOCIAL_INSTAGRAM_URL },
  { name: 'TikTok', href: SOCIAL_TIKTOK_URL },
  { name: 'YouTube', href: SOCIAL_YOUTUBE_URL },
];

/** Generic platform homepages — never use as profile links. */
export const LEGACY_PLACEHOLDER_SOCIAL_URLS = [
  'https://instagram.com',
  'https://www.instagram.com',
  'https://instagram.com/',
  'https://www.instagram.com/',
  'https://tiktok.com',
  'https://www.tiktok.com',
  'https://tiktok.com/',
  'https://www.tiktok.com/',
  'https://facebook.com',
  'https://www.facebook.com',
  'https://youtube.com',
  'https://www.youtube.com',
];

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

  const instagram = LEGACY_PLACEHOLDER_SOCIAL_URLS.includes(contact.instagram)
    ? SOCIAL_INSTAGRAM_URL
    : contact.instagram || SOCIAL_INSTAGRAM_URL;

  const tiktok = LEGACY_PLACEHOLDER_SOCIAL_URLS.includes(contact.tiktok)
    ? SOCIAL_TIKTOK_URL
    : contact.tiktok || SOCIAL_TIKTOK_URL;

  const youtube = LEGACY_PLACEHOLDER_SOCIAL_URLS.includes(contact.youtube)
    ? SOCIAL_YOUTUBE_URL
    : contact.youtube || SOCIAL_YOUTUBE_URL;

  return {
    ...contact,
    email: CONTACT_EMAIL,
    phone,
    instagram,
    tiktok,
    youtube,
  };
}
