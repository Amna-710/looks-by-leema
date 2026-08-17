import { BookingPageBanner } from '../components/PageBanner';
import Booking from '../components/Booking';

/** Booking page — appointment request form */
export default function BookingPage() {
  return (
    <>
      <BookingPageBanner
        eyebrow="Reserve Your Spot"
        title="Book an Appointment"
        description="$50 minimum booking amount applies to all appointments."
      />
      <Booking />
    </>
  );
}
