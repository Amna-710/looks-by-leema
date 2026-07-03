import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { useGalleryData } from '../hooks/useGalleryData';
import { staggerContainer, fadeInUp } from '../utils/animations';
import './SalonGallery.css';

/** Salon gallery — displays images uploaded via admin panel */
export default function SalonGallery() {
  const { images, loading } = useGalleryData();

  if (loading || images.length === 0) return null;

  return (
    <section className="salon-gallery section section--alt">
      <div className="container">
        <SectionHeader
          eyebrow="Our Studio"
          title="Salon Gallery"
          description="A peek inside LooksByLeema Beauty Studio."
        />

        <motion.div
          className="salon-gallery__grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {images.map((image) => (
            <motion.div
              key={image.id}
              className="salon-gallery__item"
              variants={fadeInUp}
            >
              <img src={image.url} alt={image.fileName || 'Salon photo'} loading="lazy" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
