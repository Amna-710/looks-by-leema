import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import { AuthProvider } from './context/AuthProvider';
import LoadingScreen from './components/LoadingScreen';
import Layout from './components/Layout';
import ProtectedRoute from './admin/components/ProtectedRoute';
import Home from './pages/Home';
import AboutPage from './pages/About';
import ServicesPage from './pages/Services';
import PoliciesPage from './pages/Policies';
import BookingPage from './pages/Booking';
import ContactPage from './pages/Contact';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import './admin/Admin.css';
import './admin/components/AdminLayout.css';
import './admin/components/AdminSidebar.css';

/** Root application with public and admin routing */
export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ThemeProvider>
      <AuthProvider>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="policies" element={<PoliciesPage />} />
              <Route path="booking" element={<BookingPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
