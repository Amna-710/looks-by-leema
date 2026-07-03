import Hero from '../components/Hero';
import Welcome from '../components/Welcome';
import FeaturedServices from '../components/FeaturedServices';
import SalonGallery from '../components/SalonGallery';
import Testimonials from '../components/Testimonials';

/** Home page — all sections live-synced with Firebase */
export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <FeaturedServices />
      <SalonGallery />
      <Testimonials />
    </>
  );
}
