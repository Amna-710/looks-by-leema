import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';
import HeroVideoSlideshow, { VideoSlideshowDots } from './HeroVideoSlideshow';
import {
  SERVICES_HERO_SLIDE_FADE_MS,
  SERVICES_HERO_SLIDE_INTERVAL_MS,
  SERVICES_HERO_VIDEOS,
} from '../data/servicesHeroVideos';
import './PageBanner.css';

/** Compact page header for inner routes */
export default function PageBanner({
  eyebrow,
  title,
  description,
  backgroundImage,
  heroImage,
  heroImageClassName,
  videos,
  slideIntervalMs,
  fadeMs,
}) {
  const isBookingBanner = Boolean(backgroundImage);
  const isHeroImageBanner = Boolean(heroImage);
  const isVideoBanner = Boolean(videos?.length);
  const slideshowRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const bannerClass = [
    'page-banner',
    isBookingBanner && 'page-banner--booking',
    isHeroImageBanner && 'page-banner--hero-image',
    isHeroImageBanner && heroImageClassName,
    isVideoBanner && 'page-banner--video',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={bannerClass}>
      {isVideoBanner && (
        <div className="page-banner__media page-banner__media--video" aria-hidden="true">
          <HeroVideoSlideshow
            ref={slideshowRef}
            active={activeSlide}
            onActiveChange={setActiveSlide}
            videos={videos}
            slideIntervalMs={slideIntervalMs}
            fadeMs={fadeMs}
          />
        </div>
      )}

      {isHeroImageBanner && (
        <div className="page-banner__media page-banner__media--cover" aria-hidden="true">
          <img src={heroImage} alt="" loading="eager" decoding="async" fetchPriority="high" />
        </div>
      )}

      {isBookingBanner && (
        <div className="page-banner__media" aria-hidden="true">
          <img src={backgroundImage} alt="" loading="eager" decoding="async" />
        </div>
      )}

      <div className="page-banner__overlay" />

      {isVideoBanner && (
        <VideoSlideshowDots
          videos={videos}
          active={activeSlide}
          className="hero-video-slideshow__dots--banner"
          onSelect={(index) => {
            slideshowRef.current?.goTo(index);
            slideshowRef.current?.restartTimer();
          }}
        />
      )}

      <motion.div
        className="page-banner__content container"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        {eyebrow && <span className="page-banner__eyebrow">{eyebrow}</span>}
        <h1 className="page-banner__title">{title}</h1>
        {description && <p className="page-banner__desc">{description}</p>}
      </motion.div>
    </section>
  );
}

/** Services page banner with dedicated video slideshow */
export function ServicesPageBanner(props) {
  return (
    <PageBanner
      {...props}
      videos={SERVICES_HERO_VIDEOS}
      slideIntervalMs={SERVICES_HERO_SLIDE_INTERVAL_MS}
      fadeMs={SERVICES_HERO_SLIDE_FADE_MS}
    />
  );
}

const ABOUT_HERO_IMAGE = '/images/about-hero.jpg';

/** About page banner with full-cover hero image */
export function AboutPageBanner(props) {
  return <PageBanner {...props} heroImage={ABOUT_HERO_IMAGE} />;
}

const POLICIES_HERO_IMAGE = '/images/policies-hero.jpg';

/** Policies page banner with full-cover hero image */
export function PoliciesPageBanner(props) {
  return (
    <PageBanner
      {...props}
      heroImage={POLICIES_HERO_IMAGE}
      heroImageClassName="page-banner--hero-image-policies"
    />
  );
}
