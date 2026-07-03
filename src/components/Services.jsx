import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useServicesData } from '../hooks/useServicesData';
import { staggerContainer, fadeInUp } from '../utils/animations';
import './Services.css';

/** Categorized service cards with prices from Firestore */
export default function Services() {
  const { categories, loading } = useServicesData();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered =
    activeCategory === 'all'
      ? categories
      : categories.filter((c) => c.id === activeCategory);

  if (loading) {
    return (
      <section className="services section section--compact">
        <div className="container">
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading services...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="services section section--compact">
      <div className="container">
        <div className="services__tabs">
          <button
            type="button"
            className={`services__tab ${activeCategory === 'all' ? 'services__tab--active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`services__tab ${activeCategory === cat.id ? 'services__tab--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.title.split(' ')[0]}
            </button>
          ))}
        </div>

        <motion.div
          className="services__grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          key={activeCategory}
        >
          {filtered.map((category) => (
            <motion.div
              key={category.id}
              className="service-category"
              variants={fadeInUp}
            >
              <h3 className="service-category__title">
                <span className="service-category__icon">{category.icon}</span>
                {category.title}
              </h3>
              <div className="service-category__list">
                {(category.services || []).map((service) => (
                  <div key={service.id || service.name} className="service-card">
                    <span className="service-card__name">{service.name}</span>
                    <span className="service-card__price">{service.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="services__cta">
          <Link to="/booking" className="btn btn--primary">
            Book Your Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
