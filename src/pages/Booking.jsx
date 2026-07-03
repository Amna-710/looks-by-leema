import PageBanner from '../components/PageBanner';
import Booking from '../components/Booking';

/** Booking page — appointment request form */
export default function BookingPage() {
  return (
    <>
      <PageBanner
        eyebrow="Reserve Your Spot"
        title="Book an Appointment"
        description="$10 non-refundable deposit required."
      />
      <Booking />
    </>
  );
}
