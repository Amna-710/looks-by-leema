import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';
import './FacialTreatments.css';

/** Premium facial treatment cards — Facials page only (below hero) */
export default function FacialTreatments({ treatments }) {
  if (!treatments?.length) return null;

  return (
    <>
      <section className="facial-treatments section">
        <div className="container">
          <motion.div
            className="facial-treatments__header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeInUp}
          >
            <span className="facial-treatments__eyebrow">Our Facial Menu</span>
            <h2 className="facial-treatments__title">Signature Facial Treatments</h2>
            <p className="facial-treatments__subtitle">
              Each ritual is customized for your skin — from hydration and clarity to a youthful, luminous glow.
            </p>
          </motion.div>

          <div className="facial-treatments__grid">
            {treatments.map((treatment, index) => (
              <motion.article
                key={treatment.id}
                className="facial-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className="facial-card__media">
                  <img
                    src={treatment.image}
                    alt={treatment.name}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="facial-card__body">
                  <h3 className="facial-card__name">{treatment.name}</h3>
                  <p className="facial-card__desc">{treatment.description}</p>
                  <ul className="facial-card__benefits">
                    {treatment.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                  <Link to="/booking" className="btn btn--primary btn--sm facial-card__btn">
                    Book This Facial
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
