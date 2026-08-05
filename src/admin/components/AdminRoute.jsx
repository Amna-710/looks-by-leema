import { useAuth } from '../../hooks/useAuth';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';

/** /admin — login when signed out, dashboard when authenticated admin */
export default function AdminRoute() {
  const { user, loading, isAdmin, isConfigured } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="admin-config-error">
        <h2>Firebase Not Configured</h2>
        <p>Copy <code>.env.example</code> to <code>.env</code> and add your Firebase credentials.</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
