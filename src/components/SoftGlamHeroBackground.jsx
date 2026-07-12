import { useEffect, useMemo, useState } from 'react';
import './SoftGlamHeroBackground.css';

const FALLBACK = '/images/hero-background.png';

/**
 * Soft Glam only — autoplay CSS fade background slideshow (no Swiper UI).
 * Other service pages keep the existing Swiper hero.
 */
export default function SoftGlamHeroBackground({ images }) {
  const [failed, setFailed] = useState(() => new Set());
  const [active, setActive] = useState(0);

  const slides = useMemo(() => {
    const base = images?.length ? images : [FALLBACK];
    const mapped = base.map((src) => (failed.has(src) ? FALLBACK : src));
    const unique = [...new Set(mapped)];
    return unique.length ? unique : [FALLBACK];
  }, [images, failed]);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="soft-glam-bg" aria-hidden="true">
      {slides.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className={`soft-glam-bg__layer${index === active % slides.length ? ' soft-glam-bg__layer--active' : ''}`}
        >
          <img
            src={src}
            alt=""
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => {
              const original = images?.[index];
              if (!original || original === FALLBACK) return;
              setFailed((prev) => {
                if (prev.has(original)) return prev;
                const next = new Set(prev);
                next.add(original);
                return next;
              });
            }}
          />
        </div>
      ))}
    </div>
  );
}
