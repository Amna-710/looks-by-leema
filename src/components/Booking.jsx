import { useState } from 'react';
import { motion } from 'framer-motion';
import { useServicesData } from '../hooks/useServicesData';
import { createBooking } from '../services/firestoreService';
import { isFirebaseConfigured, isRtdbConfigured } from '../firebase/config';
import { fadeInUp } from '../utils/animations';
import './Booking.css';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  service: '',
  date: '',
  time: '',
  message: '',
};

function validateForm(data) {
  const errors = {};

  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  const phoneRegex = /^[\d\s\-().+]{10,}$/;
  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!data.service) {
    errors.service = 'Please select a service';
  }

  if (!data.date) {
    errors.date = 'Please select a date';
  } else {
    const selected = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      errors.date = 'Date must be in the future';
    }
  }

  if (!data.time) {
    errors.time = 'Please select a time';
  }

  return errors;
}

/** Booking form — saves submissions to Firestore */
export default function Booking() {
  const { flatServices } = useServicesData();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!isFirebaseConfigured() || !isRtdbConfigured()) {
      setSubmitError('Online booking is temporarily unavailable. Please call us to book.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const selectedService = flatServices.find((s) => s.value === form.service);
      await createBooking({
        ...form,
        serviceLabel: selectedService?.label || form.service,
      });
      setSubmitted(true);
      setForm(initialForm);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="booking section section--compact">
      <div className="container">
        <motion.div
          className="booking__wrapper"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
        >
          <form className="booking__form" onSubmit={handleSubmit} noValidate>
            <div className="booking__row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={errors.fullName ? 'form-input--error' : ''}
                />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={errors.email ? 'form-input--error' : ''}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>

            <div className="booking__row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className={errors.phone ? 'form-input--error' : ''}
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="service">Service *</label>
                <select
                  id="service"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className={errors.service ? 'form-input--error' : ''}
                >
                  <option value="">Select a service</option>
                  {flatServices.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label} — {s.price}
                    </option>
                  ))}
                </select>
                {errors.service && <span className="form-error">{errors.service}</span>}
              </div>
            </div>

            <div className="booking__row">
              <div className="form-group">
                <label htmlFor="date">Preferred Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={today}
                  className={errors.date ? 'form-input--error' : ''}
                />
                {errors.date && <span className="form-error">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="time">Preferred Time *</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className={errors.time ? 'form-input--error' : ''}
                />
                {errors.time && <span className="form-error">{errors.time}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Any special requests or notes..."
              />
            </div>

            <p className="booking__notice">
              <strong>$10 non-refundable deposit required.</strong>
            </p>

            {submitError && <p className="form-error booking__submit-error">{submitError}</p>}

            <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
              {submitting ? 'Submitting...' : submitted ? 'Request Sent ✓' : 'Submit Booking Request'}
            </button>

            {submitted && (
              <motion.p
                className="booking__success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Thank you! We&apos;ll contact you shortly to confirm your appointment and deposit.
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
