import { useRef, useState } from "react";

const IMAGES = [
  { src: "https://zfx-gyms.zenfitx.link/onboarding/third.avif",  alt: "ZenFitX feature 3" },
  { src: "https://zfx-gyms.zenfitx.link/onboarding/fourth.avif", alt: "ZenFitX feature 4" },
  { src: "https://zfx-gyms.zenfitx.link/onboarding/fifth.avif",  alt: "ZenFitX feature 5" },
];

const LandingBody: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const prev = () => setActiveIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);
  const next = () => setActiveIndex((i) => (i + 1) % IMAGES.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <main className="landing-body">
      {/* ── Hero text ── */}
      <div className="landing-hero">
        <h1 className="landing-hero__headline">
          The Pro Experience.<br />
          For Everyday Players.
        </h1>
        <p className="landing-hero__sub">powered by ZenVision AI</p>
      </div>

      {/* ── Desktop: side-by-side grid ── */}
      <div className="landing-screens__grid">
        {IMAGES.map((img, i) => (
          <img key={i} src={img.src} alt={img.alt} className="landing-screens__grid-img" loading="lazy" />
        ))}
      </div>

      {/* ── Mobile: carousel ── */}
      <div
        className="landing-screens__carousel"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="landing-screens__carousel-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {IMAGES.map((img, i) => (
            <div className="landing-screens__carousel-slide" key={i}>
              <img src={img.src} alt={img.alt} className="landing-screens__carousel-img" loading="lazy" />
            </div>
          ))}
        </div>

        {/* Prev / Next arrows */}
        <button className="landing-screens__arrow landing-screens__arrow--prev" onClick={prev} aria-label="Previous">
          ‹
        </button>
        <button className="landing-screens__arrow landing-screens__arrow--next" onClick={next} aria-label="Next">
          ›
        </button>

        {/* Dot indicators */}
        <div className="landing-screens__dots">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              className={`landing-screens__dot${i === activeIndex ? " landing-screens__dot--active" : ""}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default LandingBody;
