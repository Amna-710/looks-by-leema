import { useEffect, useState } from 'react';
import { subscribeServices, flattenServices, ensureServicesInFirestore } from '../services/firestoreService';
import { serviceCategories as fallback } from '../data/services';

/** Real-time service categories from Firestore with static fallback */
export function useServicesData() {
  const [categories, setCategories] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [firestoreError, setFirestoreError] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeServices((data, meta = {}) => {
      setCategories(data);
      setIsLive(meta.isLive ?? false);
      setIsEmpty(meta.isEmpty ?? false);
      setFirestoreError(meta.error || '');
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return {
    categories,
    loading,
    isLive,
    isEmpty,
    firestoreError,
    flatServices: flattenServices(categories),
    ensureInFirestore: ensureServicesInFirestore,
  };
}
