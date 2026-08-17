import PageBanner from '../components/PageBanner';
import Booking from '../components/Booking';

const BOOKING_BANNER_IMAGE = '/images/booking-banner.jpg';

/** Booking page — appointment request form */
export default function BookingPage() {
  return (
    <>
      <PageBanner
        eyebrow="Reserve Your Spot"
        title="Book an Appointment"
        description="$50 minimum booking amount applies to all appointments."
        backgroundImage={BOOKING_BANNER_IMAGE}
      />
      <Booking />
    </>
  );
}
