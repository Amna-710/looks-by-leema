import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { fadeInUp } from '../utils/animations';
import './Welcome.css';

/** Welcome section — text loaded from Firebase */
export default function Welcome() {
  const { settings } = useSiteSettings();
  const { welcome } = settings;

  return (
    <section className="welcome section">
      <div className="container">
        <motion.div
          className="welcome__inner"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
        >
          <h2 className="welcome__title">{welcome.title}</h2>
          <div className="welcome__divider" />
          <p className="welcome__text">{welcome.text}</p>
          <Link to="/booking" className="btn btn--primary">
            Book Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
