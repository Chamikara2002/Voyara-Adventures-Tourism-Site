import { useState, useEffect, useRef } from "react";
import "../Style/about-page.css";
import png1 from "../assets/Images/png1.png";
import png2 from "../assets/Images/png2.png";
import png3 from "../assets/Images/png3.png";
import png4 from "../assets/Images/png4.png";
import png5 from "../assets/Images/png5.png";
import png6 from "../assets/Images/png6.png";

// ─── Slide data ───────────────────────────────────────────────────────────────
// Replace each `src` with your actual hero image paths in /src/assets/
const SLIDES = [
  {
    id: 1,
    src: png1, // TODO: place hero image 1 here
    alt: "World landmarks collage – slide 1",
  },
  {
    id: 2,
    src: png2, // TODO: place hero image 2 here
    alt: "Mountain ski resort – slide 2",
  },
  {
    id: 3,
    src: png3, // TODO: place hero image 3 here
    alt: "Coastal city view – slide 3",
  },
  {
    id: 4,
    src: png4, // TODO: place hero image 4 here
    alt: "Desert dunes at sunset – slide 4",
  },
  {
    id: 5,
    src: png5, // TODO: place hero image 5 here
    alt: "Tropical paradise – slide 5",
  },
  {
    id: 6,
    src: png6, // TODO: place hero image 6 here
    alt: "European old town – slide 6",
  },
];

// ─── AboutPage Component ──────────────────────────────────────────────────────
export default function AboutPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef(null);

  // ── Auto-advance slideshow every 5 s ──────────────────────────────────────
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // ── Manual bullet navigation ───────────────────────────────────────────────
  const goToSlide = (index) => {
    clearInterval(intervalRef.current);
    setActiveSlide(index);
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
  };

  return (
    <main className="ap-page">
      {/* ── Hero Slideshow Section ──────────────────────────────────────────── */}
      <section className="ap-hero" aria-label="About us hero slideshow">
        {/* Slide images stack; only the active one is visible */}
        <div className="ap-hero__slides">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={`ap-hero__slide ${i === activeSlide ? "ap-hero__slide--active" : ""}`}
            >
              {/* TODO: replace src with your actual image */}
              <img
                src={slide.src}
                alt={slide.alt}
                className="ap-hero__slide-img"
                draggable="false"
              />
            </div>
          ))}

          {/* Gradient overlay for text legibility */}
          <div className="ap-hero__overlay" aria-hidden="true" />
        </div>

        {/* Hero text content */}
        <div className="ap-hero__content">
          <h1 className="ap-hero__title">About Us.</h1>
          <p className="ap-hero__subtitle">
            Seamless airport transfers and curated tours designed for the elite
            traveler.
          </p>

          {/* Taxi Service CTA button */}
          <a
            href="#taxi-service"
            className="ap-hero__cta"
            aria-label="Explore our taxi service"
          >
            <span className="ap-hero__cta-icon" aria-hidden="true">
              ✦
            </span>
            Taxi Service
          </a>
        </div>

        {/* Bullet / dot navigation */}
        <nav className="ap-hero__bullets" aria-label="Slide navigation">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              className={`ap-hero__bullet ${i === activeSlide ? "ap-hero__bullet--active" : ""}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === activeSlide ? "true" : undefined}
            />
          ))}
        </nav>
      </section>
    </main>
  );
}
