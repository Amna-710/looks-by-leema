import { useNavigate } from 'react-router-dom';
import { buildBookingPath } from '../../utils/bookingNavigation';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';
import LightboxImage from '../LightboxImage';
import './ServicesBrowse.css';

/** Reusable portfolio-style service card — image, name, price, book action */
export default function ServiceCard({ service, categoryLabel }) {
  const navigate = useNavigate();

  const handleBook = () => {
    if (!service?.value) return;
    navigate(buildBookingPath(service.value), {
      state: { service: service.value },
    });
  };

  return (
    <motion.article className="service-portfolio-card" variants={fadeInUp}>
      <div className="service-portfolio-card__media">
        <LightboxImage
          src={service.image}
          alt={service.name}
          className="service-portfolio-card__image"
          loading="lazy"
        />
      </div>

      <div className="service-portfolio-card__body">
        {categoryLabel && (
          <span className="service-portfolio-card__category">{categoryLabel}</span>
        )}
        <h3 className="service-portfolio-card__name">{service.name}</h3>
        <p className="service-portfolio-card__price">{service.price}</p>
        {service.description && (
          <p className="service-portfolio-card__description">{service.description}</p>
        )}
        <button
          type="button"
          className="btn btn--primary service-portfolio-card__book"
          onClick={handleBook}
        >
          Book Appointment
        </button>
      </div>
    </motion.article>
  );
}
