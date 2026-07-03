import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';
import './SectionHeader.css';

/**
 * Reusable section header with eyebrow, title, and optional description.
 */
export default function SectionHeader({ eyebrow, title, description }) {
  return (
    <motion.div
      className="section-header"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeInUp}
    >
      {eyebrow && <span className="section-header__eyebrow">{eyebrow}</span>}
      <h2 className="section-header__title">{title}</h2>
      <div className="section-header__divider" />
      {description && <p className="section-header__desc">{description}</p>}
    </motion.div>
  );
}
