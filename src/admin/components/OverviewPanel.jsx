import { useEffect, useState } from 'react';
import { subscribeBookings, subscribeGallery } from '../../services/firestoreService';
import { useServicesData } from '../../hooks/useServicesData';

export default function OverviewPanel({ onNavigate }) {
  const { categories } = useServicesData();
  const [bookings, setBookings] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const unsubBookings = subscribeBookings(setBookings);
    const unsubGallery = subscribeGallery(setImages);
    return () => { unsubBookings(); unsubGallery(); };
  }, []);

  const totalServices = categories.reduce((sum, c) => sum + (c.services?.length || 0), 0);
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;

  const cards = [
    { label: 'Service Categories', value: categories.length, tab: 'services' },
    { label: 'Total Services', value: totalServices, tab: 'services' },
    { label: 'Pending Bookings', value: pendingBookings, tab: 'bookings' },
    { label: 'Gallery Images', value: images.length, tab: 'gallery' },
  ];

  return (
    <div className="admin-panel">
      <div className="admin-stats">
        {cards.map((card) => (
          <button
            key={card.label}
            type="button"
            className="admin-stat-card"
            onClick={() => onNavigate(card.tab)}
          >
            <span className="admin-stat-card__value">{card.value}</span>
            <span className="admin-stat-card__label">{card.label}</span>
          </button>
        ))}
      </div>

      <div className="admin-overview-grid">
        <section className="admin-card">
          <h2>Recent Bookings</h2>
          {bookings.length === 0 ? (
            <p className="admin-empty">No bookings yet.</p>
          ) : (
            <ul className="admin-list">
              {bookings.slice(0, 5).map((b) => (
                <li key={b.id}>
                  <strong>{b.fullName}</strong> — {b.service}
                  <span className={`admin-badge admin-badge--${b.status}`}>{b.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card">
          <h2>Quick Actions</h2>
          <div className="admin-actions">
            <button type="button" className="admin-btn admin-btn--primary" onClick={() => onNavigate('services')}>
              Manage Services
            </button>
            <button type="button" className="admin-btn admin-btn--secondary" onClick={() => onNavigate('bookings')}>
              View Bookings
            </button>
            <button type="button" className="admin-btn admin-btn--secondary" onClick={() => onNavigate('gallery')}>
              Upload Images
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
