import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';
import LightboxImage from './LightboxImage';
import './HairExperience.css';

/** Hairstyle services + lookbook — Hair route only (below hero) */
export default function HairExperience({ services, lookbook }) {
  if (!services?.length) return null;

  const lookbookImages = lookbook?.map((style) => style.image) || [];

  return (
    <div className="hair-exp">
      <section className="hair-intro section">
        <div className="container">
          <motion.div
            className="hair-intro__inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeInUp}
          >
            <span className="hair-intro__eyebrow">Hair Studio</span>
            <h2 className="hair-intro__title">Styles crafted for you</h2>
            <p className="hair-intro__text">
              From precision cuts to silky treatments — every service is designed to leave your hair
              polished, healthy, and beautifully finished.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="hair-services section section--alt">
        <div className="container">
          <div className="hair-services__list">
            {services.map((item, index) => {
              const reverse = index % 2 === 1;
              return (
                <motion.article
                  key={item.id}
                  className={`hair-service${reverse ? ' hair-service--reverse' : ''}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeInUp}
                  transition={{ delay: 0.05 }}
                >
                  <div className="hair-service__media">
                    <LightboxImage
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="hair-service__index">0{index + 1}</span>
                  </div>
                  <div className="hair-service__content">
                    <span className="hair-service__label">{item.label}</span>
                    <h3 className="hair-service__name">{item.name}</h3>
                    <p className="hair-service__desc">{item.description}</p>
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

      {lookbook?.length > 0 && (
        <section className="hair-lookbook section">
          <div className="container">
            <motion.div
              className="hair-lookbook__header"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeInUp}
            >
              <span className="hair-intro__eyebrow">Style Booklet</span>
              <h2 className="hair-intro__title">Hairstyle Lookbook</h2>
              <p className="hair-intro__text">
                Browse our curated collection of signature looks — bridal elegance, party glam,
                soft waves, and more inspiration for your next visit.
              </p>
            </motion.div>

            <div className="hair-lookbook__spread">
              {lookbook.map((style, index) => (
                <motion.article
                  key={style.id}
                  className={`hair-lookbook__page hair-lookbook__page--${(index % 3) + 1}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeInUp}
                  transition={{ delay: (index % 3) * 0.08 }}
                >
                  <div className="hair-lookbook__frame">
                    <div className="hair-lookbook__preview-btn">
                      <LightboxImage
                        src={style.image}
                        alt={style.title}
                        images={lookbookImages}
                        index={index}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="hair-lookbook__zoom" aria-hidden="true">
                        View
                      </span>
                    </div>
                    <div className="hair-lookbook__caption">
                      <span className="hair-lookbook__num">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="hair-lookbook__name">{style.title}</h3>
                      <p className="hair-lookbook__desc">{style.description}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <motion.div
              className="hair-lookbook__cta"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <p>Love a look? Book your styling appointment and we&apos;ll bring it to life.</p>
              <Link to="/booking" className="btn btn--primary">
                Book Hair Styling
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
