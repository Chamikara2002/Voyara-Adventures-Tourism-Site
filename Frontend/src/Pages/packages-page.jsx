import { useState, useEffect, useRef, useCallback } from "react";
import "../Style/packages-page.css";

// ============================================================
// DATA: FAQ
// ============================================================
const faqs = [
  {
    q: "How do I book a tour with Voyara Adventures?",
    a: "You can easily book through our website form, or contact our 24/7 concierge via WhatsApp for instant confirmation.",
  },
  {
    q: "Are there any hidden costs like highway tolls or parking?",
    a: 'Absolutely not. We practice "Transparent Pricing" — all fuel, highway tolls, and parking fees are included in your initial quote.',
  },
  {
    q: "Can I customize my own itinerary?",
    a: "Yes! We specialize in bespoke travel. Just let us know your interests, and our experts will craft a personalized plan for you.",
  },
  {
    q: "Do you provide child seats for families?",
    a: "Yes, child seats are available upon request to ensure the safety and comfort of your little ones during the journey.",
  },
  {
    q: "What happens if my flight is delayed?",
    a: "No worries. We monitor your flight in real-time. Your driver will be waiting for you at the airport, regardless of the delay.",
  },
];

// ============================================================
// DATA: Provinces (9 provinces)
// ============================================================
const provinces = [
  {
    name: "Western Province",
    img: "/images/provinces/western.jpg",
    desc: "The beating heart of Sri Lanka. From the vibrant streets of Colombo to golden beaches, discover the perfect blend of modern luxury and tropical splendour.",
  },
  {
    name: "Central Province",
    img: "/images/provinces/central.jpg",
    desc: "Step into the sanctuary of the hill country. Known for its misty mountains, lush tea estates and breathtaking Kandy, the home of the Sacred Tooth Relic.",
  },
  {
    name: "Southern Province",
    img: "/images/provinces/southern.jpg",
    desc: "A coastal marvel. Whether it's exploring the Galle Fort in whale watching in Mirissa, the South promises beautiful moments and unforgettable sunlit retreats.",
  },
  {
    name: "North Central Province",
    img: "/images/provinces/northcentral.jpg",
    desc: "The cradle of Sri Lanka's ancient civilization. Wander through the majestic ruins of Anuradhapura and Polonnaruwa, where giant stupas and intricate stone carvings tell the stories of a glorious golden era that shaped the island's heritage.",
  },
  {
    name: "Uva Province",
    img: "/images/provinces/uva.jpg",
    desc: "A land of dramatic landscapes, from iconic waterfalls like Dunhinda to the world-famous Nine Arch Bridge in Ella. Uva is perfect for those seeking scenic train rides, mountain trekking, and the refreshing chill of the highlands.",
  },
  {
    name: "Sabaragamuwa Province",
    img: "/images/provinces/sabaragamuwa.jpg",
    desc: "A region rich in biodiversity and gems. From trekking through the Sinharaja Rainforest to the spiritual pilgrimage of Adam's Peak and the thrill of white-water rafting in Kitulgala, it's a destination for the true adventurer.",
  },
  {
    name: "Northern Province",
    img: "/images/provinces/northern.jpg",
    desc: "Discover a unique cultural landscape characterized by vibrant Hindu temples, historical forts, and untouched islands. The North offers a soulful journey through resilient history and pristine beaches like Casuarina, far off the beaten path.",
  },
  {
    name: "Eastern Province",
    img: "/images/provinces/eastern.jpg",
    desc: "Home to some of the world's best surfing spots and crystal-clear bays. From the sunrise at Arugam Bay to the turquoise waters of Nilaveli, the East is the ultimate destination for water sports and tranquil coastal escapes.",
  },
  {
    name: "North Western Province",
    img: "/images/provinces/northwestern.jpg",
    desc: "A blend of ancient kingdoms and natural wonders. Explore the majestic Yapahuwa Rock Fortress or witness the thrill of dolphin watching in Kalpitiya. It's a region where history meets the untamed beauty of the lagoon.",
  },
];

// ============================================================
// DATA: Bucket List
// ============================================================
const bucketList = [
  {
    title: "Whale Watching",
    img: "/images/bucket/whale-watching.jpg",
    desc: "Set sail into the deep blue Indian Ocean for an unforgettable encounter with the majestic Blue Whales, the largest creatures to ever roam the earth.",
  },
  {
    title: "The Tea Trails",
    img: "/images/bucket/tea-trails.jpg",
    desc: "Travel through endless emerald-green tea estates, visit colonial-style factories, and sip a cup of the world's finest Ceylon Tea in the misty highlands.",
  },
  {
    title: "Temple of the Tooth",
    img: "/images/bucket/temple-tooth.jpg",
    desc: "Immerse yourself in the spiritual heart of the island. A golden-roofed sanctuary housing the sacred tooth relic of the Buddha, surrounded by history and tradition.",
  },
  {
    title: "The Nine Arch Bridge",
    img: "/images/bucket/nine-arch.jpg",
    desc: "Witness the architectural masterpiece of the colonial era. Watch the train curve through the misty tea-covered hills, as it crosses over this iconic stone bridge.",
  },
  {
    title: "The Lion Rock",
    img: "/images/bucket/lion-rock.jpg",
    desc: "Climb the 8th wonder of the world — a magnificent rock fortress rising from the central plains, adorned with ancient frescoes and topped with a palace in the clouds.",
  },
];

// ============================================================
// DATA: Stay in Comfort (hotels)
// ============================================================
const hotelCards = [
  {
    name: "Heritance Kandalama",
    img: "/images/hotels/heritance-kandalama.jpg",
    desc: "A masterpiece of eco-friendly architecture carved into a cliffside. Overlooking the Kandalama Tank and Sigiriya rock, this hotel offers a unique blend of luxury and raw nature.",
  },
  {
    name: "Cinnamon Wild Yala",
    img: "/images/hotels/cinnamon-wild-yala.jpg",
    desc: "Located right on the border of Yala National Park, this resort brings you face-to-face with the wild. Stay in cozy chalets where leopards and elephants roam just outside your doorstep.",
  },
  {
    name: "98 Acres Resort & Spa",
    img: "/images/hotels/98-acres.jpg",
    desc: "Set on a scenic 98-acre tea estate, this boutique hotel offers breathtaking views of the Ella Gap. Its unique chalets made of recyclable materials provide the ultimate highland retreat.",
  },
  {
    name: "Jetwing Lighthouse",
    img: "/images/hotels/jetwing-lighthouse.jpg",
    desc: "A majestic colonial-style hotel perched on the rocky shores of Galle. Designed by the legendary Geoffrey Bawa, it offers world-class service and stunning Indian Ocean sunsets.",
  },
  {
    name: "Anantara Peace Haven",
    img: "/images/hotels/anantara-peace-haven.jpg",
    desc: "Nestled among a coconut plantation on a private stretch of golden beach. This resort is the pinnacle of tropical luxury, featuring world-class spa treatments and private pool villas.",
  },
  {
    name: "Grand Hotel",
    img: "/images/hotels/grand-hotel.jpg",
    desc: "Experience the grandeur of the British colonial era. Surrounded by beautifully manicured gardens and cool misty weather, it's the perfect place for high tea and a cozy, vintage stay.",
  },
];

// ============================================================
// DATA: Ride in Style (vehicles)
// ============================================================
const vehicleCards = [
  {
    name: "Mercedes-Benz S-Class",
    img: "/images/vehicles/mercedes-s-class.jpg",
    tag: "Ultra Luxury",
    desc: "The pinnacle of automotive refinement. Perfect for executive transfers and high-profile arrivals, with a dedicated chauffeur.",
  },
  {
    name: "Toyota HiAce Premium",
    img: "/images/vehicles/hiace-premium.jpg",
    tag: "Group Travel",
    desc: "Spacious, air-conditioned, and perfectly outfitted for family or group adventures across the island.",
  },
  {
    name: "Range Rover Vogue",
    img: "/images/vehicles/range-rover.jpg",
    tag: "Safari Ready",
    desc: "Built for both luxury and rugged terrain. Your ideal companion for national park safaris and highland explorations.",
  },
  {
    name: "BMW 5 Series",
    img: "/images/vehicles/bmw-5-series.jpg",
    tag: "Business Class",
    desc: "Sleek, powerful, and impeccably comfortable. Ideal for corporate clients who demand precision and elegance on the road.",
  },
];

// ============================================================
// DATA: Find Your Perfect Journey
// ============================================================
const journeyCards = [
  {
    title: "The Quick Escape (1 Week Tour)",
    img: "/images/journey/quick-escape.jpg",
    desc: "A compact journey through the heart of Lanka's history and misty mountains.",
  },
  {
    title: "Island Wonders (2 Weeks Tour)",
    img: "/images/journey/island-wonders.jpg",
    desc: "The ultimate Sri Lankan experience covering heritage, wildlife, and golden shores.",
  },
  {
    title: "Tailor-Made Journey (Customize Your Tour)",
    img: "/images/journey/tailor-made.jpg",
    desc: "Can't find the perfect fit? Tell us your dreams, and we'll build a unique itinerary just for you.",
  },
  {
    title: "The Grand Exploration (3-4 Weeks Tour)",
    img: "/images/journey/grand-exploration.jpg",
    desc: "Dive deep into the island's soul. From the vibrant North to the tropical South.",
  },
];

// ============================================================
// DATA: Unique Experiences
// ============================================================
const uniqueExperiences = [
  {
    title: "Sinharaja Rare Biodiversity Trekking.",
    img: "/images/unique/sinharaja.jpg",
    desc: "Explore a UNESCO World Heritage site and a biological goldmine. Discover rare endemic birds, vibrant reptiles, and giant ferns in the last remaining primeval rainforest of Sri Lanka.",
  },
  {
    title: "Mirissa Blue Whale Watching",
    img: "/images/unique/mirissa-whale.jpg",
    desc: "Set sail into the Indian Ocean to witness the largest animal to ever live. Catch a glimpse of majestic Blue Whales and playful dolphins breaching the crystal-clear waters.",
  },
  {
    title: "Ella Nine Arch Bridge Train Spotting.",
    img: "/images/unique/nine-arch-train.jpg",
    desc: 'Walk along the "Bridge in the Clouds." Experience the magic of watching a colonial-era train wind its way through lush green mountains on this stone architectural marvel.',
  },
];

// ============================================================
// HOOK: useSlideshow
// ============================================================
function useSlideshow(total, autoplayMs = 4000) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const go = useCallback((idx) => setCurrent((idx + total) % total), [total]);
  const prev = useCallback(() => go(current - 1), [go, current]);
  const next = useCallback(() => go(current + 1), [go, current]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % total),
      autoplayMs,
    );
    return () => clearInterval(timerRef.current);
  }, [paused, total, autoplayMs]);

  return { current, go, prev, next, setPaused };
}

// ============================================================
// HOOK: useVisibleCount
// Returns 1 on mobile (≤767px), 2 on tablet (768–1023px), 3 on desktop
// ============================================================
function useVisibleCount() {
  const getCount = () => {
    if (window.innerWidth <= 767) return 1;
    if (window.innerWidth <= 1023) return 2;
    return 3;
  };

  const [count, setCount] = useState(getCount);

  useEffect(() => {
    const handler = () => setCount(getCount());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return count;
}

// ============================================================
// MAIN: Packages Page
// ============================================================
export default function Packages() {
  // ----------------------------------------------------------
  // Responsive visible card count
  // ----------------------------------------------------------
  const visibleCount = useVisibleCount();

  // ----------------------------------------------------------
  // SECTION: Provinces — slideshow state (3-up)
  // ----------------------------------------------------------
  const PROVINCES_VISIBLE = visibleCount;
  const provinces_ss = useSlideshow(provinces.length, 4500);

  // Search state
  const [provinceQuery, setProvinceQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Pause slideshow while searching
  useEffect(() => {
    if (provinceQuery.trim()) {
      provinces_ss.setPaused(true);
    } else {
      provinces_ss.setPaused(false);
    }
  }, [provinceQuery]);

  // Filtered provinces for search results
  const filteredProvinces = provinces.filter(
    (p) =>
      p.name.toLowerCase().includes(provinceQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(provinceQuery.toLowerCase()),
  );

  // Voice search handler
  const handleVoiceSearch = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setProvinceQuery(transcript);
    };

    recognition.start();
  }, [isListening]);

  const getVisibleProvinces = () => {
    const items = [];
    for (let i = 0; i < PROVINCES_VISIBLE; i++) {
      items.push(provinces[(provinces_ss.current + i) % provinces.length]);
    }
    return items;
  };

  // ----------------------------------------------------------
  // SECTION: Bucket List — slideshow state (1-up wide card)
  // ----------------------------------------------------------
  const bucket_ss = useSlideshow(bucketList.length, 5000);
  const bucketItem = bucketList[bucket_ss.current];

  // ----------------------------------------------------------
  // SECTION: Stay in Comfort — slideshow state (3-up)
  // ----------------------------------------------------------
  const COMFORT_VISIBLE = visibleCount;
  const comfort_ss = useSlideshow(hotelCards.length, 4500);
  const getVisibleHotels = () => {
    const items = [];
    for (let i = 0; i < COMFORT_VISIBLE; i++) {
      items.push(hotelCards[(comfort_ss.current + i) % hotelCards.length]);
    }
    return items;
  };

  // ----------------------------------------------------------
  // SECTION: Ride in Style — slideshow state (3-up)
  // ----------------------------------------------------------
  const RIDE_VISIBLE = visibleCount;
  const ride_ss = useSlideshow(vehicleCards.length, 4500);
  const getVisibleVehicles = () => {
    const items = [];
    for (let i = 0; i < RIDE_VISIBLE; i++) {
      items.push(vehicleCards[(ride_ss.current + i) % vehicleCards.length]);
    }
    return items;
  };

  // ----------------------------------------------------------
  // SECTION: Find Your Perfect Journey — slideshow state (3-up)
  // ----------------------------------------------------------
  const JOURNEY_VISIBLE = visibleCount;
  const journey_ss = useSlideshow(journeyCards.length, 4500);
  const getVisibleJourneys = () => {
    const items = [];
    for (let i = 0; i < JOURNEY_VISIBLE; i++) {
      items.push(journeyCards[(journey_ss.current + i) % journeyCards.length]);
    }
    return items;
  };

  // ----------------------------------------------------------
  // SECTION: Unique Experiences — slideshow state (3-up)
  // ----------------------------------------------------------
  const UNIQ_VISIBLE = visibleCount;
  const uniq_ss = useSlideshow(uniqueExperiences.length, 4000);
  const getVisibleUniq = () => {
    const items = [];
    for (let i = 0; i < UNIQ_VISIBLE; i++) {
      items.push(
        uniqueExperiences[(uniq_ss.current + i) % uniqueExperiences.length],
      );
    }
    return items;
  };

  return (
    <main className="pkg-page">
      {/* ============================================================
          SECTION: Hero Banner
          ============================================================ */}
      <section className="pkg-hero">
        <div className="pkg-hero__media">
          <img
            src="/images/packages-hero.jpg"
            alt="Explore Our Curated Journeys — travel landmarks collage"
            className="pkg-hero__img"
          />
          <div className="pkg-hero__overlay" />
        </div>
        <div className="pkg-hero__content">
          <h1 className="pkg-hero__heading">
            Explore Our <span className="pkg-hero__accent">Curated</span>
            <br />
            <span className="pkg-hero__accent">Journeys</span>
          </h1>
          <p className="pkg-hero__sub">
            Seamless airport transfers and curated tours designed for the elite
            traveler.
          </p>
          <div className="pkg-hero__pill-wrap">
            <button className="pkg-hero__pill">
              <span className="pkg-hero__pill-icon">⊕</span>
              Taxi Service
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: Intro
          ============================================================ */}
      <section className="pkg-intro">
        <div className="pkg-intro__inner">
          <h2 className="pkg-intro__heading">
            Explore Our{" "}
            <span className="pkg-intro__accent">Curated Journeys</span>
          </h2>
          <p className="pkg-intro__copy">
            At <strong className="pkg-intro__brand">Voyara Adventures</strong>,
            we don't just offer trips; we create stories. Our hand-picked travel
            packages are designed to match your rhythm, whether you seek the
            thrill of the wild, the serenity of the hills, or the soul of our
            ancient culture. Choose your adventure and let us handle the rest.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION: FAQ
          ============================================================ */}
      <section className="pkg-faq-section">
        <div className="pkg-faq-section__inner">
          <div className="pkg-faq-card">
            <div className="pkg-faq-card__body">
              <h2 className="pkg-faq-card__heading">FAQ</h2>
              <div className="pkg-faq-card__list">
                {faqs.map((item, i) => (
                  <div key={i} className="pkg-faq-card__row">
                    <p className="pkg-faq-card__question">{item.q}</p>
                    <p className="pkg-faq-card__answer">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: Provinces — Explore Sri Lanka Nine Province
          ============================================================ */}
      <section className="pkg-provinces">
        <div className="pkg-provinces__inner">
          <div className="pkg-provinces__header">
            <h2 className="pkg-provinces__heading">
              Explore Sri Lanka Nine Province,{" "}
              <span className="pkg-provinces__accent">Infinite Adventures</span>
            </h2>
            <div className="pkg-provinces__search-bar">
              <span className="pkg-provinces__search-icon">🔍</span>
              <input
                className="pkg-provinces__search-input"
                type="text"
                placeholder="Search provinces..."
                aria-label="Search provinces"
                value={provinceQuery}
                onChange={(e) => setProvinceQuery(e.target.value)}
              />
              {provinceQuery && (
                <button
                  className="pkg-provinces__search-clear"
                  onClick={() => setProvinceQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
              <button
                className={`pkg-provinces__search-mic${isListening ? " pkg-provinces__search-mic--active" : ""}`}
                onClick={handleVoiceSearch}
                aria-label={isListening ? "Stop listening" : "Search by voice"}
                title={isListening ? "Listening…" : "Voice search"}
              >
                🎙️
              </button>
            </div>
          </div>

          {/* Search results mode */}
          {provinceQuery.trim() ? (
            <div className="pkg-provinces__search-results">
              {filteredProvinces.length > 0 ? (
                <div className="pkg-provinces__search-grid">
                  {filteredProvinces.map((prov) => (
                    <div key={prov.name} className="pkg-prov-card">
                      <div className="pkg-prov-card__img-wrap">
                        <img
                          src={prov.img}
                          alt={prov.name}
                          className="pkg-prov-card__img"
                        />
                      </div>
                      <div className="pkg-prov-card__body">
                        <h3 className="pkg-prov-card__title">{prov.name}</h3>
                        <p className="pkg-prov-card__desc">{prov.desc}</p>
                        <button className="pkg-prov-card__btn">Read More</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pkg-provinces__no-results">
                  <span className="pkg-provinces__no-results-icon">🔍</span>
                  <p className="pkg-provinces__no-results-text">
                    No provinces found for{" "}
                    <strong>"{provinceQuery}"</strong>
                  </p>
                  <button
                    className="pkg-provinces__no-results-clear"
                    onClick={() => setProvinceQuery("")}
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Normal slideshow mode */
            <>
              <div
                className="pkg-provinces__track-wrap"
                onMouseEnter={() => provinces_ss.setPaused(true)}
                onMouseLeave={() => provinces_ss.setPaused(false)}
              >
                <button
                  className="pkg-provinces__arrow pkg-provinces__arrow--prev"
                  onClick={provinces_ss.prev}
                  aria-label="Previous province"
                >
                  ‹
                </button>

                <div className="pkg-provinces__track">
                  {getVisibleProvinces().map((prov, i) => (
                    <div key={prov.name + i} className="pkg-prov-card">
                      <div className="pkg-prov-card__img-wrap">
                        <img
                          src={prov.img}
                          alt={prov.name}
                          className="pkg-prov-card__img"
                        />
                      </div>
                      <div className="pkg-prov-card__body">
                        <h3 className="pkg-prov-card__title">{prov.name}</h3>
                        <p className="pkg-prov-card__desc">{prov.desc}</p>
                        <button className="pkg-prov-card__btn">Read More</button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="pkg-provinces__arrow pkg-provinces__arrow--next"
                  onClick={provinces_ss.next}
                  aria-label="Next province"
                >
                  ›
                </button>
              </div>

              <div className="pkg-provinces__dots">
                {provinces.map((_, i) => (
                  <button
                    key={i}
                    className={`pkg-provinces__dot${i === provinces_ss.current ? " pkg-provinces__dot--active" : ""}`}
                    onClick={() => provinces_ss.go(i)}
                    aria-label={`Go to province ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ============================================================
          SECTION: Bucket List
          ============================================================ */}
      <section className="pkg-bucket">
        <div className="pkg-bucket__inner">
          <h2 className="pkg-bucket__heading">The Bucket List</h2>

          <div
            className="pkg-bucket__stage"
            onMouseEnter={() => bucket_ss.setPaused(true)}
            onMouseLeave={() => bucket_ss.setPaused(false)}
          >
            <button
              className="pkg-bucket__arrow pkg-bucket__arrow--prev"
              onClick={bucket_ss.prev}
              aria-label="Previous bucket list item"
            >
              ‹
            </button>

            <div className="pkg-bucket__card">
              <div className="pkg-bucket__card-img-wrap">
                <img
                  src={bucketItem.img}
                  alt={bucketItem.title}
                  className="pkg-bucket__card-img"
                />
                <div className="pkg-bucket__card-overlay" />
              </div>
              <div className="pkg-bucket__card-content">
                <h3 className="pkg-bucket__card-title">{bucketItem.title}</h3>
                <p className="pkg-bucket__card-desc">{bucketItem.desc}</p>
              </div>
            </div>

            <button
              className="pkg-bucket__arrow pkg-bucket__arrow--next"
              onClick={bucket_ss.next}
              aria-label="Next bucket list item"
            >
              ›
            </button>
          </div>

          <div className="pkg-bucket__dots">
            {bucketList.map((_, i) => (
              <button
                key={i}
                className={`pkg-bucket__dot${i === bucket_ss.current ? " pkg-bucket__dot--active" : ""}`}
                onClick={() => bucket_ss.go(i)}
                aria-label={`Go to bucket list item ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: Stay in Comfort
          ============================================================ */}
      <section className="pkg-comfort">
        <div className="pkg-comfort__inner">
          <h2 className="pkg-comfort__heading">
            Stay in <span className="pkg-comfort__accent">Comfort</span>
          </h2>

          <div
            className="pkg-comfort__track-wrap"
            onMouseEnter={() => comfort_ss.setPaused(true)}
            onMouseLeave={() => comfort_ss.setPaused(false)}
          >
            <button
              className="pkg-comfort__arrow pkg-comfort__arrow--prev"
              onClick={comfort_ss.prev}
              aria-label="Previous hotel"
            >
              ‹
            </button>

            <div className="pkg-comfort__track">
              {getVisibleHotels().map((hotel, i) => (
                <div key={hotel.name + i} className="pkg-comfort-card">
                  <div className="pkg-comfort-card__img-wrap">
                    <img
                      src={hotel.img}
                      alt={hotel.name}
                      className="pkg-comfort-card__img"
                    />
                  </div>
                  <div className="pkg-comfort-card__body">
                    <h3 className="pkg-comfort-card__title">{hotel.name}</h3>
                    <p className="pkg-comfort-card__desc">{hotel.desc}</p>
                    <button className="pkg-comfort-card__btn">Read More</button>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="pkg-comfort__arrow pkg-comfort__arrow--next"
              onClick={comfort_ss.next}
              aria-label="Next hotel"
            >
              ›
            </button>
          </div>

          <div className="pkg-comfort__dots">
            {hotelCards.map((_, i) => (
              <button
                key={i}
                className={`pkg-comfort__dot${i === comfort_ss.current ? " pkg-comfort__dot--active" : ""}`}
                onClick={() => comfort_ss.go(i)}
                aria-label={`Go to hotel ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: Ride in Style — Your Perfect Travel Companion
          ============================================================ */}
      <section className="pkg-ride">
        <div className="pkg-ride__inner">
          <div className="pkg-ride__header">
            <h2 className="pkg-ride__heading">
              Ride in Style{" "}
              <span className="pkg-ride__accent">
                Your Perfect Travel Companion
              </span>
            </h2>
          </div>

          <div
            className="pkg-ride__track-wrap"
            onMouseEnter={() => ride_ss.setPaused(true)}
            onMouseLeave={() => ride_ss.setPaused(false)}
          >
            <button
              className="pkg-ride__arrow pkg-ride__arrow--prev"
              onClick={ride_ss.prev}
              aria-label="Previous vehicle"
            >
              ‹
            </button>

            <div className="pkg-ride__track">
              {getVisibleVehicles().map((vehicle, i) => (
                <div key={vehicle.name + i} className="pkg-ride-card">
                  <div className="pkg-ride-card__img-wrap">
                    <img
                      src={vehicle.img}
                      alt={vehicle.name}
                      className="pkg-ride-card__img"
                    />
                    <div className="pkg-ride-card__overlay" />
                    <span className="pkg-ride-card__tag">{vehicle.tag}</span>
                  </div>
                  <div className="pkg-ride-card__body">
                    <h3 className="pkg-ride-card__title">{vehicle.name}</h3>
                    <p className="pkg-ride-card__desc">{vehicle.desc}</p>
                    <button className="pkg-ride-card__btn">Book Now</button>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="pkg-ride__arrow pkg-ride__arrow--next"
              onClick={ride_ss.next}
              aria-label="Next vehicle"
            >
              ›
            </button>
          </div>

          <div className="pkg-ride__dots">
            {vehicleCards.map((_, i) => (
              <button
                key={i}
                className={`pkg-ride__dot${i === ride_ss.current ? " pkg-ride__dot--active" : ""}`}
                onClick={() => ride_ss.go(i)}
                aria-label={`Go to vehicle ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: Find Your Perfect Journey
          ============================================================ */}
      <section className="pkg-journey">
        <div className="pkg-journey__inner">
          <h2 className="pkg-journey__heading">
            Find Your{" "}
            <span className="pkg-journey__accent">Perfect Journey</span>
          </h2>

          <div
            className="pkg-journey__track-wrap"
            onMouseEnter={() => journey_ss.setPaused(true)}
            onMouseLeave={() => journey_ss.setPaused(false)}
          >
            <button
              className="pkg-journey__arrow pkg-journey__arrow--prev"
              onClick={journey_ss.prev}
              aria-label="Previous journey"
            >
              ‹
            </button>

            <div className="pkg-journey__track">
              {getVisibleJourneys().map((card, i) => (
                <div key={card.title + i} className="pkg-journey-card">
                  <div className="pkg-journey-card__img-wrap">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="pkg-journey-card__img"
                    />
                    <div className="pkg-journey-card__overlay" />
                  </div>
                  <div className="pkg-journey-card__body">
                    <h3 className="pkg-journey-card__title">{card.title}</h3>
                    <p className="pkg-journey-card__desc">{card.desc}</p>
                    <button className="pkg-journey-card__btn">Read More</button>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="pkg-journey__arrow pkg-journey__arrow--next"
              onClick={journey_ss.next}
              aria-label="Next journey"
            >
              ›
            </button>
          </div>

          <div className="pkg-journey__dots">
            {journeyCards.map((_, i) => (
              <button
                key={i}
                className={`pkg-journey__dot${i === journey_ss.current ? " pkg-journey__dot--active" : ""}`}
                onClick={() => journey_ss.go(i)}
                aria-label={`Go to journey ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION: Unique Experiences
          ============================================================ */}
      <div className="pkg-uniq">
        <h2 className="pkg-uniq__heading">Unique Experiences</h2>

        <div
          className="pkg-uniq__track-wrap"
          onMouseEnter={() => uniq_ss.setPaused(true)}
          onMouseLeave={() => uniq_ss.setPaused(false)}
        >
          <button
            className="pkg-uniq__arrow pkg-uniq__arrow--prev"
            onClick={uniq_ss.prev}
            aria-label="Previous experience"
          >
            ‹
          </button>

          <div className="pkg-uniq__track">
            {getVisibleUniq().map((exp, i) => (
              <div key={exp.title + i} className="pkg-uniq-card">
                <div className="pkg-uniq-card__img-wrap">
                  <img
                    src={exp.img}
                    alt={exp.title}
                    className="pkg-uniq-card__img"
                  />
                  <div className="pkg-uniq-card__img-overlay" />
                </div>
                <div className="pkg-uniq-card__body">
                  <h3 className="pkg-uniq-card__title">{exp.title}</h3>
                  <p className="pkg-uniq-card__desc">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            className="pkg-uniq__arrow pkg-uniq__arrow--next"
            onClick={uniq_ss.next}
            aria-label="Next experience"
          >
            ›
          </button>
        </div>

        <div className="pkg-uniq__dots">
          {uniqueExperiences.map((_, i) => (
            <button
              key={i}
              className={`pkg-uniq__dot${i === uniq_ss.current ? " pkg-uniq__dot--active" : ""}`}
              onClick={() => uniq_ss.go(i)}
              aria-label={`Experience ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}