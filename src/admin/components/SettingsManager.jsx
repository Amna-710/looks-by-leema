import { useState } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { saveSiteSettings } from '../../services/firestoreService';

export default function SettingsManager() {
  const { settings, loading } = useSiteSettings();
  const [local, setLocal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const data = local ?? settings;

  const update = (section, field, value) => {
    setLocal({
      ...data,
      [section]: { ...data[section], [field]: value },
    });
  };

  const updateAbout = (field, value) => {
    setLocal({
      ...data,
      about: { ...data.about, [field]: value },
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await saveSiteSettings(data);
      setLocal(null);
      setMessage('Site settings saved — website updated live!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="admin-empty">Loading settings...</p>;

  return (
    <div className="admin-panel">
      {message && <div className="admin-alert admin-alert--success">{message}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-settings">
        <section className="admin-card">
          <h2>Hero Section</h2>
          <div className="admin-form-grid">
            <label>Location<input value={data.hero.location} onChange={(e) => update('hero', 'location', e.target.value)} /></label>
            <label>Title<input value={data.hero.title} onChange={(e) => update('hero', 'title', e.target.value)} /></label>
            <label>Subtitle<input value={data.hero.subtitle} onChange={(e) => update('hero', 'subtitle', e.target.value)} /></label>
            <label className="admin-form-grid--full">Description<textarea rows={2} value={data.hero.description} onChange={(e) => update('hero', 'description', e.target.value)} /></label>
            <label className="admin-form-grid--full">Hero Image URL<input value={data.hero.imageUrl} onChange={(e) => update('hero', 'imageUrl', e.target.value)} /></label>
          </div>
        </section>

        <section className="admin-card">
          <h2>Welcome Section</h2>
          <div className="admin-form-grid">
            <label>Title<input value={data.welcome.title} onChange={(e) => update('welcome', 'title', e.target.value)} /></label>
            <label className="admin-form-grid--full">Text<textarea rows={3} value={data.welcome.text} onChange={(e) => update('welcome', 'text', e.target.value)} /></label>
          </div>
        </section>

        <section className="admin-card">
          <h2>Contact Info</h2>
          <div className="admin-form-grid">
            <label>Location<input value={data.contact.location} onChange={(e) => update('contact', 'location', e.target.value)} /></label>
            <label>Email<input value={data.contact.email} onChange={(e) => update('contact', 'email', e.target.value)} /></label>
            <label>Phone<input value={data.contact.phone} onChange={(e) => update('contact', 'phone', e.target.value)} /></label>
            <label>Instagram URL<input value={data.contact.instagram} onChange={(e) => update('contact', 'instagram', e.target.value)} /></label>
            <label>YouTube URL<input value={data.contact.youtube || ''} onChange={(e) => update('contact', 'youtube', e.target.value)} /></label>
            <label>TikTok URL<input value={data.contact.tiktok} onChange={(e) => update('contact', 'tiktok', e.target.value)} /></label>
          </div>
        </section>

        <section className="admin-card">
          <h2>About Page</h2>
          <div className="admin-form-grid">
            <label className="admin-form-grid--full">Lead Text<textarea rows={2} value={data.about.lead} onChange={(e) => updateAbout('lead', e.target.value)} /></label>
            <label className="admin-form-grid--full">Body<textarea rows={3} value={data.about.body} onChange={(e) => updateAbout('body', e.target.value)} /></label>
            <label>Founder Name<input value={data.about.founderName} onChange={(e) => updateAbout('founderName', e.target.value)} /></label>
            <label className="admin-form-grid--full">Founder Bio<textarea rows={3} value={data.about.founderBio} onChange={(e) => updateAbout('founderBio', e.target.value)} /></label>
            <label className="admin-form-grid--full">About Image URL<input value={data.about.imageUrl} onChange={(e) => updateAbout('imageUrl', e.target.value)} /></label>
            <label className="admin-form-grid--full">Founder Image URL<input value={data.about.founderImageUrl} onChange={(e) => updateAbout('founderImageUrl', e.target.value)} /></label>
            <label className="admin-form-grid--full">Philosophy<textarea rows={2} value={data.about.philosophy} onChange={(e) => updateAbout('philosophy', e.target.value)} /></label>
            <label className="admin-form-grid--full">Mission<textarea rows={2} value={data.about.mission} onChange={(e) => updateAbout('mission', e.target.value)} /></label>
          </div>
        </section>
      </div>

      <div className="admin-form__actions">
        <button type="button" className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving || !local}>
          {saving ? 'Saving...' : 'Save Site Settings'}
        </button>
        {local && (
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setLocal(null)}>
            Discard Changes
          </button>
        )}
      </div>
    </div>
  );
}
