import { ref, set, onValue, off, get } from 'firebase/database';
import { rtdb, isRtdbConfigured } from '../firebase/config';
import { defaultSiteSettings, defaultTestimonials } from '../data/defaultSiteSettings';

const PATHS = {
  site: 'site/settings',
  testimonials: 'site/testimonials',
};

/** Push latest site data to Realtime Database for live sync */
export async function syncToRealtimeDB({ settings, testimonials }) {
  if (!isRtdbConfigured() || !rtdb) return;

  const updates = {};
  if (settings) updates[PATHS.site] = settings;
  if (testimonials) updates[PATHS.testimonials] = testimonials;

  await Promise.all(
    Object.entries(updates).map(([path, data]) => set(ref(rtdb, path), data))
  );
}

/** Subscribe to site settings from Realtime Database */
export function subscribeRtdbSettings(callback) {
  if (!isRtdbConfigured() || !rtdb) {
    callback(defaultSiteSettings);
    return () => {};
  }

  const settingsRef = ref(rtdb, PATHS.site);
  const listener = (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : defaultSiteSettings);
  };

  onValue(settingsRef, listener, () => callback(defaultSiteSettings));

  return () => off(settingsRef, 'value', listener);
}

/** Subscribe to testimonials from Realtime Database */
export function subscribeRtdbTestimonials(callback) {
  if (!isRtdbConfigured() || !rtdb) {
    callback(defaultTestimonials);
    return () => {};
  }

  const testimonialsRef = ref(rtdb, PATHS.testimonials);
  const listener = (snapshot) => {
    if (!snapshot.exists()) {
      callback(defaultTestimonials);
      return;
    }
    const data = snapshot.val();
    const list = Array.isArray(data)
      ? data
      : Object.values(data || {});
    callback(list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  };

  onValue(testimonialsRef, listener, () => callback(defaultTestimonials));

  return () => off(testimonialsRef, 'value', listener);
}

/** Seed Realtime Database only if empty */
export async function seedRtdbIfEmpty() {
  if (!isRtdbConfigured() || !rtdb) return;

  const settingsRef = ref(rtdb, PATHS.site);
  const snap = await get(settingsRef);
  if (!snap.exists()) {
    await syncToRealtimeDB({
      settings: defaultSiteSettings,
      testimonials: defaultTestimonials,
    });
  }
}
