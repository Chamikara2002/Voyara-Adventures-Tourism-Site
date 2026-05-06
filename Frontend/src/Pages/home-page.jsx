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
    image: "/assets/taxi/colombo.jpg",       // add images
    title: "Colombo Taxi Service",
    readMore: "#",
  },
  {
    id: 2,
    image: "/assets/taxi/homagama.jpg",      // add images
    title: "Homagama Taxi Service",
    readMore: "#",
  },
  {
    id: 3,
    image: "/assets/taxi/kelaniya.jpg",      // add images
    title: "Kelaniya Taxi Service",
    readMore: "#",
  },
  {
    id: 4,
    image: "/assets/taxi/anuradhapura.jpg",  // add images
    title: "Anuradhapura Taxi Service",
    readMore: "#",
  },
  {
    id: 5,
    image: "/assets/taxi/polonnaruwa.jpg",   // add images
    title: "Polonnaruwa Taxi Service",
    readMore: "#",
  },
  {
    id: 6,
    image: "/assets/taxi/jaffna.jpg",        // add images
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
    image: "/assets/tours/homagama.jpg",     // add images
    title: "Homagama Taxi Service",
    readMore: "#",
  },
  {
    id: 2,
    image: "/assets/tours/kelaniya.jpg",     // add images
    title: "Kelaniya Taxi Service",
    readMore: "#",
  },
  {
    id: 3,
    image: "/assets/tours/anuradhapura.jpg", // add images
    title: "Anuradhapura Taxi Service",
    readMore: "#",
  },
  {
    id: 4,
    image: "/assets/tours/polonnaruwa.jpg",  // add images
    title: "Polonnaruwa Taxi Service",
    readMore: "#",
  },
  {
    id: 5,
    image: "/assets/tours/jaffna.jpg",       // add images
    title: "Jaffna Taxi Service",
    readMore: "#",
  },
  {
    id: 6,
    image: "/assets/tours/galle.jpg",        // add images
    title: "Galle Tour Service",
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

// ── Itinerary Cards — managed by Super Admin ──────────────────────────────
// add images: Replace `image` values with actual itinerary card images (recommended 800×600px)
// Super Admin: Add/remove objects here to update what customers see.
const ITINERARY_CARDS = [
  {
    id: 1,
    image: "/assets/itineraries/adventure.jpg",   // add images
    title: "The Adventure Capital",
    desc: "Nestled along the scenic Kelani River, Kitulgala is the adventure destination for thrill-seekers. This hub of adrenaline activities includes white-water rafting, offering a often-overlooked blend of natural beauty and excitement. Discover the hidden side of Sri Lanka in this adventure haven.",
  },
  {
    id: 2,
    image: "/assets/itineraries/shores.jpg",      // add images
    title: "Sea-Kissed Shores & Turquoise Horizons",
    desc: "Sri Lanka's coastline is a breathtaking tapestry of pristine sands and turquoise waters. From the sun-drenched beaches of Mirissa to the surf paradise of Arugam Bay, our itineraries offer a slice of coastal beauty to savour. Discover secluded coves, vibrant coral reef snorkel spots and cultural fishing villages that make the Sri Lankan coastal experience truly unforgettable.",
  },
  {
    id: 3,
    image: "/assets/itineraries/highlands.jpg",   // add images
    title: "Misty Highland Escapes",
    desc: "Journey through emerald tea estates and mist-laden mountains in Sri Lanka's stunning hill country. Experience the cool climate of Nuwara Eliya, the cascading waterfalls of Ella, and the ancient rock fortress of Sigiriya on a curated highland adventure.",
  },
  {
    id: 4,
    image: "/assets/itineraries/wildlife.jpg",    // add images
    title: "Wildlife & Safari Wonders",
    desc: "Embark on unforgettable wildlife encounters across Sri Lanka's legendary national parks. Spot leopards at Yala, elephants at Minneriya, and whales off the coast of Mirissa. Every safari is expertly guided and tailored to your group.",
  },
];

// ── Collect Moments Slide Images — managed by Super Admin ─────────────────
// add images: Replace `image` values (recommended 400×300px)
const MOMENTS_IMAGES = [
  { id: 1, image: "/assets/moments/img1.jpg", alt: "Sri Lanka landscape 1" }, // add images
  { id: 2, image: "/assets/moments/img2.jpg", alt: "Sri Lanka landscape 2" }, // add images
  { id: 3, image: "/assets/moments/img3.jpg", alt: "Sri Lanka landscape 3" }, // add images
  { id: 4, image: "/assets/moments/img4.jpg", alt: "Sri Lanka landscape 4" }, // add images
  { id: 5, image: "/assets/moments/img5.jpg", alt: "Sri Lanka landscape 5" }, // add images
  { id: 6, image: "/assets/moments/img6.jpg", alt: "Sri Lanka landscape 6" }, // add images
];

// ── "Everything You Need to Know" Items — managed by Super Admin ──────────
// Super Admin: Add/remove/edit items. layout: "text-right" | "text-left" | "banner" | "image-right"
const ENYTK_ITEMS = [
  {
    id: 1,
    layout: "text-right",
    image: "/assets/enytk/item1.jpg",           // add images
    title: "Everything You Need to Know",
    desc: "Experience the true essence of paradise with our premier island-wide tour services, where every mile is crafted for your comfort and wonder. From the golden southern coasts to the rain-covered central highlands, we provide more than just a destination. We offer a seamless, worry-free immersion into the heart of Sri Lanka. With our dedicated 24/7 questions and local expertise, you can trust us to handle every detail of your journey — safe, punctual, and premium travel experiences that capture the hidden beauty of our island.",
    readMore: "#",
  },
  {
    id: 2,
    layout: "text-left",
    image: "/assets/enytk/item2.jpg",           // add images
    title: "Everything You Need to Know",
    desc: "Experience the true essence of paradise with our premier island-wide tour services, where every mile is crafted for your comfort and wonder. From the golden southern coasts to the rain-covered central highlands, we provide more than just a destination. We offer a seamless, worry-free immersion into the heart of Sri Lanka. With our dedicated 24/7 questions and local expertise.",
    readMore: "#",
  },
  {
    id: 3,
    layout: "banner",
    image: "/assets/enytk/banner.jpg",          // add images
    title: "Everything You Need to Know",
    subtitle: "Experience the true essence of paradise with our premier island-wide tour services.",
  },
];

// ── Sri Lanka Tour & About US — managed by Super Admin ────────────────────
const SL_TOUR = {
  image: "/assets/sltour/main.jpg",             // add images
  desc: "Experience the true essence of paradise with our premier island-wide tour services, where every mile is crafted for your comfort and wonder. From the golden southern coasts to the rain-covered central highlands, we provide more than just a destination. We offer a seamless, worry-free immersion into the heart of Sri Lanka. With our dedicated 24/7 questions and local expertise, you can trust us to handle every detail of your journey. We offer a seamless, worry-free immersion into the heart of Sri Lanka. With our dedicated 24/7 questions and local expertise, you can trust us to handle every detail of your journey that capture the hidden beauty of our island.",
  readMore: "#",
};

const ABOUT_US = {
  image: "/assets/about/main.jpg",             // add images
  desc: "Experience the true essence of paradise with our premier island-wide tour services, where every mile is crafted for your comfort and wonder. From the golden southern coasts to the rain-covered central highlands, we provide more than just a destination. We offer a seamless, worry-free immersion into the heart of Sri Lanka. With our dedicated 24/7 questions and local expertise, you can trust us to handle every detail of your journey. We offer a seamless, worry-free immersion into the heart of Sri Lanka. With our dedicated 24/7 questions and local expertise, you can trust us to handle every detail of your journey that capture the hidden beauty of our island.",
  readMore: "#",
};

const DISCOVER_SOUL = {
  image: "/assets/soul/main.jpg",              // add images
  desc: "Since our journey began, Voyara Adventures has been more than just a transport service — we are your dedicated curators of authentic Sri Lankan experiences. Sri Manning Boot appetites with professional reliability, we ensure that every mile you travel always delivers golden blend in skills, comfortably, and design memorably. From the bustling streets of Colombo to the hidden coastal gems, let us handle the journey while you focus on creating memories that last a lifetime.",
  seeMore: "#",
};

// ── Voyara Tales Blog Cards — managed by Super Admin ─────────────────────
// add images: Replace `image` values (recommended 600×400px)
const VOYARA_TALES = [
  {
    id: 1,
    image: "/assets/tales/tale1.jpg",           // add images
    caption: "Inspiring travel stories",
  },
  {
    id: 2,
    image: "/assets/tales/tale2.jpg",           // add images
    caption: "Inspiring related adventures",
  },
  {
    id: 3,
    image: "/assets/tales/tale3.jpg",           // add images
    caption: "Inspiring travel stories",
  },
];

// ── Traveller Reviews — pulled from Packages page comments ────────────────
// Super Admin / Packages page: Travellers submit comments there;
// the approved reviews appear here automatically.
// For wiring to a real backend, replace this array with an API fetch.
const TRAVELLER_REVIEWS = [
  {
    id: 1,
    avatar: "/assets/avatars/avatar1.jpg",      // add images — traveller profile photo
    name: "Johna Mundo",
    comment: "Great Driving and visited awesome beautiful places.",
    date: "2026-05-26",
    rating: 5,
  },
  {
    id: 2,
    avatar: "/assets/avatars/avatar2.jpg",      // add images
    name: "Johna Mundo",
    comment: "Great Driving and visited awesome beautiful places.",
    date: "2026-05-26",
    rating: 5,
  },
  {
    id: 3,
    avatar: "/assets/avatars/avatar3.jpg",      // add images
    name: "Johna Mundo",
    comment: "Great Driving and visited awesome beautiful places.",
    date: "2026-05-26",
    rating: 4,
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

  const next = useCallback(() => setPage((p) => (p >= maxPage ? 0 : p + 1)), [maxPage]);
  const prev = useCallback(() => setPage((p) => (p <= 0 ? maxPage : p - 1)), [maxPage]);
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

  useEffect(() => { currentRef.current = current; }, [current]);

  const advance = useCallback((dir) => {
    setDirection(dir);
    setCurrent((prev) => dir === "next" ? (prev + 1) % total : (prev - 1 + total) % total);
  }, [total]);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => advance("next"), AUTOPLAY_DELAY);
  }, [advance]);

  useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current); }, [resetTimer]);

  const goToNext = useCallback(() => { advance("next"); resetTimer(); }, [advance, resetTimer]);
  const goToPrev = useCallback(() => { advance("prev"); resetTimer(); }, [advance, resetTimer]);
  const goTo = useCallback((index) => {
    const dir = index > currentRef.current ? "next" : "prev";
    setDirection(dir); setCurrent(index); resetTimer();
  }, [resetTimer]);

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
  const taxi = useCardSlider(TAXI_CARDS.length, CARDS_PER_PAGE, CARD_AUTOPLAY_MS);
  const taxiVisible = TAXI_CARDS.slice(taxi.page * CARDS_PER_PAGE, taxi.page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  // ── Tour Card Slider ──────────────────────────────────────────────────────
  // Tour shows 2 rows × 3 cols = 6 cards per page
  const TOUR_PER_PAGE = 6;
  const tour = useCardSlider(TOUR_CARDS.length, TOUR_PER_PAGE, CARD_AUTOPLAY_MS);
  const tourVisible = TOUR_CARDS.slice(tour.page * TOUR_PER_PAGE, tour.page * TOUR_PER_PAGE + TOUR_PER_PAGE);

  // ── Feature Slider ────────────────────────────────────────────────────────
  const feat = useCardSlider(FEATURE_SLIDES.length, 3, CARD_AUTOPLAY_MS);
  const featVisible = FEATURE_SLIDES.slice(feat.page * 3, feat.page * 3 + 3);

  // ── Itinerary Slider (2 cards visible at a time) ──────────────────────────
  const itin = useCardSlider(ITINERARY_CARDS.length, 2, CARD_AUTOPLAY_MS);
  const itinVisible = ITINERARY_CARDS.slice(itin.page * 2, itin.page * 2 + 2);

  // ── Moments Image Slider (5 images visible — scrolling strip) ─────────────
  const mom = useCardSlider(MOMENTS_IMAGES.length, 5, 2500);
  const momVisible = MOMENTS_IMAGES.slice(mom.page * 5, mom.page * 5 + 5);

  // ── Voyara Tales Slider (3 cards) ─────────────────────────────────────────
  const tales = useCardSlider(VOYARA_TALES.length, 3, CARD_AUTOPLAY_MS);
  const talesVisible = VOYARA_TALES.slice(tales.page * 3, tales.page * 3 + 3);

  // ── Reviews Slider (3 per page, wraps from Packages comments) ────────────
  const reviews = useCardSlider(TRAVELLER_REVIEWS.length, 3, 4000);
  const reviewsVisible = TRAVELLER_REVIEWS.slice(reviews.page * 3, reviews.page * 3 + 3);

  // ── Apply data-bg attributes as CSS backgroundImage (avoids inline styles) ──
  useEffect(() => {
    const els = document.querySelectorAll("[data-bg]");
    els.forEach((el) => {
      el.style.backgroundImage = `url(${el.getAttribute("data-bg")})`;
    });
  });

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
                i === current && direction === "next" ? "vt-home__slide--enter-next" : "",
                i === current && direction === "prev" ? "vt-home__slide--enter-prev" : "",
              ].filter(Boolean).join(" ")}
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
            <span className="vt-home__heading-highlight">{slide.headingHighlight}</span>
          </h1>
          <p className="vt-home__subtext">{slide.subtext}</p>
          <a href="#" className="vt-home__cta" aria-label={slide.btnLabel}>
            <span className="vt-home__cta-icon" aria-hidden="true">{slide.btnIcon}</span>
            {slide.btnLabel}
          </a>
        </div>

        <button className="vt-home__arrow vt-home__arrow--prev" onClick={goToPrev} aria-label="Previous slide">
          <span aria-hidden="true">&#8249;</span>
        </button>
        <button className="vt-home__arrow vt-home__arrow--next" onClick={goToNext} aria-label="Next slide">
          <span aria-hidden="true">&#8250;</span>
        </button>

        <div className="vt-home__dots" role="tablist" aria-label="Slide indicators">
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
          <span className="vt-home__counter-current">{String(current + 1).padStart(2, "0")}</span>
          <span className="vt-home__counter-sep">/</span>
          <span className="vt-home__counter-total">{String(total).padStart(2, "0")}</span>
        </div>
      </section>

      {/* ── Premium Lanka Taxi Service Section ─────────────────────────── */}
      <section className="vt-section vt-taxi" aria-label="Premium Lanka Taxi Service">
        <div className="vt-section__header">
          <h2 className="vt-section__title">
            Premium Lanka <span className="vt-section__title-highlight">Taxi Service</span>
          </h2>
          <div className="vt-section__search-bar">
            <span className="vt-section__search-icon" aria-hidden="true">🔍</span>
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
                <a href={card.readMore} className="vt-card__readmore">Read More</a>
              </div>
            </div>
          ))}
        </div>

        <div className="vt-cards__nav">
          <button className="vt-cards__arrow vt-cards__arrow--prev" onClick={() => { taxi.prev(); taxi.resetTimer(); }} aria-label="Previous taxi cards">
            &#8249;
          </button>
          <div className="vt-cards__dots" role="tablist">
            {Array.from({ length: taxi.maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                className={`vt-cards__dot${i === taxi.page ? " vt-cards__dot--active" : ""}`}
                onClick={() => { taxi.goTo(i); taxi.resetTimer(); }}
                aria-label={`Go to page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
          <button className="vt-cards__arrow vt-cards__arrow--next" onClick={() => { taxi.next(); taxi.resetTimer(); }} aria-label="Next taxi cards">
            &#8250;
          </button>
        </div>
      </section>

      {/* ── Premium Colombo Airport Transfers Section ───────────────────── */}
      <section className="vt-section vt-airport" aria-label="Airport Transfers">
        <div className="vt-airport__header">
          <h2 className="vt-airport__title">
            Premium Colombo <span className="vt-airport__title-highlight">Airport Transfers</span>
          </h2>
          <p className="vt-airport__subtitle">
            Professional <span className="vt-airport__subtitle-highlight">Airport Pickup &amp; Drop</span> Service in Colombo
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
                Experience punctual and stress-free consultation to your journey with our customized airport pickup service. We monitor your flight in real time to ensure your driver is waiting at the arrivals terminal, regardless of the delay. Enjoy a comfortable, air-conditioned journey to your final destination in a vehicle tailored to your group size. No hidden costs, no waiting, just a reliable, anxiety-free start to your tropical adventure here in the wonderful land below.
              </p>
              <a href="#" className="vt-airport__card-btn">Read More</a>
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
                Ensure a punctual and stress-free conclusion to your journey with our dedicated airport drop service. We plan your route and schedule so you'll be there with plenty of time for check-in. Relax in our air-conditioned, air-conditioned vehicles while we handle the drive. Your driver will monitor traffic and take alternate routes if needed. Simply sit back and let us make your taxi ride in Sri Lanka absolutely memorable.
              </p>
              <a href="#" className="vt-airport__card-btn">Read More</a>
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
            <br />Adventure ?
          </h2>
          <p className="vt-exclusive__noproblem">No Problem</p>
        </div>

        {/* Feature cards auto-slideshow */}
        <div className="vt-exclusive__track">
          {featVisible.map((f) => (
            <div className="vt-exclusive__card" key={f.id}>
              <span className="vt-exclusive__card-icon" aria-hidden="true">{f.icon}</span>
              <h3 className="vt-exclusive__card-label">{f.label}</h3>
              <p className="vt-exclusive__card-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="vt-cards__nav">
          <button className="vt-cards__arrow vt-cards__arrow--prev" onClick={() => { feat.prev(); feat.resetTimer(); }} aria-label="Previous features">
            &#8249;
          </button>
          <div className="vt-cards__dots" role="tablist">
            {Array.from({ length: feat.maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                className={`vt-cards__dot${i === feat.page ? " vt-cards__dot--active" : ""}`}
                onClick={() => { feat.goTo(i); feat.resetTimer(); }}
                aria-label={`Go to feature page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
          <button className="vt-cards__arrow vt-cards__arrow--next" onClick={() => { feat.next(); feat.resetTimer(); }} aria-label="Next features">
            &#8250;
          </button>
        </div>
      </section>

      {/* ── Tour Section ─────────────────────────────────────────────────── */}
      <section className="vt-section vt-tour" aria-label="Tour">
        <div className="vt-section__header">
          <h2 className="vt-section__title vt-section__title--dark">Tour</h2>
          <div className="vt-section__search-bar">
            <span className="vt-section__search-icon" aria-hidden="true">🔍</span>
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
                <a href={card.readMore} className="vt-card__readmore">Read More</a>
              </div>
            </div>
          ))}
        </div>

        <div className="vt-cards__nav">
          <button className="vt-cards__arrow vt-cards__arrow--prev" onClick={() => { tour.prev(); tour.resetTimer(); }} aria-label="Previous tour cards">
            &#8249;
          </button>
          <div className="vt-cards__dots" role="tablist">
            {Array.from({ length: tour.maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                className={`vt-cards__dot${i === tour.page ? " vt-cards__dot--active" : ""}`}
                onClick={() => { tour.goTo(i); tour.resetTimer(); }}
                aria-label={`Go to tour page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
          <button className="vt-cards__arrow vt-cards__arrow--next" onClick={() => { tour.next(); tour.resetTimer(); }} aria-label="Next tour cards">
            &#8250;
          </button>
        </div>
      </section>
      {/* ── Unforgettable Personalized Itineraries Section ──────────────── */}
      <section className="vt-section vt-itin" aria-label="Unforgettable Personalized Itineraries">
        <div className="vt-itin__header">
          <h2 className="vt-itin__title">
            Unforgettable, Personalized{" "}
            <span className="vt-itin__title-highlight">Itineraries</span>
          </h2>
        </div>

        <div className="vt-itin__track">
          {itinVisible.map((card) => (
            <div className="vt-itin__card" key={card.id}>
              <div className="vt-itin__card-img-wrap">
                {/* add images: itinerary card image via CSS background */}
                <div
                  className="vt-itin__card-img"
                  data-bg={card.image}
                  role="img"
                  aria-label={card.title}
                />
              </div>
              <div className="vt-itin__card-body">
                <h3 className="vt-itin__card-title">{card.title}</h3>
                <p className="vt-itin__card-desc">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="vt-cards__nav">
          <button
            className="vt-cards__arrow vt-cards__arrow--prev"
            onClick={() => { itin.prev(); itin.resetTimer(); }}
            aria-label="Previous itineraries"
          >
            &#8249;
          </button>
          <div className="vt-cards__dots" role="tablist">
            {Array.from({ length: itin.maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                className={`vt-cards__dot${i === itin.page ? " vt-cards__dot--active" : ""}`}
                onClick={() => { itin.goTo(i); itin.resetTimer(); }}
                aria-label={`Go to itinerary page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
          <button
            className="vt-cards__arrow vt-cards__arrow--next"
            onClick={() => { itin.next(); itin.resetTimer(); }}
            aria-label="Next itineraries"
          >
            &#8250;
          </button>
        </div>
      </section>

      {/* ── Collect Moments Section ───────────────────────────────────────── */}
      <section className="vt-section vt-moments" aria-label="Collect Moments Not Just Miles">
        <div className="vt-moments__header">
          <h2 className="vt-moments__title">
            Collect Moments,{" "}
            <span className="vt-moments__title-highlight">Not Just Miles.</span>
          </h2>
          <p className="vt-moments__sub">
            Enjoy Sri Lanka's breathtaking landscapes in authentic local encounters and help you explore the wonders of Sri Lanka and preserve every memory forever.
          </p>
        </div>

        {/* Auto-scrolling image strip */}
        <div className="vt-moments__strip" aria-label="Moments gallery">
          {momVisible.map((img) => (
            <div className="vt-moments__img-wrap" key={img.id}>
              {/* add images: moment image via CSS background */}
              <div
                className="vt-moments__img"
                data-bg={img.image}
                role="img"
                aria-label={img.alt}
              />
            </div>
          ))}
        </div>

        <div className="vt-cards__nav">
          <button
            className="vt-cards__arrow vt-cards__arrow--prev"
            onClick={() => { mom.prev(); mom.resetTimer(); }}
            aria-label="Previous moments"
          >
            &#8249;
          </button>
          <div className="vt-cards__dots" role="tablist">
            {Array.from({ length: mom.maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                className={`vt-cards__dot${i === mom.page ? " vt-cards__dot--active" : ""}`}
                onClick={() => { mom.goTo(i); mom.resetTimer(); }}
                aria-label={`Go to moments page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
          <button
            className="vt-cards__arrow vt-cards__arrow--next"
            onClick={() => { mom.next(); mom.resetTimer(); }}
            aria-label="Next moments"
          >
            &#8250;
          </button>
        </div>
      </section>

      {/* ── Everything You Need to Know Section ──────────────────────────── */}
      <section className="vt-section vt-enytk" aria-label="Everything You Need to Know">

        {/* Sri Lanka Tour — image left, text right */}
        <div className="vt-enytk__row vt-enytk__row--img-left">
          <div className="vt-enytk__img-col">
            {/* add images: Sri Lanka Tour main image */}
            <div
              className="vt-enytk__img"
              data-bg={SL_TOUR.image}
              role="img"
              aria-label="Sri Lanka Tour"
            />
          </div>
          <div className="vt-enytk__text-col">
            <h2 className="vt-enytk__row-title">
              Sri Lanka <span className="vt-enytk__row-title-highlight">Tour</span>
            </h2>
            <p className="vt-enytk__row-desc">{SL_TOUR.desc}</p>
            <a href={SL_TOUR.readMore} className="vt-enytk__row-btn">Read More</a>
          </div>
        </div>

        {/* Everything You Need to Know items */}
        {ENYTK_ITEMS.map((item) => {
          if (item.layout === "text-right") {
            return (
              <div className="vt-enytk__row vt-enytk__row--img-left" key={item.id}>
                <div className="vt-enytk__img-col">
                  {/* add images: ENYTK item image */}
                  <div
                    className="vt-enytk__img"
                    data-bg={item.image}
                    role="img"
                    aria-label={item.title}
                  />
                </div>
                <div className="vt-enytk__text-col">
                  <h3 className="vt-enytk__item-title">{item.title}</h3>
                  <p className="vt-enytk__item-desc">{item.desc}</p>
                  <a href={item.readMore} className="vt-enytk__row-btn">Read More</a>
                </div>
              </div>
            );
          }
          if (item.layout === "text-left") {
            return (
              <div className="vt-enytk__row vt-enytk__row--img-right" key={item.id}>
                <div className="vt-enytk__text-col">
                  <h3 className="vt-enytk__item-title">{item.title}</h3>
                  <p className="vt-enytk__item-desc">{item.desc}</p>
                  <a href={item.readMore} className="vt-enytk__row-btn">Read More</a>
                </div>
                <div className="vt-enytk__img-col">
                  {/* add images: ENYTK item image */}
                  <div
                    className="vt-enytk__img"
                    data-bg={item.image}
                    role="img"
                    aria-label={item.title}
                  />
                </div>
              </div>
            );
          }
          if (item.layout === "banner") {
            return (
              <div className="vt-enytk__banner" key={item.id}>
                {/* add images: Banner background image */}
                <div
                  className="vt-enytk__banner-bg"
                  data-bg={item.image}
                  role="img"
                  aria-label={item.title}
                />
                <div className="vt-enytk__banner-overlay" aria-hidden="true" />
                <div className="vt-enytk__banner-content">
                  <h3 className="vt-enytk__banner-title">{item.title}</h3>
                  <p className="vt-enytk__banner-sub">{item.subtitle}</p>
                </div>
              </div>
            );
          }
          return null;
        })}

        {/* About US — image right, text left */}
        <div className="vt-enytk__row vt-enytk__row--img-right">
          <div className="vt-enytk__text-col">
            <h2 className="vt-enytk__row-title">
              About <span className="vt-enytk__row-title-highlight">US</span>
            </h2>
            <p className="vt-enytk__row-desc">{ABOUT_US.desc}</p>
            <a href={ABOUT_US.readMore} className="vt-enytk__row-btn">Read More</a>
          </div>
          <div className="vt-enytk__img-col">
            {/* add images: About US image */}
            <div
              className="vt-enytk__img"
              data-bg={ABOUT_US.image}
              role="img"
              aria-label="About Us"
            />
          </div>
        </div>

        {/* Discover the Soul of Sri Lanka — full-width CTA */}
        <div className="vt-enytk__soul">
          <div className="vt-enytk__soul-text">
            <h2 className="vt-enytk__soul-title">
              Discover the Soul of{" "}
              <span className="vt-enytk__soul-highlight">Sri Lanka</span>
            </h2>
            <p className="vt-enytk__soul-desc">{DISCOVER_SOUL.desc}</p>
            <a href={DISCOVER_SOUL.seeMore} className="vt-enytk__soul-btn">See More</a>
          </div>
          <div className="vt-enytk__soul-img-col">
            {/* add images: Discover soul image */}
            <div
              className="vt-enytk__soul-img"
              data-bg={DISCOVER_SOUL.image}
              role="img"
              aria-label="Discover the Soul of Sri Lanka"
            />
          </div>
        </div>
      </section>

      {/* ── Voyara Tales Section ──────────────────────────────────────────── */}
      <section className="vt-section vt-tales" aria-label="Voyara Tales">
        <div className="vt-tales__header">
          <h2 className="vt-tales__title">Voyara Tales</h2>
          <p className="vt-tales__sub">Inspiring travel stories, local events, and expert tips for your next great adventure.</p>
        </div>

        <div className="vt-tales__track">
          {talesVisible.map((tale) => (
            <div className="vt-tales__card" key={tale.id}>
              <div className="vt-tales__card-img-wrap">
                {/* add images: Tale card image */}
                <div
                  className="vt-tales__card-img"
                  data-bg={tale.image}
                  role="img"
                  aria-label={tale.caption}
                />
              </div>
              <p className="vt-tales__card-caption">{tale.caption}</p>
            </div>
          ))}
        </div>

        <div className="vt-cards__nav">
          <button
            className="vt-cards__arrow vt-cards__arrow--prev"
            onClick={() => { tales.prev(); tales.resetTimer(); }}
            aria-label="Previous tales"
          >
            &#8249;
          </button>
          <div className="vt-cards__dots" role="tablist">
            {Array.from({ length: tales.maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                className={`vt-cards__dot${i === tales.page ? " vt-cards__dot--active" : ""}`}
                onClick={() => { tales.goTo(i); tales.resetTimer(); }}
                aria-label={`Go to tales page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
          <button
            className="vt-cards__arrow vt-cards__arrow--next"
            onClick={() => { tales.next(); tales.resetTimer(); }}
            aria-label="Next tales"
          >
            &#8250;
          </button>
        </div>
      </section>

      {/* ── Memories Shared by Our Travelers Section ──────────────────────── */}
      {/* Reviews are pulled from the Packages page traveller comment section */}
      <section className="vt-section vt-reviews" aria-label="Memories Shared by Our Travelers">
        <div className="vt-reviews__header">
          <h2 className="vt-reviews__title">
            Memories Shared by{" "}
            <span className="vt-reviews__title-highlight">Our Travelers</span>
          </h2>
        </div>

        <div className="vt-reviews__track">
          {reviewsVisible.map((rev) => (
            <div className="vt-reviews__card" key={rev.id}>
              <div className="vt-reviews__avatar-wrap">
                {/* add images: Traveller avatar from Packages page comment */}
                <div
                  className="vt-reviews__avatar"
                  data-bg={rev.avatar}
                  role="img"
                  aria-label={rev.name}
                />
              </div>
              <div className="vt-reviews__card-body">
                <h4 className="vt-reviews__name">{rev.name}</h4>
                <p className="vt-reviews__comment">{rev.comment}</p>
                <p className="vt-reviews__date">{rev.date}</p>
                <div className="vt-reviews__stars" aria-label={`Rating: ${rev.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <span
                      key={si}
                      className={`vt-reviews__star${si < rev.rating ? " vt-reviews__star--filled" : ""}`}
                      aria-hidden="true"
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="vt-cards__nav">
          <button
            className="vt-cards__arrow vt-cards__arrow--prev"
            onClick={() => { reviews.prev(); reviews.resetTimer(); }}
            aria-label="Previous reviews"
          >
            &#8249;
          </button>
          <div className="vt-cards__dots" role="tablist">
            {Array.from({ length: reviews.maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                className={`vt-cards__dot${i === reviews.page ? " vt-cards__dot--active" : ""}`}
                onClick={() => { reviews.goTo(i); reviews.resetTimer(); }}
                aria-label={`Go to reviews page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
          <button
            className="vt-cards__arrow vt-cards__arrow--next"
            onClick={() => { reviews.next(); reviews.resetTimer(); }}
            aria-label="Next reviews"
          >
            &#8250;
          </button>
        </div>
      </section>
    </>
  );
}