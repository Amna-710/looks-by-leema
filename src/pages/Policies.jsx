import PageBanner from '../components/PageBanner';
import Policies from '../components/Policies';

/** Policies page — booking, cancellation, and studio rules */
export default function PoliciesPage() {
  return (
    <>
      <PageBanner
        eyebrow="Before You Visit"
        title="Studio Policies"
        description="Please review our policies for a smooth and enjoyable experience."
      />
      <Policies />
    </>
  );
}
