import PageBanner from '../components/PageBanner';
import Contact from '../components/Contact';

/** Contact page — location, contact info, and map */
export default function ContactPage() {
  return (
    <>
      <PageBanner
        eyebrow="Get In Touch"
        title="Contact Us"
        description="We'd love to hear from you. Reach out to book or ask a question."
      />
      <Contact />
    </>
  );
}
