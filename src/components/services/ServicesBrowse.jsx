import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServicesData } from '../../hooks/useServicesData';
import { enrichServiceCategories, CATEGORY_NAV } from '../../data/serviceCatalog';
import { staggerContainer } from '../../utils/animations';
import ServiceCategoryNav from './ServiceCategoryNav';
import ServiceCard from './ServiceCard';
import './ServicesBrowse.css';

const DEFAULT_CATEGORY = 'hair';

/** Premium services page — category tabs + portfolio cards with direct booking */
export default function ServicesBrowse() {
  const { categories, loading } = useServicesData();
  const enriched = useMemo(() => enrichServiceCategories(categories), [categories]);

  const orderedCategories = useMemo(() => {
    const order = CATEGORY_NAV.map((n) => n.id);
    return [...enriched].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }, [enriched]);

  const [activeCategoryId, setActiveCategoryId] = useState(DEFAULT_CATEGORY);
  const activeCategory = orderedCategories.find((c) => c.id === activeCategoryId)
    || orderedCategories[0];

  if (loading) {
    return (
      <section className="services-browse section section--compact">
        <div className="container">
          <p className="services-browse__loading">Loading our service menu…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="services-browse section section--compact">
      <div className="container">
        <div className="services-browse__intro">
          <p className="services-browse__eyebrow">Our Menu</p>
          <h2 className="services-browse__heading">Signature Treatments</h2>
          <p className="services-browse__subheading">
            Browse by category and book your appointment in one step.
          </p>
        </div>

        <ServiceCategoryNav
          categories={orderedCategories}
          activeId={activeCategory?.id}
          onChange={setActiveCategoryId}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory?.id}
            className="services-browse__panel"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {activeCategory && (
              <>
                <header className="services-browse__category-header">
                  <h3 className="services-browse__category-title">
                    {activeCategory.navLabel || activeCategory.title}
                  </h3>
                  {activeCategory.tagline && (
                    <p className="services-browse__category-tagline">
                      {activeCategory.tagline}
                    </p>
                  )}
                </header>

                <motion.div
                  className="services-browse__grid"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {(activeCategory.services || []).map((service) => (
                    <ServiceCard
                      key={service.value || service.name}
                      service={service}
                      categoryLabel={activeCategory.navLabel}
                    />
                  ))}
                </motion.div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
