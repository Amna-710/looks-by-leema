import { useEffect, useState } from 'react';
import { subscribePolicies } from '../services/firestoreService';
import { defaultPolicies } from '../data/defaultPolicies';

/** Real-time policies from Firestore with static fallback */
export function usePoliciesData() {
  const [policies, setPolicies] = useState(defaultPolicies);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribePolicies((data) => {
      setPolicies(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { policies, loading };
}
