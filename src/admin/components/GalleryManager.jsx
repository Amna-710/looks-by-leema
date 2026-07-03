import { useEffect, useState, useRef } from 'react';
import {
  subscribeGallery,
  uploadSalonImage,
  deleteSalonImage,
  setFeaturedImage,
} from '../../services/firestoreService';

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeGallery((data) => {
      setImages(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setUploading(true);
    setError('');
    try {
      await uploadSalonImage(file);
      if (fileRef.current) fileRef.current.value = '';
      setMessage('Image uploaded — now visible on website gallery');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await deleteSalonImage(image.id, image.storagePath);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSetFeatured = async (field, url) => {
    try {
      await setFeaturedImage(field, url);
      setMessage(`Set as ${field} image — website updated live`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="admin-empty">Loading gallery...</p>;

  return (
    <div className="admin-panel">
      {message && <div className="admin-alert admin-alert--success">{message}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <p className="admin-muted" style={{ marginBottom: '1rem' }}>
        Uploaded images appear on the home page gallery. You can also set any image as the hero or about page photo.
      </p>

      <div className="admin-upload-zone">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          id="gallery-upload"
          className="admin-upload-zone__input"
        />
        <label htmlFor="gallery-upload" className="admin-upload-zone__label">
          {uploading ? (
            <span>Uploading...</span>
          ) : (
            <>
              <span className="admin-upload-zone__icon">+</span>
              <span>Click to upload salon image</span>
              <span className="admin-muted">JPG, PNG, WEBP up to 5MB</span>
            </>
          )}
        </label>
      </div>

      {images.length === 0 ? (
        <p className="admin-empty">No images uploaded yet.</p>
      ) : (
        <div className="admin-gallery">
          {images.map((image) => (
            <div key={image.id} className="admin-gallery__item">
              <img src={image.url} alt={image.fileName || 'Salon'} />
              <div className="admin-gallery__overlay">
                <span className="admin-gallery__name">{image.fileName}</span>
                <div className="admin-gallery__actions">
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--secondary" onClick={() => handleSetFeatured('hero', image.url)}>Hero</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--secondary" onClick={() => handleSetFeatured('about', image.url)}>About</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(image)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
