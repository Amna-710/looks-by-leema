import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSiteSettings } from '../hooks/useSiteSettings';
import WhyChooseUs from './WhyChooseUs';
import { TAG_TO_PATH } from '../data/serviceShowcases';
import { fadeInUp } from '../utils/animations';
import './About.css';

const ABOUT_STUDIO_IMAGE = '/images/about-studio.png';

/** About page content loaded from Firebase */
export default function About() {
  const { settings } = useSiteSettings();
  const { about } = settings;
  const [studioImgFailed, setStudioImgFailed] = useState(false);
  const [founderImgFailed, setFounderImgFailed] = useState(false);

  return (
    <>
      <section className="about section section--compact">
        <div className="container">
          <div className="about__grid">
            <motion.div
              className="about__image"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeInUp}
            >
              {!studioImgFailed ? (
                <img
                  src={ABOUT_STUDIO_IMAGE}
                  alt="LooksByLeema Beauty Studio interior"
                  loading="lazy"
                  onError={() => setStudioImgFailed(true)}
                />
              ) : (
                <div className="about__image-fallback" role="img" aria-label="Studio image unavailable">
                  <span>LooksByLeema Studio</span>
                </div>
              )}
            </motion.div>

            <motion.div
              className="about__content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeInUp}
              transition={{ delay: 0.15 }}
            >
              <p className="about__lead">{about.lead}</p>
              <p>{about.body}</p>
              <div className="about__tags">
                {(about.tags || []).map((tag) => {
                  const path = TAG_TO_PATH[tag];
                  if (path) {
                    return (
                      <Link key={tag} to={path} className="about__tag">
                        {tag}
                      </Link>
                    );
                  }
                  return (
                    <span key={tag} className="about__tag">
                      {tag}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="about-founder section section--alt">
        <div className="container">
          <div className="about__grid about__grid--reverse">
            <motion.div
              className="about__content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeInUp}
            >
              <span className="about__eyebrow">Meet the Founder</span>
              <h2 className="about__section-title">{about.founderName}</h2>
              <p>{about.founderBio}</p>
            </motion.div>

            <motion.div
              className="about__image"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeInUp}
              transition={{ delay: 0.15 }}
            >
              {!founderImgFailed && about.founderImageUrl ? (
                <img
                  src={about.founderImageUrl}
                  alt={`${about.founderName}, founder of LooksByLeema Beauty Studio`}
                  loading="lazy"
                  onError={() => setFounderImgFailed(true)}
                />
              ) : (
                <div className="about__image-fallback" role="img" aria-label="Founder image unavailable">
                  <span>{about.founderName || 'Founder'}</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="about-philosophy section">
        <div className="container">
          <div className="about-philosophy__grid">
            <motion.div
              className="about-philosophy__card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeInUp}
            >
              <h2 className="about__section-title">Our Philosophy</h2>
              <p>{about.philosophy}</p>
            </motion.div>

            <motion.div
              className="about-philosophy__card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeInUp}
              transition={{ delay: 0.15 }}
            >
              <h2 className="about__section-title">Our Mission</h2>
              <p>{about.mission}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
    </>
  );
}
