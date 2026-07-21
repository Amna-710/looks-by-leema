import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const navItems = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'services', label: 'Services', icon: '✦' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
  { id: 'policies', label: 'Policies', icon: '📋' },
  { id: 'gallery', label: 'Gallery', icon: '🖼' },
  { id: 'settings', label: 'Site Settings', icon: '⚙' },
  { id: 'testimonials', label: 'Testimonials', icon: '💬' },
];

export default function AdminSidebar({ activeTab, onTabChange, mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && <div className="admin-sidebar__overlay" onClick={onClose} aria-hidden="true" />}
      <aside className={`admin-sidebar ${mobileOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__logo">LooksByLeema</span>
          <span className="admin-sidebar__badge">Admin</span>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-sidebar__link ${activeTab === item.id ? 'admin-sidebar__link--active' : ''}`}
              onClick={() => { onTabChange(item.id); onClose(); }}
            >
              <span className="admin-sidebar__icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <NavLink to="/" className="admin-sidebar__site-link" onClick={onClose}>
            View Website
          </NavLink>
        </div>
      </aside>
    </>
  );
}
