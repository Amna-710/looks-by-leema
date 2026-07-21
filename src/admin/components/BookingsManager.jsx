import { useEffect, useState } from 'react';
import { subscribeBookings, updateBookingStatus } from '../../services/firestoreService';

const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled'];

function formatDate(date) {
  if (!date) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function BookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const unsubscribe = subscribeBookings(
      (data) => {
        setBookings(data);
        setFetchError('');
        setLoading(false);
      },
      (message) => {
        setFetchError(message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const handleStatusChange = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter);

  if (loading) return <p className="admin-empty">Loading bookings...</p>;

  return (
    <div className="admin-panel">
      {fetchError && (
        <div className="admin-alert admin-alert--error" style={{ marginBottom: '1rem' }}>
          <strong>Could not load bookings:</strong> {fetchError}
          {' '}Deploy updated Firestore rules with <code>firebase deploy --only firestore:rules</code>.
        </div>
      )}
      <div className="admin-toolbar">
        <label>
          Filter by status
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All ({bookings.length})</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)} ({bookings.filter((b) => b.status === s).length})
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="admin-empty">No bookings found.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Contact</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Message</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => (
                <tr key={booking.id}>
                  <td><strong>{booking.fullName}</strong></td>
                  <td>
                    <div>{booking.email}</div>
                    <div className="admin-muted">{booking.phone}</div>
                  </td>
                  <td>{booking.serviceLabel || booking.service}</td>
                  <td>
                    {booking.date}<br />
                    <span className="admin-muted">{booking.time}</span>
                  </td>
                  <td className="admin-table__message">{booking.message || '—'}</td>
                  <td>
                    <select
                      className={`admin-status-select admin-status-select--${booking.status}`}
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="admin-muted">{formatDate(booking.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
