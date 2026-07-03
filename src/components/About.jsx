import { motion } from 'framer-motion';
import { useSiteSettings } from '../hooks/useSiteSettings';
import WhyChooseUs from './WhyChooseUs';
import { fadeInUp } from '../utils/animations';
import './About.css';

/** About page content loaded from Firebase */
export default function About() {
  const { settings } = useSiteSettings();
  const { about } = settings;

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
              <img src={about.imageUrl} alt="LooksByLeema Beauty Studio interior" />
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
                {(about.tags || []).map((tag) => (
                  <span key={tag} className="about__tag">{tag}</span>
                ))}
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
              <img
                src={about.founderImageUrl}
                alt={`${about.founderName}, founder of LooksByLeema Beauty Studio`}
              />
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
