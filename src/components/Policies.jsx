import { motion } from 'framer-motion';
import { usePoliciesData } from '../hooks/usePoliciesData';
import { staggerContainer, fadeInUp } from '../utils/animations';
import './Policies.css';

/** Studio policies loaded from Firestore */
export default function Policies() {
  const { policies, loading } = usePoliciesData();

  if (loading) {
    return (
      <section className="policies section section--compact">
        <div className="container">
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading policies...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="policies section section--compact">
      <div className="container">
        <motion.div
          className="policies__grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {policies.map((policy, index) => (
            <motion.div
              key={policy.title}
              className="policy-card"
              variants={fadeInUp}
            >
              <div className="policy-card__header">
                <span className="policy-card__icon" aria-hidden="true">{policy.icon}</span>
                <span className="policy-card__number">0{index + 1}</span>
              </div>
              <h3 className="policy-card__title">{policy.title}</h3>
              <ul className="policy-card__list">
                {policy.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
