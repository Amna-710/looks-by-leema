/**
 * Luxury service showcase pages — About Us tag destinations.
 * Replace images in public/images/services/{slug}/ when final assets are ready.
 */

const img = (slug, name) => `/images/services/${slug}/${name}`;

export const SERVICE_SHOWCASES = {
  'soft-glam': {
    slug: 'soft-glam',
    tag: 'Soft Glam',
    title: 'Soft Glam',
    eyebrow: 'Makeup Artistry',
    description:
      'Effortless radiance for everyday elegance and special moments — soft definition, luminous skin, and a finish that feels like you, elevated.',
    heroImages: [
      img('soft-glam', 'hero-1.png'),
      img('soft-glam', 'hero-2.png'),
      img('soft-glam', 'hero-3.png'),
    ],
    gallery: [
      img('soft-glam', 'gallery-1.png'),
      img('soft-glam', 'gallery-2.png'),
      img('soft-glam', 'gallery-3.png'),
      img('soft-glam', 'gallery-4.png'),
      img('soft-glam', 'gallery-5.png'),
      img('soft-glam', 'gallery-6.png'),
    ],
    sections: [
      {
        title: 'Natural. Polished. Timeless.',
        text: 'Our soft glam look enhances your features with a light hand — glowing complexion, softly blended eyes, and a refined lip that photographs beautifully and lasts through the day.',
        image: img('soft-glam', 'gallery-1.png'),
      },
      {
        title: 'Perfect for every occasion',
        text: 'From brunches and date nights to bridal trials and events, soft glam is designed to feel luxurious without looking overdone — so you can move through your day with confidence.',
        image: img('soft-glam', 'gallery-2.png'),
      },
    ],
  },
  facials: {
    slug: 'facials',
    tag: 'Facials',
    title: 'Facials',
    eyebrow: 'Skincare Rituals',
    description:
      'Rejuvenating facial treatments that restore clarity, hydration, and a healthy glow — tailored to your skin in a calm, private studio setting.',
    heroImages: [img('facials', 'hero-1.png'), img('facials', 'hero-2.png')],
    gallery: [
      img('facials', 'gallery-1.png'),
      img('facials', 'gallery-2.png'),
      img('facials', 'gallery-3.png'),
      img('facials', 'gallery-4.png'),
    ],
    sections: [
      {
        title: 'Skin that feels renewed',
        text: 'Each facial begins with a thoughtful consultation, then a customized ritual of cleansing, treatment, and hydration designed for your unique skin goals.',
        image: img('facials', 'gallery-1.png'),
      },
      {
        title: 'A moment of calm',
        text: 'Step away from the rush and into a serene beauty experience — gentle techniques, premium products, and results you can see and feel.',
        image: img('facials', 'gallery-2.png'),
      },
    ],
  },
  waxing: {
    slug: 'waxing',
    tag: 'Waxing',
    title: 'Waxing',
    eyebrow: 'Smooth Skin Care',
    description:
      'Precise, professional waxing for silky-smooth results — comfortable technique, clean application, and lasting finish in a private, welcoming space.',
    heroImages: [img('waxing', 'hero-1.png'), img('waxing', 'hero-2.png')],
    gallery: [
      img('waxing', 'gallery-1.png'),
      img('waxing', 'gallery-2.png'),
      img('waxing', 'gallery-3.png'),
      img('waxing', 'gallery-4.png'),
    ],
    sections: [
      {
        title: 'Precision & care',
        text: 'We prioritize comfort and cleanliness with careful preparation, quality wax, and a technique refined for smooth, long-lasting results.',
        image: img('waxing', 'gallery-1.png'),
      },
      {
        title: 'Confidence, refined',
        text: 'Whether you are preparing for an event or maintaining your routine, our waxing services deliver a polished finish with a gentle, professional touch.',
        image: img('waxing', 'gallery-2.png'),
      },
    ],
  },
  hair: {
    slug: 'hair',
    tag: 'Hair',
    title: 'Hair',
    eyebrow: 'Hair Styling',
    description:
      'Elegant hair services crafted to complement your look — from polished styling to glamorous finishing touches that feel luxurious and wearable.',
    heroImages: [img('hair', 'hero-1.png'), img('hair', 'hero-2.png')],
    gallery: [
      img('hair', 'gallery-1.png'),
      img('hair', 'gallery-2.png'),
      img('hair', 'gallery-3.png'),
      img('hair', 'gallery-4.png'),
    ],
    sections: [
      {
        title: 'Style that speaks for you',
        text: 'From soft waves to sleek finishes, our hair services are tailored to your face shape, occasion, and personal aesthetic.',
        image: img('hair', 'gallery-1.png'),
      },
      {
        title: 'Luxury in every detail',
        text: 'We focus on healthy-looking shine, lasting hold, and a finish that photographs beautifully — so you feel camera-ready and confident.',
        image: img('hair', 'gallery-2.png'),
      },
    ],
  },
  nails: {
    slug: 'nails',
    tag: 'Nails',
    title: 'Nails',
    eyebrow: 'Nail Care',
    description:
      'Refined nail care and beautiful finishes — clean technique, thoughtful styling, and a polished look that completes your beauty experience.',
    heroImages: [img('nails', 'hero-1.png'), img('nails', 'hero-2.png')],
    gallery: [
      img('nails', 'gallery-1.png'),
      img('nails', 'gallery-2.png'),
      img('nails', 'gallery-3.png'),
      img('nails', 'gallery-4.png'),
    ],
    sections: [
      {
        title: 'Polished perfection',
        text: 'Every nail service is approached with precision and artistry — clean prep, elegant color, and a finish that feels intentional and luxurious.',
        image: img('nails', 'gallery-1.png'),
      },
      {
        title: 'The finishing touch',
        text: 'Whether classic or statement, your nails should feel like an extension of your personal style. We help you find the look that feels most you.',
        image: img('nails', 'gallery-2.png'),
      },
    ],
  },
  lashes: {
    slug: 'lashes',
    tag: 'Lashes',
    title: 'Lashes',
    eyebrow: 'Lash Artistry',
    description:
      'Custom lash sets designed for natural volume or full glam — lightweight application, beautiful fluff, and a look that opens the eyes effortlessly.',
    heroImages: [img('lashes', 'hero-1.png'), img('lashes', 'hero-2.png')],
    gallery: [
      img('lashes', 'gallery-1.png'),
      img('lashes', 'gallery-2.png'),
      img('lashes', 'gallery-3.png'),
      img('lashes', 'gallery-4.png'),
    ],
    sections: [
      {
        title: 'Custom beauty for your eyes',
        text: 'From soft hybrid sets to fuller glam, each lash design is mapped to your eye shape for a flattering, balanced, and wearable finish.',
        image: img('lashes', 'gallery-1.png'),
      },
      {
        title: 'Wake up ready',
        text: 'Wake up looking polished — lashes that enhance your natural beauty so everyday makeup feels effortless and special occasions feel complete.',
        image: img('lashes', 'gallery-2.png'),
      },
    ],
  },
};

/** Map About Us tag labels to route paths */
export const TAG_TO_PATH = Object.fromEntries(
  Object.values(SERVICE_SHOWCASES).map((s) => [s.tag, `/${s.slug}`])
);

export function getServiceShowcase(slug) {
  return SERVICE_SHOWCASES[slug] || null;
}
