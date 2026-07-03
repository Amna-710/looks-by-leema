import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';
import './PageBanner.css';

/** Compact page header for inner routes */
export default function PageBanner({ eyebrow, title, description }) {
  return (
    <section className="page-banner">
      <div className="page-banner__overlay" />
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
