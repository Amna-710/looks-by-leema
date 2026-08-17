import { AboutPageBanner } from '../components/PageBanner';
import About from '../components/About';

/** About page — studio story, founder, philosophy, and mission */
export default function AboutPage() {
  return (
    <>
      <AboutPageBanner
        eyebrow="Our Story"
        title="About LooksByLeema"
        description="Beauty is more than a service — it's an experience."
      />
      <About />
    </>
  );
}
