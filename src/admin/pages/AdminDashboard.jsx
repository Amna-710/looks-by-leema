import { useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { seedDatabaseIfEmpty } from '../../services/firestoreService';

export default function AdminDashboard() {
  useEffect(() => {
    seedDatabaseIfEmpty().catch(console.error);
  }, []);

  return <AdminLayout />;
}
