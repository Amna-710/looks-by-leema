import { motion } from 'framer-motion';
import BookServiceLink from './BookServiceLink';
import { fadeInUp } from '../utils/animations';
import LightboxImage from './LightboxImage';
import './LashesExperience.css';

/** Luxury lash studio layout — Lashes route only (below hero) */
export default function LashesExperience({ services }) {
  if (!services?.length) return null;

  const [featured, ...rest] = services;

  return (
    <div className="lash-exp">
      <section className="lash-intro section">
        <div className="container">
          <motion.div
            className="lash-intro__inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeInUp}
          >
            <span className="lash-intro__eyebrow">Lash Studio</span>
            <h2 className="lash-intro__title">Eyes that speak luxury</h2>
            <p className="lash-intro__text">
              From soft classic sets to dramatic volume — every lash look is customized for your eye shape,
              lifestyle, and the glam you love.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="lash-studio section section--alt">
        <div className="container">
          {featured && (
            <motion.article
              className="lash-feature"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInUp}
            >
              <div className="lash-feature__media">
                <LightboxImage
                  src={featured.image}
                  alt={featured.title}
                  loading="lazy"
                  decoding="async"
                />
                <div className="lash-feature__shade" />
                <div className="lash-feature__copy">
                  <span className="lash-feature__label">{featured.label}</span>
                  <h3 className="lash-feature__title">{featured.title}</h3>
                  <p className="lash-feature__desc">{featured.description}</p>
                  <BookServiceLink
                    serviceValue={featured.bookingService}
                    className="btn btn--primary btn--sm"
                  >
                    Book Lashes
                  </BookServiceLink>
                </div>
              </div>
            </motion.article>
          )}

          <div className="lash-grid">
            {rest.map((item, index) => (
              <motion.article
                key={item.id}
                className={`lash-card lash-card--${(index % 4) + 1}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeInUp}
                transition={{ delay: (index % 4) * 0.08 }}
              >
                <div className="lash-card__media">
                  <LightboxImage
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    images={rest.map((entry) => entry.image)}
                    index={index}
                  />
                  <div className="lash-card__shade" />
                  <div className="lash-card__overlay">
                    <span className="lash-card__label">{item.label}</span>
                    <h3 className="lash-card__title">{item.title}</h3>
                  </div>
                </div>
                <p className="lash-card__desc">{item.description}</p>
                <BookServiceLink
                  serviceValue={item.bookingService}
                  className="lash-card__link"
                >
                  Book this look →
                </BookServiceLink>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
