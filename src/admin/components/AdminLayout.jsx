import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import OverviewPanel from './OverviewPanel';
import ServicesManager from './ServicesManager';
import BookingsManager from './BookingsManager';
import PoliciesManager from './PoliciesManager';
import SettingsManager from './SettingsManager';
import TestimonialsManager from './TestimonialsManager';
import GalleryManager from './GalleryManager';
import './AdminLayout.css';

const panelTitles = {
  overview: 'Dashboard Overview',
  services: 'Manage Services',
  bookings: 'Customer Bookings',
  policies: 'Studio Policies',
  gallery: 'Salon Gallery',
  settings: 'Site Settings',
  testimonials: 'Testimonials',
};

export default function AdminLayout({ children }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderPanel = () => {
    switch (activeTab) {
      case 'overview': return <OverviewPanel onNavigate={setActiveTab} />;
      case 'services': return <ServicesManager />;
      case 'bookings': return <BookingsManager />;
      case 'policies': return <PoliciesManager />;
      case 'gallery': return <GalleryManager />;
      case 'settings': return <SettingsManager />;
      case 'testimonials': return <TestimonialsManager />;
      default: return children;
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="admin-main">
        <header className="admin-header">
          <button
            type="button"
            className="admin-header__menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
          <h1 className="admin-header__title">{panelTitles[activeTab]}</h1>
        </header>

        <div className="admin-content">
          {renderPanel()}
        </div>
      </div>
    </div>
  );
}
