import { useEffect, useState } from 'react';
import { subscribeTestimonials } from '../services/firestoreService';
import { subscribeRtdbTestimonials } from '../services/rtdbService';
import { defaultTestimonials } from '../data/defaultSiteSettings';
import { isRtdbConfigured } from '../firebase/config';

/** Live testimonials from Realtime Database (preferred) or Firestore */
export function useTestimonialsData() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isRtdbConfigured()) {
      const unsubscribe = subscribeRtdbTestimonials((data) => {
        setTestimonials(data.length ? data : defaultTestimonials);
        setLoading(false);
      });
      return unsubscribe;
    }

    const unsubscribe = subscribeTestimonials((data) => {
      setTestimonials(data.length ? data : defaultTestimonials);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { testimonials, loading };
}
