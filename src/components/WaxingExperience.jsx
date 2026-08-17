import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';
import LightboxImage from './LightboxImage';
import './WaxingExperience.css';

/** Unique luxury waxing page content — Waxing route only (below hero) */
export default function WaxingExperience({ services }) {
  if (!services?.length) return null;

  return (
    <div className="wax-exp">
      <section className="wax-intro section">
        <div className="container">
          <motion.div
            className="wax-intro__inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeInUp}
          >
            <span className="wax-intro__eyebrow">Smooth Skin Rituals</span>
            <h2 className="wax-intro__title">Luxury waxing, gently done</h2>
            <p className="wax-intro__text">
              Soft, polished skin with a calm, private salon experience — precise technique, clean care,
              and a finish that feels fresh and refined.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="wax-services section section--alt">
        <div className="container">
          <div className="wax-services__list">
            {services.map((item, index) => {
              const reverse = index % 2 === 1;
              return (
                <motion.article
                  key={item.id}
                  className={`wax-service${reverse ? ' wax-service--reverse' : ''}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeInUp}
                  transition={{ delay: 0.05 }}
                >
                  <div className="wax-service__media">
                    <LightboxImage
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="wax-service__index">0{index + 1}</span>
                  </div>
                  <div className="wax-service__content">
                    <span className="wax-service__label">{item.label}</span>
                    <h3 className="wax-service__name">{item.name}</h3>
                    <p className="wax-service__desc">{item.description}</p>
                    <ul className="wax-service__benefits">
                      {item.benefits.map((benefit) => (
                        <li key={benefit}>{benefit}</li>
                      ))}
                    </ul>
                    <Link to="/booking" className="btn btn--primary btn--sm">
                      Book {item.name}
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
