import { useState, useEffect, useRef } from 'react';
import { useServicesData } from '../../hooks/useServicesData';
import { addService, updateService, deleteService } from '../../services/firestoreService';

export default function ServicesManager() {
  const { categories, loading, isLive, isEmpty, firestoreError, ensureInFirestore } =
    useServicesData();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const seedAttempted = useRef(false);

  const activeCategoryId = selectedCategory || categories[0]?.id || '';
  const category = categories.find((c) => c.id === activeCategoryId);
  const canWrite = isLive && !busy;

  // Seed default services if Firestore collection is empty
  useEffect(() => {
    if (loading || seedAttempted.current) return;
    if (isLive && !isEmpty) return;

    let cancelled = false;
    seedAttempted.current = true;

    ensureInFirestore()
      .then((created) => {
        if (cancelled) return;
        if (created) setMessage('Services synced to Firestore');
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
        seedAttempted.current = false;
      });

    return () => {
      cancelled = true;
    };
  }, [loading, isLive, isEmpty, ensureInFirestore]);

  const showMsg = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRetry = async () => {
    setError('');
    seedAttempted.current = false;
    try {
      const created = await ensureInFirestore();
      if (created) setMessage('Services synced to Firestore');
      else setMessage('Connected to Firestore');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!canWrite || !category || !newName.trim() || !newPrice.trim()) return;
    setBusy(true);
    setError('');
    try {
      await addService(category, newName.trim(), newPrice.trim());
      setNewName('');
      setNewPrice('');
      showMsg('Service added successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (service) => {
    setEditingId(service.id);
    setEditName(service.name);
    setEditPrice(service.price);
  };

  const handleSaveEdit = async (serviceId) => {
    if (!canWrite || !category) return;
    setBusy(true);
    setError('');
    try {
      await updateService(category, serviceId, {
        name: editName.trim(),
        price: editPrice.trim(),
      });
      setEditingId(null);
      showMsg('Service updated');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (serviceId, serviceName) => {
    if (!canWrite || !category || !window.confirm(`Delete "${serviceName}"?`)) return;
    setBusy(true);
    setError('');
    try {
      await deleteService(category, serviceId);
      showMsg('Service deleted');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <p className="admin-empty">Loading services from Firestore...</p>;
  }

  return (
    <div className="admin-panel">
      {message && <div className="admin-alert admin-alert--success">{message}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      {!isLive && (
        <div className="admin-alert admin-alert--error">
          <p>
            <strong>Firestore not connected.</strong>{' '}
            {firestoreError || 'Enable Firestore Database in Firebase Console and deploy security rules.'}
          </p>
          <button type="button" className="admin-btn admin-btn--secondary" onClick={handleRetry} style={{ marginTop: '0.75rem' }}>
            Retry Connection
          </button>
        </div>
      )}

      <div className="admin-toolbar">
        <label>
          Category
          <select
            value={activeCategoryId}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.title}</option>
            ))}
          </select>
        </label>
        {isLive && <span className="admin-muted" style={{ alignSelf: 'flex-end' }}>● Live sync</span>}
      </div>

      <form className="admin-form admin-form--inline" onSubmit={handleAdd}>
        <h3>Add New Service</h3>
        <div className="admin-form__row">
          <input
            type="text"
            placeholder="Service name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            disabled={!canWrite}
          />
          <input
            type="text"
            placeholder="Price (e.g. $35)"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            required
            disabled={!canWrite}
          />
          <button type="submit" className="admin-btn admin-btn--primary" disabled={!canWrite}>
            Add Service
          </button>
        </div>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(category?.services || []).map((service) => (
              <tr key={service.id || service.name}>
                <td>
                  {editingId === service.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    service.name
                  )}
                </td>
                <td>
                  {editingId === service.id ? (
                    <input
                      type="text"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  ) : (
                    service.price
                  )}
                </td>
                <td className="admin-table__actions">
                  {editingId === service.id ? (
                    <>
                      <button type="button" className="admin-btn admin-btn--sm admin-btn--primary" onClick={() => handleSaveEdit(service.id)} disabled={!canWrite}>Save</button>
                      <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="admin-btn admin-btn--sm admin-btn--secondary" onClick={() => startEdit(service)} disabled={!canWrite}>Edit</button>
                      <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(service.id, service.name)} disabled={!canWrite}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
