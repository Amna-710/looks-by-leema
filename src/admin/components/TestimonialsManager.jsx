import { useState } from 'react';
import { useTestimonialsData } from '../../hooks/useTestimonialsData';
import { addTestimonial, updateTestimonial, deleteTestimonial } from '../../services/firestoreService';

export default function TestimonialsManager() {
  const { testimonials, loading } = useTestimonialsData();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', service: '', quote: '', rating: 5 });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const showMsg = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) return;
    setBusy(true);
    setError('');
    try {
      await addTestimonial({ ...form, order: testimonials.length });
      setForm({ name: '', service: '', quote: '', rating: 5 });
      showMsg('Testimonial added — live on website');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (id) => {
    setBusy(true);
    try {
      await updateTestimonial(id, form);
      setEditingId(null);
      showMsg('Testimonial updated');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete testimonial from ${name}?`)) return;
    setBusy(true);
    try {
      await deleteTestimonial(id);
      showMsg('Testimonial deleted');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({ name: t.name, service: t.service, quote: t.quote, rating: t.rating || 5 });
  };

  if (loading) return <p className="admin-empty">Loading testimonials...</p>;

  return (
    <div className="admin-panel">
      {message && <div className="admin-alert admin-alert--success">{message}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <form className="admin-form admin-form--inline" onSubmit={handleAdd}>
        <h3>Add Testimonial</h3>
        <div className="admin-form__row">
          <input placeholder="Client name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
          <input placeholder="Quote" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required />
          <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>Add</button>
        </div>
      </form>

      <div className="admin-testimonials">
        {testimonials.map((t) => (
          <div key={t.id} className="admin-card admin-testimonial-card">
            {editingId === t.id ? (
              <div className="admin-form-grid">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
                <textarea rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="admin-form-grid--full" />
                <div className="admin-table__actions">
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--primary" onClick={() => handleUpdate(t.id)} disabled={busy}>Save</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p className="admin-testimonial-card__quote">&ldquo;{t.quote}&rdquo;</p>
                <p><strong>{t.name}</strong> — {t.service}</p>
                <div className="admin-table__actions">
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--secondary" onClick={() => startEdit(t)}>Edit</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(t.id, t.name)} disabled={busy}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
