import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';
import './NailsExperience.css';

/** Unique luxury nails page content — Nails route only (below hero) */
export default function NailsExperience({ services, gallery }) {
  if (!services?.length) return null;

  return (
    <div className="nails-exp">
      <section className="nails-intro section">
        <div className="container">
          <motion.div
            className="nails-intro__inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeInUp}
          >
            <span className="nails-intro__eyebrow">Nail Studio</span>
            <h2 className="nails-intro__title">Artistry at your fingertips</h2>
            <p className="nails-intro__text">
              From soft glam gels to statement acrylics and custom nail art — every set is crafted with
              precision, polish, and a touch of luxury.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="nails-services section section--alt">
        <div className="container">
          <div className="nails-services__list">
            {services.map((item, index) => {
              const reverse = index % 2 === 1;
              return (
                <motion.article
                  key={item.id}
                  className={`nails-service${reverse ? ' nails-service--reverse' : ''}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeInUp}
                  transition={{ delay: 0.05 }}
                >
                  <div className="nails-service__media">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="nails-service__index">0{index + 1}</span>
                  </div>
                  <div className="nails-service__content">
                    <span className="nails-service__label">{item.label}</span>
                    <h3 className="nails-service__name">{item.name}</h3>
                    <p className="nails-service__desc">{item.description}</p>
                    <ul className="nails-service__benefits">
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

      {gallery?.length > 0 && (
        <section className="nails-mosaic section">
          <div className="container">
            <motion.div
              className="nails-mosaic__header"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <span className="nails-intro__eyebrow">Inspiration</span>
              <h2 className="nails-intro__title">A glimpse of our nail looks</h2>
            </motion.div>
            <div className="nails-mosaic__grid">
              {gallery.map((src, index) => (
                <motion.div
                  key={`${src}-${index}`}
                  className={`nails-mosaic__item nails-mosaic__item--${index + 1}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.08 }}
                >
                  <img src={src} alt={`Nail look ${index + 1}`} loading="lazy" decoding="async" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
