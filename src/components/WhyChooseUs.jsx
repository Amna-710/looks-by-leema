import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { staggerContainer, fadeInUp } from '../utils/animations';
import './WhyChooseUs.css';

const features = [
  'Clean, cozy, and welcoming studio',
  'Personalized beauty services',
  'Premium quality products',
  'Affordable luxury',
  'Calm and private environment',
];

/** Feature cards highlighting why clients love the studio */
export default function WhyChooseUs() {
  return (
    <section className="why section section--alt">
      <div className="container">
        <SectionHeader
          eyebrow="The Experience"
          title="Why Clients Love Us"
          description="Every visit is designed to feel personal, peaceful, and luxurious."
        />

        <motion.div
          className="why__grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {features.map((feature) => (
            <motion.div key={feature} className="why__card" variants={fadeInUp}>
              <span className="why__check" aria-hidden="true">✓</span>
              <p>{feature}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
