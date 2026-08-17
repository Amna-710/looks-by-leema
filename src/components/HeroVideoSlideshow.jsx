import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import {
  HERO_SLIDE_FADE_MS,
  HERO_SLIDE_INTERVAL_MS,
  HERO_VIDEOS,
} from '../data/heroVideos';
import './HeroVideoSlideshow.css';

const FALLBACK_POSTER = '/images/hero-background.png';

/**
 * Full-width hero video slideshow — fast crossfade, muted autoplay.
 * Dots are rendered separately in Hero.jsx (above overlay) via HeroVideoDots.
 */
const HeroVideoSlideshow = forwardRef(function HeroVideoSlideshow(
  { active, onActiveChange },
  ref,
) {
  const [ready, setReady] = useState(() => new Set());
  const videoRefs = useRef([]);
  const timerRef = useRef(null);
  const activeRef = useRef(active);

  const slideCount = HERO_VIDEOS.length;

  const goTo = useCallback(
    (index) => {
      if (slideCount === 0) return;
      const next = ((index % slideCount) + slideCount) % slideCount;
      activeRef.current = next;
      onActiveChange(next);
    },
    [onActiveChange, slideCount],
  );

  const advance = useCallback(() => {
    goTo(activeRef.current + 1);
  }, [goTo]);

  const restartTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (slideCount < 2) return;
    timerRef.current = setInterval(advance, HERO_SLIDE_INTERVAL_MS);
  }, [advance, slideCount]);

  useImperativeHandle(ref, () => ({ goTo, restartTimer }), [goTo, restartTimer]);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  /* Auto-advance */
  useEffect(() => {
    restartTimer();
    return () => clearInterval(timerRef.current);
  }, [restartTimer]);

  /* Play active video; pause others */
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active) {
        const playPromise = video.play();
        if (playPromise?.catch) {
          playPromise.catch(() => {});
        }
      } else {
        video.pause();
      }
    });
  }, [active, ready]);

  /* Preload next video */
  useEffect(() => {
    const nextIndex = (active + 1) % slideCount;
    const nextVideo = videoRefs.current[nextIndex];
    if (nextVideo && nextVideo.preload === 'none') {
      nextVideo.preload = 'metadata';
      nextVideo.load();
    }
  }, [active, slideCount]);

  const handleCanPlay = useCallback((index) => {
    setReady((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  if (slideCount === 0) {
    return (
      <div
        className="hero-video-slideshow hero-video-slideshow--fallback"
        style={{ backgroundImage: `url(${FALLBACK_POSTER})` }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="hero-video-slideshow" aria-hidden="true">
      {HERO_VIDEOS.map((slide, index) => {
        const isActive = index === active;
        return (
          <div
            key={slide.src}
            className={`hero-video-slideshow__slide${
              isActive ? ' hero-video-slideshow__slide--active' : ''
            }`}
            style={{ transitionDuration: `${HERO_SLIDE_FADE_MS}ms` }}
          >
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              className="hero-video-slideshow__video"
              src={slide.src}
              muted
              loop
              playsInline
              autoPlay={index === 0}
              preload={index === 0 ? 'auto' : 'none'}
              poster={FALLBACK_POSTER}
              onCanPlay={() => handleCanPlay(index)}
            />
          </div>
        );
      })}
    </div>
  );
});

export function HeroVideoDots({ active, onSelect }) {
  if (HERO_VIDEOS.length < 2) return null;

  return (
    <div className="hero-video-slideshow__dots hero-video-slideshow__dots--front">
      {HERO_VIDEOS.map((slide, index) => (
        <button
          key={slide.src}
          type="button"
          className={`hero-video-slideshow__dot${
            index === active ? ' hero-video-slideshow__dot--active' : ''
          }`}
          aria-label={`Show ${slide.label} video`}
          aria-current={index === active ? 'true' : undefined}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
}

export default HeroVideoSlideshow;
