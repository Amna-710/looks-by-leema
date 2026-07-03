import { useState } from 'react';
import { usePoliciesData } from '../../hooks/usePoliciesData';
import { savePolicies } from '../../services/firestoreService';

export default function PoliciesManager() {
  const { policies, loading } = usePoliciesData();
  const [localPolicies, setLocalPolicies] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const data = localPolicies ?? policies;

  const updatePolicy = (index, field, value) => {
    const updated = data.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    setLocalPolicies(updated);
  };

  const updatePolicyItem = (policyIndex, itemIndex, value) => {
    const updated = data.map((p, i) => {
      if (i !== policyIndex) return p;
      const items = [...p.items];
      items[itemIndex] = value;
      return { ...p, items };
    });
    setLocalPolicies(updated);
  };

  const addPolicyItem = (policyIndex) => {
    const updated = data.map((p, i) => {
      if (i !== policyIndex) return p;
      return { ...p, items: [...p.items, 'New policy item'] };
    });
    setLocalPolicies(updated);
  };

  const removePolicyItem = (policyIndex, itemIndex) => {
    const updated = data.map((p, i) => {
      if (i !== policyIndex) return p;
      return { ...p, items: p.items.filter((_, j) => j !== itemIndex) };
    });
    setLocalPolicies(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await savePolicies(data);
      setLocalPolicies(null);
      setMessage('Policies saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="admin-empty">Loading policies...</p>;

  return (
    <div className="admin-panel">
      {message && <div className="admin-alert admin-alert--success">{message}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-policies">
        {data.map((policy, pIndex) => (
          <div key={policy.title} className="admin-policy-card">
            <div className="admin-policy-card__header">
              <input
                type="text"
                className="admin-policy-card__title-input"
                value={policy.title}
                onChange={(e) => updatePolicy(pIndex, 'title', e.target.value)}
              />
              <input
                type="text"
                className="admin-policy-card__icon-input"
                value={policy.icon}
                onChange={(e) => updatePolicy(pIndex, 'icon', e.target.value)}
                title="Icon"
              />
            </div>
            <ul className="admin-policy-card__items">
              {policy.items.map((item, iIndex) => (
                <li key={`${pIndex}-${iIndex}`}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updatePolicyItem(pIndex, iIndex, e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn--sm admin-btn--danger"
                    onClick={() => removePolicyItem(pIndex, iIndex)}
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="admin-btn admin-btn--sm admin-btn--secondary"
              onClick={() => addPolicyItem(pIndex)}
            >
              + Add Item
            </button>
          </div>
        ))}
      </div>

      <div className="admin-form__actions">
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={handleSave}
          disabled={saving || !localPolicies}
        >
          {saving ? 'Saving...' : 'Save All Policies'}
        </button>
        {localPolicies && (
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => setLocalPolicies(null)}
          >
            Discard Changes
          </button>
        )}
      </div>
    </div>
  );
}
