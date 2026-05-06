import { useState, useEffect, useCallback, useRef } from "react";
import "../Style/home-page.css";

// ── Slideshow Data ────────────────────────────────────────────────────────────
// add images: Replace each `image` value with your actual slide image paths.
// Recommended size: 1920×900px. Add or remove slide objects as needed.
const SLIDES = [
  {
    id: 1,
    // add images: Slide 1 background image
    image: "/assets/slides/slide1.jpg",
    headingLine1: "Your Premium Gateway to",
    headingHighlight: "Sri Lanka",
    subtext:
      "Seamless airport transfers and curated tours designed for the elite traveler.",
    btnLabel: "Taxi Service",
    btnIcon: "✈",
  },
  {
    id: 2,
    // add images: Slide 2 background image
    image: "/assets/slides/slide2.jpg",
    headingLine1: "Discover the Beauty of",
    headingHighlight: "Sri Lanka",
    subtext:
      "Explore pristine beaches, ancient temples and lush green highlands.",
    btnLabel: "Book a Tour",
    btnIcon: "🌿",
  },
  {
    id: 3,
    // add images: Slide 3 background image
    image: "/assets/slides/slide3.jpg",
    headingLine1: "Unforgettable Journeys Across",
    headingHighlight: "Sri Lanka",
    subtext:
      "Let our expert guides lead you through the island's most iconic destinations.",
    btnLabel: "Our Packages",
    btnIcon: "🗺",
  },
  {
    id: 4,
    // add images: Slide 4 background image
    image: "/assets/slides/slide4.jpg",
    headingLine1: "Luxury Transfers Throughout",
    headingHighlight: "Sri Lanka",
    subtext:
      "Arrive in comfort and style with our premium private transfer service.",
    btnLabel: "Book Transfer",
    btnIcon: "🚘",
  },
  {
    id: 5,
    // add images: Slide 5 background image
    image: "/assets/slides/slide5.jpg",
    headingLine1: "Experience Island Life in",
    headingHighlight: "Sri Lanka",
    subtext:
      "From sunrise safaris to sunset cruises — every moment is curated for you.",
    btnLabel: "View Itineraries",
    btnIcon: "🌅",
  },
  {
    id: 6,
    // add images: Slide 6 background image
    image: "/assets/slides/slide6.jpg",
    headingLine1: "Adventure Awaits You in",
    headingHighlight: "Sri Lanka",
    subtext:
      "Thrilling whale watching, surfing and hiking tailored to your pace.",
    btnLabel: "Get Started",
    btnIcon: "⚡",
  },
];

// ── Auto-play interval (ms) ────────────────────────────────────────────────
const AUTOPLAY_DELAY = 5000;

// ── Taxi Service Cards — managed by Super Admin ───────────────────────────
// add images: Replace `image` values with actual card images (recommended 600×400px)
// Super Admin: Add/remove card objects here to update what customers see.
const TAXI_CARDS = [
  {
    id: 1,
    image: "/assets/taxi/colombo.jpg", // add images
    title: "Colombo Taxi Service",
    readMore: "#",
  },
  {
    id: 2,
    image: "/assets/taxi/homagama.jpg", // add images
    title: "Homagama Taxi Service",
    readMore: "#",
  },
  {
    id: 3,
    image: "/assets/taxi/kelaniya.jpg", // add images
    title: "Kelaniya Taxi Service",
    readMore: "#",
  },
  {
    id: 4,
    image: "/assets/taxi/anuradhapura.jpg", // add images
    title: "Anuradhapura Taxi Service",
    readMore: "#",
  },
  {
    id: 5,
    image: "/assets/taxi/polonnaruwa.jpg", // add images
    title: "Polonnaruwa Taxi Service",
    readMore: "#",
  },
  {
    id: 6,
    image: "/assets/taxi/jaffna.jpg", // add images
    title: "Jaffna Taxi Service",
    readMore: "#",
  },
];

// ── Tour Cards — managed by Super Admin ───────────────────────────────────
// add images: Replace `image` values with actual tour card images (recommended 600×400px)
// Super Admin: Add/remove tour objects here to update what customers see.
const TOUR_CARDS = [
  {
    id: 1,
    image: "/assets/tours/homagama.jpg", // add images
    title: "Homagama Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 2,
    image: "/assets/tours/kelaniya.jpg", // add images
    title: "Kelaniya Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 3,
    image: "/assets/tours/anuradhapura.jpg", // add images
    title: "Anuradhapura Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 4,
    image: "/assets/tours/polonnaruwa.jpg", // add images
    title: "Polonnaruwa Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 5,
    image: "/assets/tours/jaffna.jpg", // add images
    title: "Jaffna Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 7,
    image: "/assets/tours/galle.jpg", // add images
    title: "Galle Tour Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 8,
    image: "/assets/tours/homagama.jpg", // add images
    title: "Homagama Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 9,
    image: "/assets/tours/kelaniya.jpg", // add images
    title: "Kelaniya Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 10,
    image: "/assets/tours/anuradhapura.jpg", // add images
    title: "Anuradhapura Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 11,
    image: "/assets/tours/polonnaruwa.jpg", // add images
    title: "Polonnaruwa Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 12,
    image: "/assets/tours/jaffna.jpg", // add images
    title: "Jaffna Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 13,
    image: "/assets/tours/galle.jpg", // add images
    title: "Galle Tour Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 1,
    image: "/assets/tours/homagama.jpg", // add images
    title: "Homagama Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 14,
    image: "/assets/tours/kelaniya.jpg", // add images
    title: "Kelaniya Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 15,
    image: "/assets/tours/anuradhapura.jpg", // add images
    title: "Anuradhapura Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 16,
    image: "/assets/tours/polonnaruwa.jpg", // add images
    title: "Polonnaruwa Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 17,
    image: "/assets/tours/jaffna.jpg", // add images
    title: "Jaffna Taxi Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
  {
    id: 18,
    image: "/assets/tours/galle.jpg", // add images
    title: "Galle Tour Service",
    description : "Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.",
    readMore: "#",
  },
];

// ── "Exclusive Rides" Feature Slides ─────────────────────────────────────
// Super Admin: Edit label/desc to update what customers see.
const FEATURE_SLIDES = [
  {
    id: 1,
    icon: "🕐",
    label: "Always Available",
    desc: "Seamless rides anytime, any where in Sri Lanka",
  },
  {
    id: 2,
    icon: "✈",
    label: "Airport Transfers",
    desc: "Stress free BIA pick-ups and drops",
  },
  {
    id: 3,
    icon: "🌟",
    label: "Expert Drivers",
    desc: "Professional, punctual, local experts",
  },
  {
    id: 4,
    icon: "🗺",
    label: "Island Tours",
    desc: "Curated routes to Sri Lanka's best spots",
  },
  {
    id: 5,
    icon: "💎",
    label: "Luxury Fleet",
    desc: "Premium vehicles for elite comfort",
  },
];

// ── Cards per page based on viewport (used for card sliders) ─────────────
const CARDS_PER_PAGE = 3;
const CARD_AUTOPLAY_MS = 3500;

// ── Reusable Card Slider Hook ─────────────────────────────────────────────
function useCardSlider(total, perPage, autoplayMs) {
  const [page, setPage] = useState(0);
  const timerRef = useRef(null);
  const maxPage = Math.ceil(total / perPage) - 1;

  const next = useCallback(
    () => setPage((p) => (p >= maxPage ? 0 : p + 1)),
    [maxPage],
  );
  const prev = useCallback(
    () => setPage((p) => (p <= 0 ? maxPage : p - 1)),
    [maxPage],
  );
  const goTo = useCallback((i) => setPage(i), []);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, autoplayMs);
  }, [next, autoplayMs]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  return { page, next, prev, goTo, maxPage, resetTimer };
}

export default function Home() {
  // ── Hero Slideshow State ──────────────────────────────────────────────────
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("next");
  const timerRef = useRef(null);
  const currentRef = useRef(current);
  const total = SLIDES.length;

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const advance = useCallback(
    (dir) => {
      setDirection(dir);
      setCurrent((prev) =>
        dir === "next" ? (prev + 1) % total : (prev - 1 + total) % total,
      );
    },
    [total],
  );

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => advance("next"), AUTOPLAY_DELAY);
  }, [advance]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const goToNext = useCallback(() => {
    advance("next");
    resetTimer();
  }, [advance, resetTimer]);
  const goToPrev = useCallback(() => {
    advance("prev");
    resetTimer();
  }, [advance, resetTimer]);
  const goTo = useCallback(
    (index) => {
      const dir = index > currentRef.current ? "next" : "prev";
      setDirection(dir);
      setCurrent(index);
      resetTimer();
    },
    [resetTimer],
  );

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goToNext, goToPrev]);

  const slide = SLIDES[current];

  // ── Taxi Card Slider ──────────────────────────────────────────────────────
  const taxi = useCardSlider(
    TAXI_CARDS.length,
    CARDS_PER_PAGE,
    CARD_AUTOPLAY_MS,
  );
  const taxiVisible = TAXI_CARDS.slice(
    taxi.page * CARDS_PER_PAGE,
    taxi.page * CARDS_PER_PAGE + CARDS_PER_PAGE,
  );

  // ── Tour Card Slider ──────────────────────────────────────────────────────
  // Tour shows 2 rows × 3 cols = 6 cards per page
  const TOUR_PER_PAGE = 6;
  const tour = useCardSlider(
    TOUR_CARDS.length,
    TOUR_PER_PAGE,
    CARD_AUTOPLAY_MS,
  );
  const tourVisible = TOUR_CARDS.slice(
    tour.page * TOUR_PER_PAGE,
    tour.page * TOUR_PER_PAGE + TOUR_PER_PAGE,
  );

  // ── Feature Slider ────────────────────────────────────────────────────────
  const feat = useCardSlider(FEATURE_SLIDES.length, 3, CARD_AUTOPLAY_MS);
  const featVisible = FEATURE_SLIDES.slice(feat.page * 3, feat.page * 3 + 3);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Hero Section (UNCHANGED) ────────────────────────────────────── */}
      <section className="vt-home" aria-label="Hero slideshow">
        <div className="vt-home__track">
          {SLIDES.map((s, i) => (
            <div
              key={s.id}
              className={[
                "vt-home__slide",
                i === current ? "vt-home__slide--active" : "",
                i === current && direction === "next"
                  ? "vt-home__slide--enter-next"
                  : "",
                i === current && direction === "prev"
                  ? "vt-home__slide--enter-prev"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden={i !== current}
            >
              <div
                className="vt-home__slide-bg"
                style={{ backgroundImage: `url(${s.image})` }}
                role="img"
                aria-label={`Slide ${i + 1} background`}
              />
              <div className="vt-home__overlay" aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="vt-home__content" key={current}>
          <h1 className="vt-home__heading">
            <span className="vt-home__heading-line1">{slide.headingLine1}</span>
            <br />
            <span className="vt-home__heading-highlight">
              {slide.headingHighlight}
            </span>
          </h1>
          <p className="vt-home__subtext">{slide.subtext}</p>
          <a href="#" className="vt-home__cta" aria-label={slide.btnLabel}>
            <span className="vt-home__cta-icon" aria-hidden="true">
              {slide.btnIcon}
            </span>
            {slide.btnLabel}
          </a>
        </div>

        <button
          className="vt-home__arrow vt-home__arrow--prev"
          onClick={goToPrev}
          aria-label="Previous slide"
        >
          <span aria-hidden="true">&#8249;</span>
        </button>
        <button
          className="vt-home__arrow vt-home__arrow--next"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <span aria-hidden="true">&#8250;</span>
        </button>

        <div
          className="vt-home__dots"
          role="tablist"
          aria-label="Slide indicators"
        >
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              className={`vt-home__dot${i === current ? " vt-home__dot--active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === current}
              role="tab"
            />
          ))}
        </div>

        <div className="vt-home__counter" aria-live="polite" aria-atomic="true">
          <span className="vt-home__counter-current">
            {String(current + 1).padStart(2, "0")}
          </span>
          <span className="vt-home__counter-sep">/</span>
          <span className="vt-home__counter-total">
            {String(total).padStart(2, "0")}
          </span>
        </div>
      </section>

      {/* ── Premium Lanka Taxi Service Section ─────────────────────────── */}
      <section
        className="vt-section vt-taxi"
        aria-label="Premium Lanka Taxi Service"
      >
        <div className="vt-section__header">
          <h2 className="vt-section__title">
            Premium Lanka{" "}
            <span className="vt-section__title-highlight">Taxi Service</span>
          </h2>
          <div className="vt-section__search-bar">
            <span className="vt-section__search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              className="vt-section__search-input"
              type="search"
              placeholder="Search"
              aria-label="Search taxi services"
            />
          </div>
        </div>

        <div className="vt-cards__track">
          {taxiVisible.map((card) => (
            <div className="vt-card" key={card.id}>
              <div className="vt-card__img-wrap">
                {/* add images: Card image set via backgroundImage */}
                <div
                  className="vt-card__img"
                  style={{ backgroundImage: `url(${card.image})` }}
                  role="img"
                  aria-label={card.title}
                />
              </div>
              <div className="vt-card__body">
                <h3 className="vt-card__title">{card.title}</h3>
                <h4 className="vt-card__subtitle">{card.description}</h4>
                <a href={card.readMore} className="vt-card__readmore">
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="vt-cards__nav">
          <button
            className="vt-cards__arrow vt-cards__arrow--prev"
            onClick={() => {
              taxi.prev();
              taxi.resetTimer();
            }}
            aria-label="Previous taxi cards"
          >
            &#8249;
          </button>
          <div className="vt-cards__dots" role="tablist">
            {Array.from({ length: taxi.maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                className={`vt-cards__dot${i === taxi.page ? " vt-cards__dot--active" : ""}`}
                onClick={() => {
                  taxi.goTo(i);
                  taxi.resetTimer();
                }}
                aria-label={`Go to page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
          <button
            className="vt-cards__arrow vt-cards__arrow--next"
            onClick={() => {
              taxi.next();
              taxi.resetTimer();
            }}
            aria-label="Next taxi cards"
          >
            &#8250;
          </button>
        </div>
      </section>

      {/* ── Premium Colombo Airport Transfers Section ───────────────────── */}
      <section className="vt-section vt-airport" aria-label="Airport Transfers">
        <div className="vt-airport__header">
          <h2 className="vt-airport__title">
            Premium Colombo{" "}
            <span className="vt-airport__title-highlight">
              Airport Transfers
            </span>
          </h2>
          <p className="vt-airport__subtitle">
            Professional{" "}
            <span className="vt-airport__subtitle-highlight">
              Airport Pickup &amp; Drop
            </span>{" "}
            Service in Colombo
          </p>
        </div>

        <div className="vt-airport__grid">
          {/* Pickup Card */}
          <div className="vt-airport__card">
            <div className="vt-airport__card-img-wrap">
              {/* add images: Replace with actual pickup service image */}
              <div
                className="vt-airport__card-img"
                style={{ backgroundImage: "url(/assets/airport/pickup.jpg)" }}
                role="img"
                aria-label="Airport Pickup"
              />
              <div className="vt-airport__card-badge">Airport Pickup</div>
            </div>
            <div className="vt-airport__card-body">
              <h3 className="vt-airport__card-title">Airport Pickup</h3>
              <p className="vt-airport__card-desc">
                Experience punctual and stress-free consultation to your journey
                with our customized airport pickup service. We monitor your
                flight in real time to ensure your driver is waiting at the
                arrivals terminal, regardless of the delay. Enjoy a comfortable,
                air-conditioned journey to your final destination in a vehicle
                tailored to your group size. No hidden costs, no waiting, just a
                reliable, anxiety-free start to your tropical adventure here in
                the wonderful land below.
              </p>
              <a href="#" className="vt-airport__card-btn">
                Read More
              </a>
            </div>
          </div>

          {/* Drop Card */}
          <div className="vt-airport__card">
            <div className="vt-airport__card-img-wrap">
              {/* add images: Replace with actual drop service image */}
              <div
                className="vt-airport__card-img"
                style={{ backgroundImage: "url(/assets/airport/drop.jpg)" }}
                role="img"
                aria-label="Airport Drop"
              />
              <div className="vt-airport__card-badge">Airport Drop</div>
            </div>
            <div className="vt-airport__card-body">
              <h3 className="vt-airport__card-title">Airport Drop</h3>
              <p className="vt-airport__card-desc">
                Ensure a punctual and stress-free conclusion to your journey
                with our dedicated airport drop service. We plan your route and
                schedule so you'll be there with plenty of time for check-in.
                Relax in our air-conditioned, air-conditioned vehicles while we
                handle the drive. Your driver will monitor traffic and take
                alternate routes if needed. Simply sit back and let us make your
                taxi ride in Sri Lanka absolutely memorable.
              </p>
              <a href="#" className="vt-airport__card-btn">
                Read More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Exclusive Rides CTA Section ──────────────────────────────────── */}
      <section className="vt-section vt-exclusive" aria-label="Exclusive Rides">
        <div className="vt-exclusive__header">
          <p className="vt-exclusive__looking">Looking for an</p>
          <h2 className="vt-exclusive__title">
            Exclusive Rides for the Ultimate Island
            <br />
            Adventure ?
          </h2>
          <p className="vt-exclusive__noproblem">No Problem</p>
        </div>

        {/* Feature cards auto-slideshow */}
        <div className="vt-exclusive__track">
          {featVisible.map((f) => (
            <div className="vt-exclusive__card" key={f.id}>
              <span className="vt-exclusive__card-icon" aria-hidden="true">
                {f.icon}
              </span>
              <h3 className="vt-exclusive__card-label">{f.label}</h3>
              <p className="vt-exclusive__card-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="vt-cards__nav">
          <button
            className="vt-cards__arrow vt-cards__arrow--prev"
            onClick={() => {
              feat.prev();
              feat.resetTimer();
            }}
            aria-label="Previous features"
          >
            &#8249;
          </button>
          <div className="vt-cards__dots" role="tablist">
            {Array.from({ length: feat.maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                className={`vt-cards__dot${i === feat.page ? " vt-cards__dot--active" : ""}`}
                onClick={() => {
                  feat.goTo(i);
                  feat.resetTimer();
                }}
                aria-label={`Go to feature page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
          <button
            className="vt-cards__arrow vt-cards__arrow--next"
            onClick={() => {
              feat.next();
              feat.resetTimer();
            }}
            aria-label="Next features"
          >
            &#8250;
          </button>
        </div>
      </section>

      {/* ── Tour Section ─────────────────────────────────────────────────── */}
      <section className="vt-section vt-tour" aria-label="Tour">
        <div className="vt-section__header">
          <h2 className="vt-section__title vt-section__title--dark">Tour</h2>
          <div className="vt-section__search-bar">
            <span className="vt-section__search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              className="vt-section__search-input"
              type="search"
              placeholder="Search"
              aria-label="Search tours"
            />
          </div>
        </div>

        <div className="vt-cards__track vt-cards__track--two-row">
          {tourVisible.map((card) => (
            <div className="vt-card" key={card.id}>
              <div className="vt-card__img-wrap">
                {/* add images: Tour card image set via backgroundImage */}
                <div
                  className="vt-card__img"
                  style={{ backgroundImage: `url(${card.image})` }}
                  role="img"
                  aria-label={card.title}
                />
              </div>
              <div className="vt-card__body">
                <h3 className="vt-card__title">{card.title}</h3>
                <h4 className="vt-card__subtitle">{card.description}</h4>
                <a href={card.readMore} className="vt-card__readmore">
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="vt-cards__nav">
          <button
            className="vt-cards__arrow vt-cards__arrow--prev"
            onClick={() => {
              tour.prev();
              tour.resetTimer();
            }}
            aria-label="Previous tour cards"
          >
            &#8249;
          </button>
          <div className="vt-cards__dots" role="tablist">
            {Array.from({ length: tour.maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                className={`vt-cards__dot${i === tour.page ? " vt-cards__dot--active" : ""}`}
                onClick={() => {
                  tour.goTo(i);
                  tour.resetTimer();
                }}
                aria-label={`Go to tour page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
          <button
            className="vt-cards__arrow vt-cards__arrow--next"
            onClick={() => {
              tour.next();
              tour.resetTimer();
            }}
            aria-label="Next tour cards"
          >
            &#8250;
          </button>
        </div>
      </section>
    </>
  );
}
