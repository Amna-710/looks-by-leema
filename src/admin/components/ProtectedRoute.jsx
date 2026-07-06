import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/** Redirects unauthenticated or non-admin users to admin login */
export default function ProtectedRoute({ children }) {
  const { user, loading, isAdmin, isConfigured } = useAuth();
  const location = useLocation();

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
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
