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
 * Dots are rendered separately via VideoSlideshowDots.
 */
const HeroVideoSlideshow = forwardRef(function HeroVideoSlideshow(
  {
    active,
    onActiveChange,
    videos = HERO_VIDEOS,
    slideIntervalMs = HERO_SLIDE_INTERVAL_MS,
    fadeMs = HERO_SLIDE_FADE_MS,
    fallbackPoster = FALLBACK_POSTER,
    className = '',
  },
  ref,
) {
  const [ready, setReady] = useState(() => new Set());
  const videoRefs = useRef([]);
  const timerRef = useRef(null);
  const activeRef = useRef(active);

  const slideCount = videos.length;

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
    timerRef.current = setInterval(advance, slideIntervalMs);
  }, [advance, slideCount, slideIntervalMs]);

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
        className={`hero-video-slideshow hero-video-slideshow--fallback${className ? ` ${className}` : ''}`}
        style={{ backgroundImage: `url(${fallbackPoster})` }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`hero-video-slideshow${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      {videos.map((slide, index) => {
        const isActive = index === active;
        return (
          <div
            key={slide.src}
            className={`hero-video-slideshow__slide${
              isActive ? ' hero-video-slideshow__slide--active' : ''
            }`}
            style={{ transitionDuration: `${fadeMs}ms` }}
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
              poster={fallbackPoster}
              onCanPlay={() => handleCanPlay(index)}
            />
          </div>
        );
      })}
    </div>
  );
});

export function VideoSlideshowDots({
  videos = HERO_VIDEOS,
  active,
  onSelect,
  className = '',
}) {
  if (videos.length < 2) return null;

  return (
    <div
      className={`hero-video-slideshow__dots hero-video-slideshow__dots--front${
        className ? ` ${className}` : ''
      }`}
    >
      {videos.map((slide, index) => (
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

/** @deprecated Use VideoSlideshowDots */
export function HeroVideoDots(props) {
  return <VideoSlideshowDots {...props} />;
}

export default HeroVideoSlideshow;
