import PageBanner from '../components/PageBanner';
import Services from '../components/Services';

/** Services page — full service menu with pricing */
export default function ServicesPage() {
  return (
    <>
      <PageBanner
        eyebrow="What We Offer"
        title="Our Services"
        description="Curated treatments designed to elevate your natural beauty."
      />
      <Services />
    </>
  );
}
