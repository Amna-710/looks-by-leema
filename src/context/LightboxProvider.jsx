import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import '../components/ImageLightbox.css';

const LightboxContext = createContext(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) {
    throw new Error('useLightbox must be used within LightboxProvider');
  }
  return ctx;
}

/** Global image lightbox — single reusable viewer for content images */
export function LightboxProvider({ children }) {
  const [state, setState] = useState(null);

  const openLightbox = useCallback(({ src, alt = '', images, index = 0 }) => {
    if (!src) return;
    const list = images?.length ? images : [src];
    const safeIndex = Math.min(Math.max(index, 0), list.length - 1);
    setState({ src: list[safeIndex], alt, images: list, index: safeIndex });
  }, []);

  const closeLightbox = useCallback(() => setState(null), []);

  const goPrev = useCallback(() => {
    setState((prev) => {
      if (!prev?.images?.length) return prev;
      const nextIndex = (prev.index - 1 + prev.images.length) % prev.images.length;
      return {
        ...prev,
        index: nextIndex,
        src: prev.images[nextIndex],
      };
    });
  }, []);

  const goNext = useCallback(() => {
    setState((prev) => {
      if (!prev?.images?.length) return prev;
      const nextIndex = (prev.index + 1) % prev.images.length;
      return {
        ...prev,
        index: nextIndex,
        src: prev.images[nextIndex],
      };
    });
  }, []);

  useEffect(() => {
    if (!state) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && state.images.length > 1) goPrev();
      if (e.key === 'ArrowRight' && state.images.length > 1) goNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [state, closeLightbox, goPrev, goNext]);

  const hasGallery = state?.images?.length > 1;

  return (
    <LightboxContext.Provider value={{ openLightbox, closeLightbox }}>
      {children}

      <AnimatePresence>
        {state && (
          <motion.div
            className="image-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={state.alt || 'Image preview'}
          >
            <button
              type="button"
              className="image-lightbox__close"
              onClick={closeLightbox}
              aria-label="Close"
            >
              ×
            </button>

            {hasGallery && (
              <button
                type="button"
                className="image-lightbox__nav image-lightbox__nav--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}

            <motion.img
              key={state.src}
              src={state.src}
              alt={state.alt}
              className="image-lightbox__img"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            />

            {hasGallery && (
              <button
                type="button"
                className="image-lightbox__nav image-lightbox__nav--next"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next image"
              >
                ›
              </button>
            )}

            {hasGallery && (
              <p className="image-lightbox__counter">
                {state.index + 1} / {state.images.length}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}
