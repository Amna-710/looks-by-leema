import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { fadeInUp } from '../utils/animations';
import HeroVideoSlideshow, { HeroVideoDots } from './HeroVideoSlideshow';
import './Hero.css';

/** Full-screen hero — video slideshow background with content from Firebase */
export default function Hero() {
  const { settings } = useSiteSettings();
  const { hero } = settings;
  const ref = useRef(null);
  const slideshowRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section className="hero" ref={ref}>
      <motion.div className="hero__bg" style={{ y: bgY }}>
        <HeroVideoSlideshow
          ref={slideshowRef}
          active={activeSlide}
          onActiveChange={setActiveSlide}
        />
      </motion.div>
      <div className="hero__overlay" />
      <HeroVideoDots
        active={activeSlide}
        onSelect={(index) => {
          slideshowRef.current?.goTo(index);
          slideshowRef.current?.restartTimer();
        }}
      />

      <motion.div className="hero__content container" style={{ opacity }}>
        <motion.span
          className="hero__eyebrow"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          {hero.location}
        </motion.span>

        <motion.h1
          className="hero__title"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
        >
          {hero.title}
        </motion.h1>

        <motion.p
          className="hero__subtitle"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.p
          className="hero__desc"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.45 }}
        >
          {hero.description}
        </motion.p>

        <motion.div
          className="hero__actions"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <Link to="/booking" className="btn btn--primary">
            Book Appointment
          </Link>
          <Link to="/services" className="btn btn--outline">
            View Services
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
