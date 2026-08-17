import { useState, useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useServicesData } from '../hooks/useServicesData';
import { createBooking } from '../services/firestoreService';
import { isFirebaseConfigured, isRtdbConfigured } from '../firebase/config';
import { MIN_BOOKING_MESSAGE, MIN_BOOKING_NOTICE } from '../config/booking';
import {
  ADVANCE_PAYMENT_LABEL,
  ADVANCE_PAYMENT_AMOUNT,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  ZELLE_RECIPIENT,
  ZELLE_SUBMIT_INSTRUCTION,
} from '../config/payment';
import { meetsMinimumBooking } from '../utils/bookingValidation';
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
  paymentMethod: PAYMENT_METHODS.CARD,
};

function getPreselectedService(location, searchParams) {
  return location.state?.service || searchParams.get('service') || '';
}

function validateForm(data, flatServices) {
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
  } else {
    const selected = flatServices.find((s) => s.value === data.service);
    if (selected && !meetsMinimumBooking(selected.price)) {
      errors.service = MIN_BOOKING_MESSAGE;
    }
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

  if (!data.paymentMethod) {
    errors.paymentMethod = 'Please select a payment method';
  }

  return errors;
}

/** Booking form — saves submissions to Firestore */
export default function Booking() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { flatServices } = useServicesData();
  const bookableServices = useMemo(
    () => flatServices.filter((s) => meetsMinimumBooking(s.price)),
    [flatServices]
  );
  const [form, setForm] = useState(() => ({
    ...initialForm,
    service: getPreselectedService(location, searchParams),
  }));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successPaymentMethod, setSuccessPaymentMethod] = useState(null);
  const isZelle = form.paymentMethod === PAYMENT_METHODS.ZELLE;

  useEffect(() => {
    const preselected = getPreselectedService(location, searchParams);
    if (!preselected) return;

    const selected = flatServices.find((s) => s.value === preselected);
    if (selected && meetsMinimumBooking(selected.price)) {
      setForm((prev) => ({ ...prev, service: preselected }));
      setErrors((prev) => ({ ...prev, service: '' }));
    } else if (selected) {
      setForm((prev) => ({ ...prev, service: '' }));
      setErrors((prev) => ({ ...prev, service: MIN_BOOKING_MESSAGE }));
    }
  }, [location, searchParams, flatServices]);

  const handlePaymentMethodChange = (method) => {
    setForm((prev) => ({ ...prev, paymentMethod: method }));
    if (errors.paymentMethod) {
      setErrors((prev) => ({ ...prev, paymentMethod: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form, flatServices);

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
      const isZellePayment = form.paymentMethod === PAYMENT_METHODS.ZELLE;

      await createBooking({
        ...form,
        serviceLabel: selectedService?.label || form.service,
        servicePrice: selectedService?.price,
        paymentMethod: form.paymentMethod,
        paymentStatus: isZellePayment
          ? PAYMENT_STATUS.AWAITING_VERIFICATION
          : PAYMENT_STATUS.NOT_REQUIRED,
        advancePaymentAmount: isZellePayment ? ADVANCE_PAYMENT_AMOUNT : null,
      });
      setSuccessPaymentMethod(form.paymentMethod);
      setSubmitted(true);
      setForm({ ...initialForm, paymentMethod: PAYMENT_METHODS.CARD });
      setTimeout(() => {
        setSubmitted(false);
        setSuccessPaymentMethod(null);
      }, 5000);
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
                  {bookableServices.map((s) => (
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

            <div className="form-group booking__payment">
              <span className="booking__payment-label">Advance Payment *</span>
              <p className="booking__payment-intro">
                A {ADVANCE_PAYMENT_LABEL} advance payment is required to secure your appointment.
              </p>
              <div className="booking__payment-options" role="radiogroup" aria-label="Advance payment method">
                <label
                  className={`booking__payment-option${
                    form.paymentMethod === PAYMENT_METHODS.CARD
                      ? ' booking__payment-option--active'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={PAYMENT_METHODS.CARD}
                    checked={form.paymentMethod === PAYMENT_METHODS.CARD}
                    onChange={() => handlePaymentMethodChange(PAYMENT_METHODS.CARD)}
                  />
                  <span className="booking__payment-option-body">
                    <span className="booking__payment-option-title">Credit/Debit Card</span>
                    <span className="booking__payment-option-desc">
                      Pay the {ADVANCE_PAYMENT_LABEL} advance by card when we confirm your booking.
                    </span>
                  </span>
                </label>

                <label
                  className={`booking__payment-option${
                    form.paymentMethod === PAYMENT_METHODS.ZELLE
                      ? ' booking__payment-option--active'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={PAYMENT_METHODS.ZELLE}
                    checked={form.paymentMethod === PAYMENT_METHODS.ZELLE}
                    onChange={() => handlePaymentMethodChange(PAYMENT_METHODS.ZELLE)}
                  />
                  <span className="booking__payment-option-body">
                    <span className="booking__payment-option-title">Zelle — Advance Payment</span>
                    <span className="booking__payment-option-desc">
                      Send {ADVANCE_PAYMENT_LABEL} via Zelle before your request is verified.
                    </span>
                  </span>
                </label>
              </div>
              {errors.paymentMethod && (
                <span className="form-error">{errors.paymentMethod}</span>
              )}

              {isZelle && (
                <div className="booking__zelle-panel">
                  <p className="booking__zelle-heading">Zelle Payment Instructions</p>
                  <dl className="booking__zelle-details">
                    <div className="booking__zelle-row">
                      <dt>Advance payment</dt>
                      <dd>{ADVANCE_PAYMENT_LABEL}</dd>
                    </div>
                    <div className="booking__zelle-row">
                      <dt>Payment method</dt>
                      <dd>Zelle</dd>
                    </div>
                    <div className="booking__zelle-row">
                      <dt>Send to</dt>
                      <dd>{ZELLE_RECIPIENT}</dd>
                    </div>
                  </dl>
                  <p className="booking__zelle-note">{ZELLE_SUBMIT_INSTRUCTION}</p>
                  <p className="booking__zelle-status-note">
                    Your booking will be marked <strong>Payment Pending</strong> until we verify your
                    Zelle payment.
                  </p>
                </div>
              )}
            </div>

            <p className="booking__notice">
              <strong>{MIN_BOOKING_NOTICE}</strong>
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
                {successPaymentMethod === PAYMENT_METHODS.ZELLE
                  ? `Thank you! Please send your ${ADVANCE_PAYMENT_LABEL} advance payment to ${ZELLE_RECIPIENT} via Zelle. Your booking is payment pending until we verify receipt.`
                  : 'Thank you! We\'ll contact you shortly to confirm your appointment and deposit.'}
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
