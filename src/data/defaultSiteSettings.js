/** Default site content — seeded to Firestore & Realtime Database */
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SOCIAL_INSTAGRAM_URL,
  SOCIAL_TIKTOK_URL,
  SOCIAL_YOUTUBE_URL,
} from './contactInfo';

export const defaultSiteSettings = {
  hero: {
    location: 'Queens, New York',
    title: 'LooksByLeema Beauty Studio',
    subtitle: "Beauty is more than a service — it's an experience.",
    description:
      'Enhancing your natural beauty with makeup, facials, waxing, hair, nail, and lash services in Queens, NY.',
    imageUrl: '/images/hero-background.png',
  },
  welcome: {
    title: 'Welcome to LooksByLeema',
    text: 'Step into a sanctuary of beauty in Queens, NY — where every service is crafted with care, precision, and a touch of luxury. From soft glam makeup to rejuvenating facials, we\'re here to help you look and feel your absolute best.',
  },
  contact: {
    location: 'Queens, NY',
    email: CONTACT_EMAIL,
    phone: CONTACT_PHONE,
    instagram: SOCIAL_INSTAGRAM_URL,
    tiktok: SOCIAL_TIKTOK_URL,
    youtube: SOCIAL_YOUTUBE_URL,
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96717.28361985928!2d-73.87248005!3d40.7282239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25f21e91f9355%3A0x860bb7c86d1efd4b!2sQueens%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
  },
  about: {
    lead: "At LooksByLeema Beauty Studio, beauty is more than a service — it's an experience.",
    body: 'Located in Queens, NY, we specialize in soft glam makeup, flawless skin treatments, precision waxing, elegant hair services, nail care, and lashes. Every appointment is tailored to enhance your natural beauty while you relax in a warm, welcoming space.',
    imageUrl: '/images/about-studio.png',
    founderName: 'Haleema',
    founderBio:
      'Haleema founded LooksByLeema Beauty Studio with a simple vision: create a space where every woman feels seen, celebrated, and beautiful in her own skin. With years of experience in makeup artistry, skincare, and beauty services, she brings passion, precision, and a personal touch to every client.',
    founderImageUrl: '/images/about-founder.jpg',
    philosophy:
      'We believe beauty should feel effortless, not overwhelming. Our philosophy centers on enhancing what makes you uniquely you — never masking it.',
    mission:
      'Our mission is to help every woman feel comfortable, confident, and celebrated. We strive to deliver affordable luxury in a calm, private environment.',
    tags: ['Soft Glam', 'Facials', 'Waxing', 'Hair', 'Nails', 'Lashes'],
  },
};

export const defaultTestimonials = [
  {
    id: 't1',
    name: 'Aisha M.',
    service: 'Soft Glam Makeup',
    quote:
      'Haleema made me feel like a queen on my birthday. The soft glam was flawless and lasted all night!',
    rating: 5,
    order: 0,
  },
  {
    id: 't2',
    name: 'Sarah K.',
    service: 'Hybrid Lash Full Set',
    quote:
      "Best lash experience I've ever had. The studio is so clean and calming — I fell asleep during my fill!",
    rating: 5,
    order: 1,
  },
  {
    id: 't3',
    name: 'Maria L.',
    service: 'Bridal Makeup',
    quote:
      'I was nervous for my wedding day look, but Haleema exceeded every expectation. I felt beautiful and confident.',
    rating: 5,
    order: 2,
  },
];
