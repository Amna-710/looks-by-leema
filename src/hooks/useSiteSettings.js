import { useEffect, useState } from 'react';
import { subscribeSiteSettings } from '../services/firestoreService';
import { subscribeRtdbSettings } from '../services/rtdbService';
import { defaultSiteSettings } from '../data/defaultSiteSettings';
import { normalizeContactFields } from '../data/contactInfo';
import { isRtdbConfigured } from '../firebase/config';

function mergeSettings(data) {
  return {
    hero: { ...defaultSiteSettings.hero, ...data?.hero },
    welcome: { ...defaultSiteSettings.welcome, ...data?.welcome },
    contact: normalizeContactFields({
      ...defaultSiteSettings.contact,
      ...data?.contact,
    }),
    about: { ...defaultSiteSettings.about, ...data?.about },
  };
}

/** Live site settings from Realtime Database (preferred) or Firestore */
export function useSiteSettings() {
  const [settings, setSettings] = useState(defaultSiteSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isRtdbConfigured()) {
      const unsubscribe = subscribeRtdbSettings((data) => {
        setSettings(mergeSettings(data));
        setLoading(false);
      });
      return unsubscribe;
    }

    const unsubscribe = subscribeSiteSettings((data) => {
      setSettings(mergeSettings(data));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { settings, loading };
}
