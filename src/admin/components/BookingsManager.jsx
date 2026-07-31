import { useEffect, useState } from 'react';
import {
  subscribeBookings,
  confirmBooking,
  cancelBooking,
} from '../../services/firestoreService';

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

function StatusBadge({ status }) {
  return (
    <span className={`admin-badge admin-badge--${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function BookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

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

  const handleConfirm = async (bookingId) => {
    setBusyId(bookingId);
    try {
      await confirmBooking(bookingId);
    } catch (err) {
      alert(err.message || 'Failed to confirm booking');
    } finally {
      setBusyId('');
    }
  };

  const openCancelModal = (booking) => {
    setCancelTarget(booking);
    setCancelReason('');
    setCancelError('');
  };

  const closeCancelModal = () => {
    setCancelTarget(null);
    setCancelReason('');
    setCancelError('');
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelTarget) return;

    const reason = cancelReason.trim();
    if (!reason) {
      setCancelError('Please enter a cancellation reason for the customer.');
      return;
    }

    setBusyId(cancelTarget.id);
    setCancelError('');
    try {
      await cancelBooking(cancelTarget.id, reason);
      closeCancelModal();
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel booking');
    } finally {
      setBusyId('');
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
          {' '}Ensure Realtime Database is enabled and deploy rules with{' '}
          <code>npm run deploy:database</code>.
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
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => {
                const isPending = booking.status === 'pending';
                const isBusy = busyId === booking.id;

                return (
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
                    <td>
                      <StatusBadge status={booking.status} />
                      {booking.cancellationReason && (
                        <div className="admin-muted" style={{ marginTop: '0.35rem', maxWidth: '220px' }}>
                          Reason: {booking.cancellationReason}
                        </div>
                      )}
                    </td>
                    <td className="admin-muted">{formatDate(booking.createdAt)}</td>
                    <td>
                      {isPending ? (
                        <div className="admin-actions" style={{ flexWrap: 'nowrap' }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm admin-btn--primary"
                            disabled={isBusy}
                            onClick={() => handleConfirm(booking.id)}
                          >
                            {isBusy ? 'Saving…' : 'Confirm Booking'}
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm admin-btn--danger"
                            disabled={isBusy}
                            onClick={() => openCancelModal(booking)}
                          >
                            Cancel Booking
                          </button>
                        </div>
                      ) : (
                        <span className="admin-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {cancelTarget && (
        <div className="admin-modal-backdrop" onClick={closeCancelModal}>
          <div
            className="admin-card admin-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="cancel-booking-title"
          >
            <h2 id="cancel-booking-title">Cancel Booking</h2>
            <p className="admin-muted">
              Cancelling appointment for <strong>{cancelTarget.fullName}</strong> ({cancelTarget.email}).
            </p>
            <form onSubmit={handleCancelSubmit}>
              <div className="form-group">
                <label htmlFor="cancelReason">Cancellation reason *</label>
                <textarea
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={4}
                  placeholder="Explain why this booking cannot be confirmed. This message will be emailed to the customer."
                  required
                />
              </div>
              {cancelError && <p className="form-error">{cancelError}</p>}
              <div className="admin-actions">
                <button
                  type="submit"
                  className="admin-btn admin-btn--danger"
                  disabled={busyId === cancelTarget.id}
                >
                  {busyId === cancelTarget.id ? 'Cancelling…' : 'Save & Notify Customer'}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={closeCancelModal}
                  disabled={busyId === cancelTarget.id}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
