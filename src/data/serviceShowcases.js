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
    heroImages: [img('facials', 'hero-background.png')],
    gallery: [
      img('facials', 'gallery-1.png'),
      img('facials', 'gallery-2.png'),
      img('facials', 'gallery-3.png'),
      img('facials', 'gallery-4.png'),
    ],
    treatments: [
      {
        id: 'anti-aging',
        name: 'Anti-Aging Facial',
        image: img('facials', 'anti-aging.png'),
        description:
          'A restorative ritual designed to soften visible signs of aging and revive the skin\'s natural radiance with gentle, nourishing care.',
        benefits: [
          'Reduces the appearance of fine lines',
          'Improves skin firmness and elasticity',
          'Restores a youthful, luminous glow',
        ],
      },
      {
        id: 'hydrating',
        name: 'Hydrating Facial',
        image: img('facials', 'hydrating.png'),
        description:
          'A deeply moisturizing treatment that replenishes thirsty skin — leaving it soft, balanced, and beautifully refreshed.',
        benefits: [
          'Deeply moisturizes dry or dull skin',
          'Improves softness and smoothness',
          'Gives a fresh, glowing look',
        ],
      },
      {
        id: 'acne',
        name: 'Acne Facial',
        image: img('facials', 'acne.png'),
        description:
          'A clarifying treatment focused on cleaner pores and calmer skin — helping you feel more confident in your complexion.',
        benefits: [
          'Helps control breakouts',
          'Cleans pores and reduces excess oil',
          'Improves overall skin clarity',
        ],
      },
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
    eyebrow: 'Luxury Smooth Skin',
    description:
      'Gentle, precise waxing in a calm private studio — silky-smooth results with a clean, polished finish that feels fresh and refined.',
    heroImages: [img('waxing', 'hero.png')],
    gallery: [],
    waxServices: [
      {
        id: 'face',
        label: 'Facial Softness',
        name: 'Face Wax',
        image: img('waxing', 'face.png'),
        description:
          'Achieve smooth, radiant skin with our gentle face waxing service. Designed to remove unwanted facial hair while leaving your skin soft, refreshed, and beautifully polished.',
        benefits: [
          'Smooth and flawless skin',
          'Removes unwanted facial hair',
          'Gives a clean, fresh appearance',
        ],
      },
      {
        id: 'eyebrow',
        label: 'Brow Definition',
        name: 'Eyebrow Wax',
        image: img('waxing', 'eyebrow.png'),
        description:
          'Perfectly shaped brows that enhance your natural beauty. Our eyebrow waxing service creates a clean, defined look with a precise and elegant finish.',
        benefits: [
          'Defines facial features',
          'Creates a polished eyebrow shape',
          'Long-lasting smooth results',
        ],
      },
      {
        id: 'legs',
        label: 'Silky Finish',
        name: 'Legs Wax',
        image: img('waxing', 'legs.png'),
        description:
          'Enjoy silky-smooth legs with our professional waxing treatment. Experience soft, hair-free skin with a luxurious salon finish.',
        benefits: [
          'Smooth and soft skin',
          'Longer-lasting results',
          'Removes unwanted hair effectively',
        ],
      },
      {
        id: 'arms',
        label: 'Confident Softness',
        name: 'Arms Wax',
        image: img('waxing', 'arms.png'),
        description:
          'Get beautifully smooth and confident-looking arms with our gentle waxing treatment. Designed for a clean, flawless, and comfortable experience.',
        benefits: [
          'Soft and smooth skin',
          'Removes unwanted hair',
          'Leaves skin feeling refreshed',
        ],
      },
    ],
    sections: [],
  },
  hair: {
    slug: 'hair',
    tag: 'Hair',
    title: 'Hair',
    eyebrow: 'Hair Styling',
    description:
      'Elegant hair services crafted to complement your look — from polished styling to glamorous finishing touches that feel luxurious and wearable.',
    heroImages: [img('hair', 'hero-1.png'), img('hair', 'hero-2.png')],
    gallery: [],
    hairServices: [
      {
        id: 'haircut',
        label: 'Precision Style',
        name: 'Haircut',
        image: img('hair', 'haircut.png'),
        description:
          'Transform your look with our professional haircut service, designed to enhance your features and create a style that matches your personality. Our expert stylists provide precision cuts with a flawless finish.',
      },
      {
        id: 'blow-dry',
        label: 'Polished Glam',
        name: 'Blow Dry',
        image: img('hair', 'blow-dry.png'),
        description:
          'Enjoy a salon-quality blow dry that adds volume, smoothness, and shine to your hair. Perfect for achieving a polished and glamorous look for any occasion.',
      },
      {
        id: 'hair-wash',
        label: 'Refresh Ritual',
        name: 'Hair Wash',
        image: img('hair', 'hair-wash.png'),
        description:
          'Relax and refresh your hair with our gentle hair wash service. Our treatment deeply cleanses your hair and scalp, leaving your hair feeling fresh, soft, and revitalized.',
      },
      {
        id: 'keratin',
        label: 'Smooth Treatment',
        name: 'Keratin Treatment',
        image: img('hair', 'keratin.png'),
        description:
          'Experience silky, smooth, and manageable hair with our premium keratin treatment. It helps reduce frizz, restore shine, and give your hair a healthier appearance.',
      },
    ],
    lookbook: [
      {
        id: 'bridal',
        title: 'Bridal Hairstyle',
        description:
          'Elegant bridal styling designed to create a graceful and unforgettable appearance.',
        image: img('hair', 'lookbook/bridal.png'),
      },
      {
        id: 'party',
        title: 'Party Hairstyle',
        description:
          'Glamorous hairstyles perfect for special events and celebrations.',
        image: img('hair', 'lookbook/party.png'),
      },
      {
        id: 'curls-waves',
        title: 'Curls & Waves',
        description:
          'Beautiful curls and waves that add texture, volume, and a feminine touch.',
        image: img('hair', 'lookbook/curls-waves.png'),
      },
      {
        id: 'classic-layers',
        title: 'Classic Layers',
        description:
          'A timeless layered style that adds movement, volume, and a soft elegant finish.',
        image: img('hair', 'lookbook/classic-layers.png'),
      },
      {
        id: 'modern-bob',
        title: 'Modern Bob Cut',
        description:
          'A chic and stylish haircut that creates a fresh, confident, and modern look.',
        image: img('hair', 'lookbook/modern-bob.png'),
      },
      {
        id: 'braided-waves',
        title: 'Braided Waves',
        description:
          'Intricate braids meeting soft, voluminous waves — a sophisticated look for any special occasion.',
        image: img('hair', 'lookbook/braided-waves.png'),
      },
    ],
    sections: [],
  },
  nails: {
    slug: 'nails',
    tag: 'Nails',
    title: 'Nails',
    eyebrow: 'Luxury Nail Studio',
    description:
      'Elegant gels, custom acrylics, and artistic nail designs — polished to perfection for a look that feels refined, glamorous, and uniquely you.',
    heroImages: [img('nails', 'hero.png')],
    gallery: [
      img('nails', 'gallery-1.png'),
      img('nails', 'gallery-2.png'),
      img('nails', 'nail-art.png'),
    ],
    nailServices: [
      {
        id: 'gel',
        label: 'Signature Finish',
        name: 'Gel Nails',
        image: img('nails', 'gel.png'),
        description:
          'A glossy, salon-perfect finish that holds its shine — ideal when you want polished color with lasting beauty and a soft glam feel.',
        benefits: [
          'Long-lasting shine that stays fresh',
          'Durable, glossy finish',
          'Smooth color with a refined look',
        ],
      },
      {
        id: 'acrylic',
        label: 'Sculpted Style',
        name: 'Acrylic Nails',
        image: img('nails', 'acrylic.png'),
        description:
          'Strong, stylish extensions shaped to your preference — from classic length to bold statement sets with customizable designs.',
        benefits: [
          'Strong and stylish structure',
          'Customizable shapes and lengths',
          'Perfect base for creative designs',
        ],
      },
      {
        id: 'nail-art',
        label: 'Creative Detail',
        name: 'Nail Art',
        image: img('nails', 'nail-art.png'),
        description:
          'Personalized artistry for every mood — florals, chrome, gems, and modern motifs crafted for an Instagram-worthy finish.',
        benefits: [
          'Creative, personalized designs',
          'Trend-inspired details and accents',
          'Unique looks for every occasion',
        ],
      },
      {
        id: 'manicure',
        label: 'Essential Care',
        name: 'Manicure Services',
        image: img('nails', 'manicure.png'),
        description:
          'Clean, healthy, and beautifully polished nails with careful prep and finishing touches that keep your hands looking elegant.',
        benefits: [
          'Clean and healthy nail care',
          'Polished, refined finish',
          'Soft hands with a luxury touch',
        ],
      },
    ],
    sections: [],
  },
  lashes: {
    slug: 'lashes',
    tag: 'Lashes',
    title: 'Lashes',
    eyebrow: 'Luxury Lash Studio',
    description:
      'Wake up glamorous — classic, hybrid, and volume sets customized for your eyes with a soft, feminine, high-end finish.',
    heroImages: [img('lashes', 'hero.png')],
    gallery: [],
    lashServices: [
      {
        id: 'volume',
        label: 'Signature Set',
        title: 'Luxury Volume Lashes',
        image: img('lashes', 'volume.png'),
        description:
          'Create a bold and glamorous look with beautifully layered volume lashes designed for a fuller, dramatic effect.',
      },
      {
        id: 'classic',
        label: 'Timeless Soft Glam',
        title: 'Classic Lash Elegance',
        image: img('lashes', 'classic.png'),
        description:
          'Enhance your natural beauty with timeless classic lashes that add length, definition, and a soft natural glamour to your eyes.',
      },
      {
        id: 'hybrid',
        label: 'Balanced Texture',
        title: 'Perfect Hybrid Blend',
        image: img('lashes', 'hybrid.png'),
        description:
          'A beautiful combination of classic and volume techniques for a balanced, textured, and effortlessly stunning lash look.',
      },
      {
        id: 'lash-lift',
        label: 'Natural Enhancement',
        title: 'Natural Lash Lift',
        image: img('lashes', 'lash-lift.png'),
        description:
          'Lift and enhance your natural lashes with a beautiful curl that creates a brighter, more open eye appearance.',
      },
      {
        id: 'extensions',
        label: 'Custom Glam',
        title: 'Premium Lash Extensions',
        image: img('lashes', 'extensions.png'),
        description:
          'Achieve a flawless eye transformation with customized lash extensions designed to match your preferred style.',
      },
    ],
    sections: [],
  },
};

/** Map About Us tag labels to route paths */
export const TAG_TO_PATH = Object.fromEntries(
  Object.values(SERVICE_SHOWCASES).map((s) => [s.tag, `/${s.slug}`])
);

export function getServiceShowcase(slug) {
  return SERVICE_SHOWCASES[slug] || null;
}
