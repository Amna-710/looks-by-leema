import { useLightbox } from '../context/LightboxProvider';
import './ImageLightbox.css';

/**
 * Clickable content image — opens the global lightbox.
 * Pass `images` + `index` for gallery navigation inside the viewer.
 */
export default function LightboxImage({
  src,
  alt = '',
  className = '',
  images,
  index = 0,
  wrapperClassName = '',
  disabled = false,
  ...imgProps
}) {
  const { openLightbox } = useLightbox();

  if (disabled || !src) {
    return <img src={src} alt={alt} className={className} {...imgProps} />;
  }

  const handleOpen = (e) => {
    e.stopPropagation();
    openLightbox({ src, alt, images, index });
  };

  return (
    <button
      type="button"
      className={`lightbox-image-trigger ${wrapperClassName}`.trim()}
      onClick={handleOpen}
      aria-label={`View ${alt || 'image'}`}
    >
      <img src={src} alt={alt} className={className} {...imgProps} />
    </button>
  );
}
