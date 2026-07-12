import { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { getServiceShowcase } from '../data/serviceShowcases';
import SoftGlamHeroBackground from '../components/SoftGlamHeroBackground';
import { fadeInUp } from '../utils/animations';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import './ServiceShowcase.css';

function shuffleImages(list) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/** Luxury service gallery page — hero slider, masonry gallery, lightbox */
export default function ServiceShowcasePage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '').split('/')[0];
  const service = getServiceShowcase(slug);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const isSoftGlam = slug === 'soft-glam';

  // Soft Glam gallery: mixed random order once per page load
  const [galleryImages] = useState(() => {
    const data = getServiceShowcase(slug);
    if (!data?.gallery) return [];
    return slug === 'soft-glam' ? shuffleImages(data.gallery) : data.gallery;
  });

  const closeLightbox = () => setLightboxIndex(null);

  useEffect(() => {
    if (lightboxIndex === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight' && galleryImages.length) {
        setLightboxIndex((i) => (i + 1) % galleryImages.length);
      }
      if (e.key === 'ArrowLeft' && galleryImages.length) {
        setLightboxIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxIndex, galleryImages]);

  if (!service) {
    return <Navigate to="/about" replace />;
  }

  return (
    <div className="svc-page">
      {/* Hero slideshow */}
      <section className={`svc-hero${isSoftGlam ? ' svc-hero--soft-glam' : ''}`}>
        {isSoftGlam ? (
          <SoftGlamHeroBackground images={service.heroImages} />
        ) : (
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={service.heroImages.length > 1}
            speed={900}
            className="svc-hero__swiper"
          >
            {service.heroImages.map((src) => (
              <SwiperSlide key={src}>
                <div
                  className="svc-hero__slide"
                  style={{ backgroundImage: `url(${src})` }}
                  role="img"
                  aria-label={service.title}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        <div className="svc-hero__overlay" />
        <div className="svc-hero__content container">
          <motion.span
            className="svc-hero__eyebrow"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            {service.eyebrow}
          </motion.span>
          <motion.h1
            className="svc-hero__title"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            {service.title}
          </motion.h1>
          <motion.p
            className="svc-hero__desc"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            {service.description}
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <Link to="/booking" className="btn btn--primary">
              Book Appointment
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="svc-gallery section">
        <div className="container">
          <motion.div
            className="svc-gallery__header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeInUp}
          >
            <span className="svc-gallery__eyebrow">Gallery</span>
            <h2 className="svc-gallery__title">{service.title} Moments</h2>
            <p className="svc-gallery__subtitle">
              Explore looks and details from our {service.title.toLowerCase()} services.
            </p>
          </motion.div>

          <div className={`svc-gallery__grid${isSoftGlam ? ' svc-gallery__grid--soft-glam' : ''}`}>
            {galleryImages.map((src, index) => (
              <motion.button
                type="button"
                key={`${src}-${index}`}
                className={`svc-gallery__item svc-gallery__item--${(index % 6) + 1}`}
                onClick={() => setLightboxIndex(index)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeInUp}
                transition={{ delay: (index % 4) * 0.08 }}
                aria-label={`Open ${service.title} gallery image ${index + 1}`}
              >
                <img
                  src={src}
                  alt={`${service.title} gallery ${index + 1}`}
                  loading="lazy"
                  style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }}
                />
                <span className="svc-gallery__zoom" aria-hidden="true">
                  View
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature sections */}
      {service.sections.map((section, index) => (
        <section
          key={section.title}
          className={`svc-feature section ${index % 2 === 1 ? 'svc-feature--alt' : ''}`}
        >
          <div className="container">
            <div className={`svc-feature__grid ${index % 2 === 1 ? 'svc-feature__grid--reverse' : ''}`}>
              <motion.div
                className="svc-feature__image"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeInUp}
              >
                <img src={section.image} alt={section.title} loading="lazy" />
              </motion.div>
              <motion.div
                className="svc-feature__content"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeInUp}
                transition={{ delay: 0.12 }}
              >
                <h2 className="svc-feature__title">{section.title}</h2>
                <p className="svc-feature__text">{section.text}</p>
                <Link to="/booking" className="btn btn--primary btn--sm">
                  Book Now
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="svc-cta section">
        <div className="container">
          <motion.div
            className="svc-cta__inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2>Ready for your {service.title.toLowerCase()} experience?</h2>
            <p>Book your appointment at LooksByLeema Beauty Studio in Queens, NY.</p>
            <div className="svc-cta__actions">
              <Link to="/booking" className="btn btn--primary">
                Book Appointment
              </Link>
              <Link to="/services" className="btn btn--outline svc-cta__outline">
                All Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="svc-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`${service.title} image gallery`}
          >
            <button type="button" className="svc-lightbox__close" onClick={closeLightbox} aria-label="Close">
              ×
            </button>
            <button
              type="button"
              className="svc-lightbox__nav svc-lightbox__nav--prev"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
              }}
              aria-label="Previous image"
            >
              ‹
            </button>
            <motion.img
              key={galleryImages[lightboxIndex]}
              src={galleryImages[lightboxIndex]}
              alt={`${service.title} ${lightboxIndex + 1}`}
              className="svc-lightbox__img"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className="svc-lightbox__nav svc-lightbox__nav--next"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i + 1) % galleryImages.length);
              }}
              aria-label="Next image"
            >
              ›
            </button>
            <p className="svc-lightbox__counter">
              {lightboxIndex + 1} / {galleryImages.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
