import "./DesktopCarousel.scss";
import { useState, useEffect } from "react";

const realSlides = [
  "/assets/slides/cardSignal1.svg",
  "/assets/slides/cardCDC1.svg",
  "/assets/slides/cardSuggestion2.svg",
];

const slides = [
  realSlides[realSlides.length - 1],
  ...realSlides,
  realSlides[0],
];

type Props = {
  onSlideChange?: (index: number) => void;
};

export default function DesktopCarousel({ onSlideChange }: Props) {
  const [index, setIndex] = useState(1);
  const [transition, setTransition] = useState(true);

  const next = () => setIndex((prev) => prev + 1);
  const prev = () => setIndex((prev) => prev - 1);

  /* autoplay */

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  /* envoyer le bon index au parent */

  useEffect(() => {
    const realIndex = (index - 1 + realSlides.length) % realSlides.length;
    onSlideChange?.(realIndex);
  }, [index]);

  /* reset invisible quand on atteint un clone */

  const handleTransitionEnd = () => {
    if (index === slides.length - 1) {
      setTransition(false);
      setIndex(1);
    }

    if (index === 0) {
      setTransition(false);
      setIndex(slides.length - 2);
    }
  };

  /* réactiver transition */

  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => setTransition(true));
    }
  }, [transition]);

  return (
    <div className="desktop-carousel">
      <button className="carousel-arrow left" onClick={prev}>
        ‹
      </button>

      <div className="carousel-viewport">
        <div
          className="carousel-track"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: transition
              ? "transform .6s cubic-bezier(.22,.61,.36,1)"
              : "none",
          }}
        >
          {slides.map((img, i) => (
            <div className="carousel-slide" key={i}>
              <img src={img} />
            </div>
          ))}
        </div>
      </div>

      <button className="carousel-arrow right" onClick={next}>
        ›
      </button>

      <div className="carousel-dots">
        {realSlides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${(index - 1 + realSlides.length) % realSlides.length === i ? "active" : ""}`}
            onClick={() => setIndex(i + 1)}
          />
        ))}
      </div>
    </div>
  );
}
