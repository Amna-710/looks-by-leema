import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { useTestimonialsData } from '../hooks/useTestimonialsData';
import { staggerContainer, fadeInUp } from '../utils/animations';
import './Testimonials.css';

/** Client testimonials — live from Firebase */
export default function Testimonials() {
  const { testimonials, loading } = useTestimonialsData();

  if (loading) return null;

  return (
    <section className="testimonials section">
      <div className="container">
        <SectionHeader
          eyebrow="Client Love"
          title="What Our Clients Say"
          description="Real experiences from the LooksByLeema family."
        />

        <motion.div
          className="testimonials__grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {testimonials.map((item) => (
            <motion.blockquote key={item.id || item.name} className="testimonial-card" variants={fadeInUp}>
              <div className="testimonial-card__stars" aria-label={`${item.rating} out of 5 stars`}>
                {'★'.repeat(item.rating || 5)}
              </div>
              <p className="testimonial-card__quote">&ldquo;{item.quote}&rdquo;</p>
              <footer>
                <cite className="testimonial-card__name">{item.name}</cite>
                <span className="testimonial-card__service">{item.service}</span>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
