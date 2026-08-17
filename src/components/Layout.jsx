import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LightboxProvider } from '../context/LightboxProvider';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

/** Shared layout with navbar, footer, and scroll reset on route change */
export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <LightboxProvider>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </LightboxProvider>
  );
}
