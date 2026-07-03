import { useEffect, useState } from 'react';
import { subscribeGallery } from '../services/firestoreService';

/** Live gallery images from Firestore */
export function useGalleryData() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeGallery((data) => {
      setImages(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { images, loading };
}
