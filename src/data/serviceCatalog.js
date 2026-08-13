/**
 * Visual catalog metadata for the Services page.
 * Prices and service names come from Firestore / services.js — this file adds images & copy.
 */

const img = (folder, file) => `/images/services/${folder}/${file}`;

/** Nav labels — maps project category ids to display names */
export const CATEGORY_NAV = [
  { id: 'hair', label: 'Hair', folder: 'hair' },
  { id: 'makeup', label: 'Makeup', folder: 'soft-glam' },
  { id: 'facials', label: 'Facials', folder: 'facials' },
  { id: 'waxing', label: 'Body', folder: 'waxing' },
  { id: 'nails', label: 'Manicure', folder: 'nails' },
  { id: 'lashes', label: 'Lash', folder: 'lashes' },
];

export const CATEGORY_META = {
  hair: {
    tagline: 'Precision cuts, luminous color, and red-carpet-ready styling.',
    heroImage: img('hair', 'hero-1.png'),
  },
  makeup: {
    tagline: 'Soft glam, full glam, and bridal artistry tailored to you.',
    heroImage: img('soft-glam', 'hero-1.png'),
  },
  facials: {
    tagline: 'Restorative skincare rituals for clarity, glow, and calm.',
    heroImage: img('facials', 'hero-1.png'),
  },
  waxing: {
    tagline: 'Silky-smooth results with gentle, expert technique.',
    heroImage: img('waxing', 'hero.png'),
  },
  nails: {
    tagline: 'Impeccable manicures, gels, and artful nail design.',
    heroImage: img('nails', 'hero.png'),
  },
  lashes: {
    tagline: 'Custom lash sets and lifts for eyes that captivate.',
    heroImage: img('lashes', 'hero.png'),
  },
};

/** Service-specific images keyed by category id → service name */
export const SERVICE_IMAGES = {
  hair: {
    Blowout: img('hair', 'blow-dry.png'),
    "Women's Haircut": img('hair', 'haircut.png'),
    'Root Touch-Up': img('hair', 'root-touch-up.jpg'),
    'Full Color': img('hair', 'full-color.jpg'),
    'Keratin Treatment': img('hair', 'keratin.png'),
    'Hair Styling': img('hair', 'lookbook/curls-waves.png'),
    'Updo / Party Hairstyle': img('hair', 'lookbook/party.png'),
  },
  makeup: {
    'Soft Glam': img('soft-glam', 'gallery-1.png'),
    'Full Glam': img('soft-glam', 'gallery-3.png'),
    'Party Makeup': img('soft-glam', 'gallery-4.png'),
    'Bridal Makeup': img('soft-glam', 'gallery-5.png'),
    'Bridal Trial': img('soft-glam', 'gallery-2.png'),
    'Add-On Lashes': img('lashes', 'classic.png'),
  },
  facials: {
    'Basic Cleanup Facial': img('facials', 'gallery-1.png'),
    'Hydrating Facial': img('facials', 'hydrating.png'),
    'Brightening Facial': img('facials', 'gallery-2.png'),
    'Acne Treatment Facial': img('facials', 'acne.png'),
    'Anti-Aging Facial': img('facials', 'anti-aging.png'),
    'Bridal Glow Facial': img('facials', 'gallery-4.png'),
  },
  waxing: {
    'Full Body Wax': img('waxing', 'gallery-1.png'),
    'Full Legs': img('waxing', 'legs.png'),
    'Half Legs': img('waxing', 'legs.png'),
    'Full Arms': img('waxing', 'arms.png'),
    'Half Arms': img('waxing', 'arms.png'),
    Underarms: img('waxing', 'gallery-2.png'),
    Brazilian: img('waxing', 'gallery-3.png'),
    'Bikini Line': img('waxing', 'gallery-3.png'),
    Stomach: img('waxing', 'gallery-4.png'),
    Back: img('waxing', 'gallery-4.png'),
    'Full Face': img('waxing', 'face.png'),
    Eyebrows: img('waxing', 'eyebrow.png'),
    'Upper Lip': img('waxing', 'face.png'),
  },
  nails: {
    'Basic Manicure': img('nails', 'manicure.png'),
    'Basic Pedicure': img('nails', 'gallery-1.png'),
    'Mani + Pedi Combo': img('nails', 'gallery-2.png'),
    'Gel Manicure': img('nails', 'gel.png'),
    'Gel Pedicure': img('nails', 'gel.png'),
    'Nail Art': img('nails', 'nail-art.png'),
    'French Add-On': img('nails', 'gallery-3.png'),
  },
  lashes: {
    'Classic Full Set': img('lashes', 'classic.png'),
    'Hybrid Full Set': img('lashes', 'hybrid.png'),
    'Volume Full Set': img('lashes', 'volume.png'),
    'Mega Volume': img('lashes', 'volume.png'),
    'Classic Fill': img('lashes', 'classic.png'),
    'Hybrid Fill': img('lashes', 'hybrid.png'),
    'Volume Fill': img('lashes', 'volume.png'),
    'Lash Lift': img('lashes', 'lash-lift.png'),
    'Lash Tint': img('lashes', 'lash-lift.png'),
    'Lift + Tint Combo': img('lashes', 'lash-lift.png'),
  },
};

export const SERVICE_DESCRIPTIONS = {
  hair: {
    Blowout: 'Salon-quality blowout with volume, smoothness, and a polished finish.',
    "Women's Haircut": 'Precision cut tailored to your face shape, texture, and lifestyle.',
    'Root Touch-Up': 'Seamless root color refresh for a naturally maintained look.',
    'Full Color': 'Professional full hair color customized to your desired look.',
    'Keratin Treatment': 'Smoothing treatment that tames frizz and restores brilliant shine.',
    'Hair Styling': 'Event-ready styling with soft movement and lasting hold.',
    'Updo / Party Hairstyle': 'Elegant updos and occasion styles crafted for your special night.',
  },
  makeup: {
    'Soft Glam': 'Radiant, natural enhancement with soft definition and luminous skin.',
    'Full Glam': 'Bold, camera-ready glam with sculpted features and lasting wear.',
    'Party Makeup': 'Statement makeup designed to last from evening to after-hours.',
    'Bridal Makeup': 'Timeless bridal artistry that photographs beautifully all day.',
    'Bridal Trial': 'A full preview session to perfect your wedding-day look.',
    'Add-On Lashes': 'Luxury lash strips or individual accents to elevate any makeup look.',
  },
  facials: {
    'Basic Cleanup Facial': 'Deep cleanse and refresh for instantly clearer, smoother skin.',
    'Hydrating Facial': 'Quenching moisture ritual for soft, supple, glowing skin.',
    'Brightening Facial': 'Revives dull skin with a fresh, even-toned radiance.',
    'Acne Treatment Facial': 'Targeted clarifying care to calm breakouts and refine pores.',
    'Anti-Aging Facial': 'Firming, nourishing treatment to soften fine lines and restore glow.',
    'Bridal Glow Facial': 'Pre-event facial for luminous, photo-ready skin.',
  },
  waxing: {
    'Full Body Wax': 'Comprehensive smooth-skin waxing from shoulders to toes.',
    'Full Legs': 'Silky legs with long-lasting smoothness.',
    'Half Legs': 'Lower or upper leg waxing with a clean, precise finish.',
    'Full Arms': 'Smooth, hair-free arms with gentle technique.',
    'Half Arms': 'Forearm or upper arm waxing for a polished look.',
    Underarms: 'Quick, effective underarm waxing for lasting smoothness.',
    Brazilian: 'Professional Brazilian wax with comfort-focused care.',
    'Bikini Line': 'Clean bikini line shaping for a confident finish.',
    Stomach: 'Smooth stomach waxing with precise application.',
    Back: 'Full or partial back waxing for a clean, refined result.',
    'Full Face': 'Complete facial waxing for a smooth, polished complexion.',
    Eyebrows: 'Expert brow shaping for defined, balanced arches.',
    'Upper Lip': 'Gentle upper lip waxing for a flawless finish.',
  },
  nails: {
    'Basic Manicure': 'Classic nail care with shaping, cuticle work, and polish.',
    'Basic Pedicure': 'Relaxing foot care with exfoliation and perfect polish.',
    'Mani + Pedi Combo': 'Complete hand and foot pampering in one visit.',
    'Gel Manicure': 'Chip-resistant gel color with a high-shine, lasting finish.',
    'Gel Pedicure': 'Durable gel pedicure for weeks of flawless toes.',
    'Nail Art': 'Custom art and detail — from minimal accents to statement designs.',
    'French Add-On': 'Classic French tips added to any manicure or gel service.',
  },
  lashes: {
    'Classic Full Set': 'Natural length and definition — one extension per lash.',
    'Hybrid Full Set': 'A textured blend of classic and volume for balanced fullness.',
    'Volume Full Set': 'Luxurious, fluffy volume for a dramatic eye look.',
    'Mega Volume': 'Maximum density and drama with ultra-fine fan extensions.',
    'Classic Fill': 'Maintenance fill for your classic set.',
    'Hybrid Fill': 'Refresh your hybrid set to keep lashes full and even.',
    'Volume Fill': 'Volume fill to restore your set\'s lush appearance.',
    'Lash Lift': 'Lift and curl your natural lashes for an wide-eyed look.',
    'Lash Tint': 'Deep tint for darker, more defined natural lashes.',
    'Lift + Tint Combo': 'The ultimate natural lash enhancement in one service.',
  },
};

export function getServiceImage(categoryId, serviceName) {
  return (
    SERVICE_IMAGES[categoryId]?.[serviceName] ||
    CATEGORY_META[categoryId]?.heroImage ||
    '/images/services/hair/hero-1.png'
  );
}

export function getServiceDescription(categoryId, serviceName) {
  return (
    SERVICE_DESCRIPTIONS[categoryId]?.[serviceName] ||
    'A signature Looks By Leema treatment delivered with care and precision.'
  );
}

/** Enrich live Firestore/static categories with catalog metadata for the Services UI */
export function enrichServiceCategories(categories) {
  return categories.map((cat) => {
    const meta = CATEGORY_META[cat.id] || {};
    const nav = CATEGORY_NAV.find((n) => n.id === cat.id);

    return {
      ...cat,
      navLabel: nav?.label || cat.title,
      tagline: meta.tagline || '',
      heroImage: meta.heroImage || '',
      services: (cat.services || []).map((service) => ({
        ...service,
        value: `${cat.id}:${service.name}`,
        image: getServiceImage(cat.id, service.name),
        description: getServiceDescription(cat.id, service.name),
      })),
    };
  });
}
