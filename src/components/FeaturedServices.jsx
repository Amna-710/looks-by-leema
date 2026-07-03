import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { useServicesData } from '../hooks/useServicesData';
import { staggerContainer, fadeInUp } from '../utils/animations';
import './FeaturedServices.css';

/** Preview of popular services on the home page */
export default function FeaturedServices() {
  const { categories, loading } = useServicesData();

  const featured = categories.map((cat) => ({
    ...cat,
    services: (cat.services || []).slice(0, 3),
  }));

  if (loading) return null;

  return (
    <section className="featured section section--alt">
      <div className="container">
        <SectionHeader
          eyebrow="What We Offer"
          title="Featured Services"
          description="A glimpse of our most-loved treatments. View our full menu for complete pricing."
        />

        <motion.div
          className="featured__grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {featured.map((category) => (
            <motion.div key={category.id} className="featured__card" variants={fadeInUp}>
              <h3 className="featured__title">
                <span className="featured__icon">{category.icon}</span>
                {category.title}
              </h3>
              <ul className="featured__list">
                {category.services.map((service) => (
                  <li key={service.id || service.name}>
                    <span>{service.name}</span>
                    <span>{service.price}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <div className="featured__cta">
          <Link to="/services" className="btn btn--primary">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
