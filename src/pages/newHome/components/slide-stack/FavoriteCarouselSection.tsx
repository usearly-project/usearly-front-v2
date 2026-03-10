import { useState } from "react";
import DesktopCarousel from "./DesktopCarousel";
import "./FavoriteCarouselSection.scss";

const TITLE_TEXT = [
  ["Les signalements", "qui ont le plus", "fait râler cette", "semaine 😅"],
  ["Les coups de ❤️", "que vous avez le", "plus aimés !"],
  ["Les suggestions", "qui vous font", "rêver ✨"],
];

export default function FavoriteCarouselSection() {
  const [slideIndex, setSlideIndex] = useState(2);

  return (
    <section className="favorite-section">
      <div className="favorite-wrapper">
        <div className="favorite-left">
          <h2 key={slideIndex} className="favorite-title">
            {TITLE_TEXT[slideIndex].map((line, i) => (
              <span
                key={i}
                className="title-line"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {line}
              </span>
            ))}
          </h2>

          <button className="favorite-button">Découvrir</button>
        </div>

        <div className="favorite-right">
          <DesktopCarousel onSlideChange={setSlideIndex} />
        </div>
      </div>
    </section>
  );
}
