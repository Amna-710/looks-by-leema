import { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, login, loading, isConfigured } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/unauthorized-admin') {
        setError('This email is not authorized for admin access.');
      } else if (err.code === 'auth/email-not-verified') {
        setError(err.message);
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <h1>LooksByLeema</h1>
          <p>Admin Panel</p>
        </div>

        {!isConfigured ? (
          <div className="admin-login__config">
            <p>Firebase is not configured.</p>
            <p>Copy <code>.env.example</code> to <code>.env</code> and add your Firebase project credentials.</p>
          </div>
        ) : (
          <form className="admin-login__form" onSubmit={handleSubmit}>
            {error && <div className="admin-alert admin-alert--error">{error}</div>}

            <div className="admin-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="looksbyleema@gmail.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="admin-btn admin-btn--primary admin-btn--full" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        <Link to="/" className="admin-login__back">← Back to Website</Link>
      </div>
    </div>
  );
}
