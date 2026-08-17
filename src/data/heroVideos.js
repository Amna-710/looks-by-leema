/**
 * Home hero video slideshow — sourced from Pinterest pins (resolved to pinimg.com MP4).
 * Videos are hosted locally in public/videos/hero/ for reliable playback.
 */
export const HERO_VIDEOS = [
  {
    src: '/videos/hero/hero-1.mp4',
    pin: 'https://pin.it/18R26j8WG',
    label: 'Salon beauty',
  },
  {
    src: '/videos/hero/hero-2.mp4',
    pin: 'https://pin.it/6mAvHPBr0',
    label: 'Hair styling',
  },
  {
    src: '/videos/hero/hero-3.mp4',
    pin: 'https://pin.it/400ZDSg6J',
    label: 'Makeup artistry',
  },
  {
    src: '/videos/hero/hero-4.mp4',
    pin: 'https://pin.it/5djp9dyqw',
    label: 'Hair waves',
  },
];

/** Time each slide stays visible before advancing (ms) */
export const HERO_SLIDE_INTERVAL_MS = 3200;

/** Crossfade duration between slides (ms) — keep in sync with CSS */
export const HERO_SLIDE_FADE_MS = 650;
