import { useState, useEffect, useRef, useCallback } from "react";
import "../Style/tours-page.css";

const toursData = [
  {
    id: 1,
    province: "Western Province",
    image: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=80",
    duration: "3 Days",
    rating: 4.8,
    tag: "Popular",
    description:
      "The bustling heart of Sri Lanka, where modern cityscapes meet coastal beauty. From the vibrant streets of Colombo to serene spiritual sites and luxury shopping, the Western Province offers a perfect blend of urban energy and tropical relaxation.",
  },
  {
    id: 2,
    province: "Central Province",
    image: "https://images.unsplash.com/photo-1546708396-8b42f5e14f32?w=600&q=80",
    duration: "4 Days",
    rating: 4.9,
    tag: "Top Rated",
    description:
      "Step into the mist-clad mountains and lush tea estates of the hill country. Home to the sacred city of Kandy and the breathtaking Nuwara Eliya, this province is a paradise for nature lovers and cultural enthusiasts alike.",
  },
  {
    id: 3,
    province: "Southern Province",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    duration: "5 Days",
    rating: 4.7,
    tag: "Beach",
    description:
      "A coastal haven famous for its golden beaches, colonial history, and vibrant marine life. Whether it's exploring the Galle Fort or whale watching in Mirissa, the South promises sun-kissed adventures and unforgettable seaside memories.",
  },
  {
    id: 4,
    province: "Northern Province",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80",
    duration: "3 Days",
    rating: 4.6,
    tag: "Cultural",
    description:
      "Discover the ancient Tamil heritage and pristine landscapes of Jaffna. Explore majestic temples, unique cuisine, and the serene Jaffna Lagoon for a deeply authentic Sri Lankan experience unlike any other.",
  },
  {
    id: 5,
    province: "Uva Province",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    duration: "4 Days",
    rating: 4.8,
    tag: "Adventure",
    description:
      "A land of dramatic landscapes, from iconic waterfalls like Dunhinda to the world-famous Nine Arch Bridge in Ella. Uva is perfect for those seeking scenic train rides, mountain trekking, and the refreshing chill of the highlands.",
  },
  {
    id: 6,
    province: "Sabaragamuwa Province",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    duration: "3 Days",
    rating: 4.5,
    tag: "Nature",
    description:
      "A region rich in biodiversity and gems. From trekking through the Sinharaja Rainforest to the spiritual pilgrimage of Adam's Peak and the thrill of white-water rafting in Kitulgala, it's a destination for the true adventurer.",
  },
  {
    id: 7,
    province: "North Western Province",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&q=80",
    duration: "2 Days",
    rating: 4.7,
    tag: "Scenic",
    description:
      "Home to ancient ruins, wildlife-rich Wilpattu National Park, and sacred pilgrimage sites, the North West blends heritage with natural beauty. A journey here is a step back into Sri Lanka's glorious past.",
  },
  {
    id: 8,
    province: "Eastern Province",
    image: "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=600&q=80",
    duration: "3 Days",
    rating: 4.6,
    tag: "Beach",
    description:
      "Home to some of the world's best surfing spots and crystal-clear bays. From the sunrise at Arugam Bay to the turquoise waters of Nilaveli, the East is the ultimate destination for water sports and tranquil coastal escapes.",
  },
  {
    id: 9,
    province: "North Central Province",
    image: "https://images.unsplash.com/photo-1582651957829-0f7c23b4de7c?w=600&q=80",
    duration: "4 Days",
    rating: 4.9,
    tag: "Heritage",
    description:
      "The cradle of Sri Lankan civilization. Marvel at the ancient ruins of Polonnaruwa and Anuradhapura, explore the iconic Sigiriya Rock Fortress, and discover thousands of years of Buddhist heritage.",
  },
];

// ── Bucket List Data ──────────────────────────────────────────────────────────
const bucketListData = [
  {
    id: 1,
    title: "The Lion Rock",
    image: "https://images.unsplash.com/photo-1582651957829-0f7c23b4de7c?w=800&q=80",
    description: "Climb the 8th wonder of the world — a magnificent rock fortress rising from the central plains, adorned with ancient frescoes and topped with a palace in the clouds.",
  },
  {
    id: 2,
    title: "Temple of the Tooth",
    image: "https://images.unsplash.com/photo-1546708396-8b42f5e14f32?w=800&q=80",
    description: "Immerse yourself in the spiritual heart of the island. A golden-roofed sanctuary housing the sacred tooth relic of the Buddha, surrounded by history and tradition.",
  },
  {
    id: 3,
    title: "The Nine Arch Bridge",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    description: "Witness the architectural masterpiece of the colonial era. Watch the train curve through the misty tea-covered hills over this iconic stone bridge.",
  },
  {
    id: 4,
    title: "The Tea Trails",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    description: "Travel through endless emerald-green tea estates, visit colonial-style factories, and sip a cup of the world's finest Ceylon Tea in the misty highlands.",
  },
  {
    id: 5,
    title: "Whale Watching",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    description: "Set sail into the deep blue Indian Ocean for an unforgettable encounter with the majestic Blue Whales, the largest creatures to ever roam the earth.",
  },
  
];

// ── Hotels / Stay Data ────────────────────────────────────────────────────────
const hotelsData = [
  {
    id: 1,
    name: "Heritance Kandalama",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    description: "A masterpiece of eco-friendly architecture carved into a cliffside. Overlooking the Kandalama Tank and Sigiriya rock, this hotel offers a unique blend of luxury and raw nature.",
  },
  {
    id: 2,
    name: "Cinnamon Wild Yala",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    description: "Located right on the border of Yala National Park, this resort brings you face-to-face with the wild. Stay in cozy chalets where leopards and elephants roam just outside your doorstep.",
  },
  {
    id: 3,
    name: "98 Acres Resort & Spa",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    description: "Set on a scenic 98-acre tea estate, this boutique hotel offers breathtaking views of the Ella Gap. Its unique chalets made of recyclable materials provide the ultimate highland retreat.",
  },
  {
    id: 4,
    name: "Jetwing Lighthouse",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
    description: "A majestic colonial-style hotel perched on the rocky shores of Galle. Designed by the legendary Geoffrey Bawa, it offers world-class service and stunning Indian Ocean sunsets.",
  },
  {
    id: 5,
    name: "Anantara Peace Haven",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80",
    description: "Nestled among a coconut plantation on a private stretch of golden beach. This resort is the pinnacle of tropical luxury, featuring world-class spa treatments and private pool villas.",
  },
  {
    id: 6,
    name: "Grand Hotel",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80",
    description: "Experience the grandeur of the British colonial era. Surrounded by beautifully manicured gardens and cool misty weather, it's the perfect place for high tea and a cozy, vintage stay.",
  },
];

// ── Ride in Style — Taxi Data ─────────────────────────────────────────────────
const taxiData = [
  {
    id: 1,
    name: "Budget & Solo Travelers",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80",
    description: "Travel light and smart. Our budget-friendly hatchbacks are perfect for solo travelers or couples looking for an affordable way to explore the island.",
  },
  {
    id: 2,
    name: "Comfort & Family Travel",
    image: "https://images.unsplash.com/photo-1582651957829-0f7c23b4de7c?w=600&q=80",
    description: "Experience the best of both worlds. Highly comfortable and fuel-efficient hybrid cars, making them the top choice for small families and long-distance tours.",
  },
  {
    id: 3,
    name: "Luxury & Group Tours",
    image: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=80",
    description: "Indulge in ultimate luxury and space. Whether you're hitting the rugged mountain trails or traveling with a large group, our premium fleet ensures a first-class journey.",
  },
  {
    id: 4,
    name: "The Grand Exploration (3-4 Weeks Tour)",
    image: "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=600&q=80",
    description: "Dive deep into the island's soul. From the vibrant North to the tropical South.",
  },
  {
    id: 5,
    name: "Tailor-Made Journey (Customize Your Tour)",
    image: "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=600&q=80",
    description: "Can't find the perfect fit? Tell us your dreams, and we'll build a unique itinerary just for you.",
  },
];

// ── Tour Packages Data ────────────────────────────────────────────────────────
const tourPackagesData = [
  {
    id: 1,
    name: "The Quick Escape (1 Week Tour)",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80",
    description: "A compact journey through the heart of Lanka's history and misty mountains.",
  },
  {
    id: 2,
    name: "Island Wonders (2 Weeks Tour)",
    image: "https://images.unsplash.com/photo-1582651957829-0f7c23b4de7c?w=600&q=80",
    description: "The ultimate Sri Lankan experience covering heritage, wildlife, and golden shores.",
  },
  {
    id: 3,
    name: "Island Wonders (3 Weeks Tour)",
    image: "https://images.unsplash.com/photo-1546708396-8b42f5e14f32?w=600&q=80",
    description: "The ultimate Sri Lankan experience covering heritage, wildlife, and golden shores.",
  },
  {
    id: 4,
    name: "The Grand Exploration (3-4 Weeks Tour)",
    image: "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=600&q=80",
    description: "Dive deep into the island's soul. From the vibrant North to the tropical South.",
  },
  {
    id: 5,
    name: "Tailor-Made Journey (Customize Your Tour)",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    description: "Can't find the perfect fit? Tell us your dreams, and we'll build a unique itinerary just for you.",
  },
];

// ── Unique Experiences Data ───────────────────────────────────────────────────
const uniqueExpData = [
  {
    id: 1,
    title: "Kitulgala White Water Rafting.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    description: "Conquer the roaring rapids of the Kelani River. Feel the thrill of white-water rafting through tropical rainforests and scenic rock formations in the adventure capital of Sri Lanka.",
  },
  {
    id: 2,
    title: "Mirissa Whale Watching.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    description: "Set sail at dawn into the deep blue Indian Ocean for a breathtaking encounter with the world's largest creatures. Blue Whales and Sperm Whales frequent these warm Sri Lankan waters.",
  },
  {
    id: 3,
    title: "Ella Rock Sunrise Trek.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    description: "Rise before dawn and hike through lush tea estates to the summit of Ella Rock. Be rewarded with a panoramic sunrise view over the misty valley — one of Sri Lanka's most iconic moments.",
  },
  {
    id: 4,
    title: "Yala Leopard Safari.",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80",
    description: "Venture into Yala National Park, home to the world's highest density of leopards. Guided game drives take you face-to-face with these elusive big cats in their natural habitat.",
  },
];




const CARDS_DESKTOP = 3;
const CARDS_TABLET  = 2;
const CARDS_MOBILE  = 1;

function useCardsPerView() {
  const [cardsPerView, setCardsPerView] = useState(CARDS_DESKTOP);
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 640)  setCardsPerView(CARDS_MOBILE);
      else if (w < 1024) setCardsPerView(CARDS_TABLET);
      else setCardsPerView(CARDS_DESKTOP);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cardsPerView;
}

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="tours-star-row" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i} className="tours-star tours-star--full">★</span>;
        if (i === full && half) return <span key={i} className="tours-star tours-star--half">★</span>;
        return <span key={i} className="tours-star tours-star--empty">★</span>;
      })}
      <span className="tours-star-value">{rating}</span>
    </span>
  );
}

// ── Tour Card ─────────────────────────────────────────────────────────────────
function TourCard({ tour }) {
  return (
    <article className="tours-card">
      <div className="tours-card__img-wrap">
        <img src={tour.image} alt={tour.province} className="tours-card__img" loading="lazy" />
        <span className="tours-card__tag">{tour.tag}</span>
        <div className="tours-card__overlay" />
      </div>
      <div className="tours-card__body">
        <div className="tours-card__meta-row">
          <span className="tours-card__duration">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {tour.duration}
          </span>
          <span className="tours-card__meta-spacer" />
          <StarRating rating={tour.rating} />
        </div>
        <h3 className="tours-card__title">{tour.province}</h3>
        <p className="tours-card__desc">{tour.description}</p>
        <div className="tours-card__footer">
          <button className="tours-card__btn" type="button">Read More</button>
        </div>
      </div>
    </article>
  );
}

// ── Bucket List Item Card (white bg, image left, text right) ─────────────────
function BucketListItem({ item }) {
  return (
    <div className="bucket-item">
      <div className="bucket-item__img-wrap">
        <img src={item.image} alt={item.title} className="bucket-item__img" loading="lazy" />
      </div>
      <div className="bucket-item__content">
        <h3 className="bucket-item__title">{item.title}</h3>
        <p className="bucket-item__desc">{item.description}</p>
      </div>
    </div>
  );
}

// ── Hotel Card (white bg, light style) ───────────────────────────────────────
function HotelCard({ hotel }) {
  return (
    <article className="hotel-card">
      <div className="hotel-card__img-wrap">
        <img src={hotel.image} alt={hotel.name} className="hotel-card__img" loading="lazy" />
      </div>
      <div className="hotel-card__body">
        <h3 className="hotel-card__name">{hotel.name}</h3>
        <p className="hotel-card__desc">{hotel.description}</p>
        <button className="hotel-card__btn" type="button">Read More</button>
      </div>
    </article>
  );
}

// ── Generic Slider (reusable) ─────────────────────────────────────────────────
function CardSlider({ data, renderCard, cardsPerView }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / cardsPerView);
  const colClass   = `tours-grid--cols-${cardsPerView}`;
  const cards      = data.slice(page * cardsPerView, (page + 1) * cardsPerView);

  useEffect(() => {
    if (totalPages <= 1) return;
    const id = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, 4000);
    return () => clearInterval(id);
  }, [totalPages]);

  return (
    <>
      <div className="tours-slider-wrapper">
        <button
          className="tours-nav-btn tours-nav-btn--prev"
          type="button"
          onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
          aria-label="Previous"
        >‹</button>
        <div className={`tours-grid ${colClass}`}>
          {cards.map((item) => renderCard(item))}
        </div>
        <button
          className="tours-nav-btn tours-nav-btn--next"
          type="button"
          onClick={() => setPage((p) => (p + 1) % totalPages)}
          aria-label="Next"
        >›</button>
      </div>
      <div className="tours-dots">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`tours-dot${page === i ? " tours-dot--active" : ""}`}
            type="button"
            onClick={() => setPage(i)}
            aria-label={`Page ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}

// ── Taxi Card (for Ride in Style) ─────────────────────────────────────────────
function TaxiCard({ item }) {
  return (
    <article className="taxi-card">
      <div className="taxi-card__img-wrap">
        <img src={item.image} alt={item.name} className="taxi-card__img" loading="lazy" />
        <div className="taxi-card__overlay" />
        <span className="taxi-card__name-overlay">{item.name}</span>
      </div>
      <div className="taxi-card__body">
        <p className="taxi-card__desc">{item.description}</p>
        <button className="taxi-card__btn" type="button">Read More</button>
      </div>
    </article>
  );
}

// ── Package Card (for Find Your Perfect Journey) ──────────────────────────────
function PackageCard({ item }) {
  return (
    <article className="pkg-card">
      <div className="pkg-card__img-wrap">
        <img src={item.image} alt={item.name} className="pkg-card__img" loading="lazy" />
        <div className="pkg-card__overlay" />
        <span className="pkg-card__name-overlay">{item.name}</span>
      </div>
      <div className="pkg-card__body">
        <p className="pkg-card__desc">{item.description}</p>
        <button className="pkg-card__btn" type="button">Read More</button>
      </div>
    </article>
  );
}

// ── Unique Experience Card ────────────────────────────────────────────────────
function UniqueExpCard({ item }) {
  return (
    <article className="uexp-card">
      <div className="uexp-card__inner">
        <img src={item.image} alt={item.title} className="uexp-card__img" loading="lazy" />
        <div className="uexp-card__overlay" />
        <div className="uexp-card__body">
          <h3 className="uexp-card__title">{item.title}</h3>
          <p className="uexp-card__desc">{item.description}</p>
        </div>
      </div>
    </article>
  );
}

// ── Bucket List Section (white bg) ────────────────────────────────────────────
function BucketListSection() {
  const cardsPerView = useCardsPerView();

  return (
    <section className="bucket-section">
      <div className="bucket-header">
        <h2 className="bucket-header__title">
          The <span className="bucket-header__accent">Bucket List</span>
        </h2>
      </div>

      {/* Bucket List Items — 1 card per slide, image left + text right */}
      <div className="bucket-slider-wrap">
        <CardSlider
          data={bucketListData}
          cardsPerView={1}
          renderCard={(item) => <BucketListItem key={item.id} item={item} />}
        />
      </div>

      {/* Stay in Comfort */}
      <div className="bucket-hotels">
        <h3 className="bucket-hotels__title">
          Stay in <span className="bucket-hotels__accent">Comfort</span>
        </h3>
        <CardSlider
          data={hotelsData}
          cardsPerView={cardsPerView}
          renderCard={(hotel) => <HotelCard key={hotel.id} hotel={hotel} />}
        />
      </div>
    </section>
  );
}

// ── Ride in Style Section ─────────────────────────────────────────────────────
function RideInStyleSection() {
  const cardsPerView = useCardsPerView();

  return (
    <section className="ride-section">
      <div className="ride-header">
        <h2 className="ride-header__title">
          Ride in Style Your <span className="ride-header__accent">Perfect Travel Companion</span>
        </h2>
      </div>

      <div className="ride-slider-wrap">
        <CardSlider
          data={taxiData.slice(0, 3)}
          cardsPerView={cardsPerView}
          renderCard={(item) => <TaxiCard key={item.id} item={item} />}
        />
      </div>

      <div className="pkg-header">
        <h3 className="pkg-header__title">
          Find Your <span className="pkg-header__accent">Perfect Journey</span>
        </h3>
      </div>

      <div className="ride-slider-wrap">
        <CardSlider
          data={tourPackagesData}
          cardsPerView={cardsPerView}
          renderCard={(item) => <PackageCard key={item.id} item={item} />}
        />
      </div>

      <div className="uexp-header">
        <h3 className="uexp-header__title">
          <span className="uexp-header__accent">Unique Experiences</span>
        </h3>
      </div>

      <div className="bucket-slider-wrap">
        <CardSlider
          data={uniqueExpData}
          cardsPerView={1}
          renderCard={(item) => <UniqueExpCard key={item.id} item={item} />}
        />
      </div>
    </section>
  );
}


export default function Tours() {
  const cardsPerView = useCardsPerView();

  // Atomic state: searchQuery + activeIndex together so search resets index
  const [slider, setSlider] = useState({ searchQuery: "", activeIndex: 0 });
  const { searchQuery, activeIndex } = slider;

  const [isDragging, setIsDragging] = useState(false);
  const dragStart  = useRef(null);
  const trackRef   = useRef(null);   // ref to the scrollable track element

  const setSearch = useCallback((q) => {
    setSlider({ searchQuery: q, activeIndex: 0 });
  }, []);

  // ── Filtered list ───────────────────────────────────────────────────────────
  const filtered = toursData.filter((t) =>
    t.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pages = groups of cardsPerView cards, no partial/empty page at the end
  const totalPages   = Math.ceil(filtered.length / cardsPerView);
  const clampedPage  = Math.min(activeIndex, Math.max(0, totalPages - 1));

  // ── Navigation ──────────────────────────────────────────────────────────────
  const goTo = useCallback((page) => {
    const clamped = Math.max(0, Math.min(page, Math.ceil(filtered.length / cardsPerView) - 1));
    setSlider((s) => ({ ...s, activeIndex: clamped }));
  }, [filtered.length, cardsPerView]);

  const next = useCallback(() => {
    setSlider((s) => {
      const pages = Math.ceil(filtered.length / cardsPerView);
      return { ...s, activeIndex: s.activeIndex + 1 >= pages ? 0 : s.activeIndex + 1 };
    });
  }, [filtered.length, cardsPerView]);

  const prev = useCallback(() => {
    setSlider((s) => {
      const pages = Math.ceil(filtered.length / cardsPerView);
      return { ...s, activeIndex: s.activeIndex - 1 < 0 ? pages - 1 : s.activeIndex - 1 };
    });
  }, [filtered.length, cardsPerView]);

  // ── Auto-advance ────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  // ── Scroll the track to the current page via scrollLeft (no inline styles) ──
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const pageWidth = track.offsetWidth;
    track.scrollTo({ left: clampedPage * pageWidth, behavior: "smooth" });
  }, [clampedPage, cardsPerView]);

  // ── Drag / swipe ────────────────────────────────────────────────────────────
  const handlePointerDown = (e) => {
    dragStart.current = e.clientX ?? e.touches?.[0]?.clientX;
    setIsDragging(false);
  };
  const handlePointerMove = (e) => {
    if (dragStart.current === null) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    if (Math.abs(x - dragStart.current) > 5) setIsDragging(true);
  };
  const handlePointerUp = (e) => {
    if (dragStart.current === null) return;
    const x   = e.clientX ?? e.changedTouches?.[0]?.clientX;
    const diff = dragStart.current - x;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    dragStart.current = null;
    setTimeout(() => setIsDragging(false), 10);
  };

  // ── CSS class for column count (controls card width via CSS grid) ───────────
  const colClass = `tours-grid--cols-${cardsPerView}`;

  // ── Cards for current page only ─────────────────────────────────────────────
  // Slice the filtered list to only render the cards for the visible page.
  // This completely eliminates partial/empty slides.
  const start        = clampedPage * cardsPerView;
  const visibleCards = filtered.slice(start, start + cardsPerView);

  return (
    <section className="tours-section">
      {/* ── Hero ── */}
      <div className="tours-hero">
        <div className="tours-hero__bg" aria-hidden="true" />
        <div className="tours-hero__content">
          <h1 className="tours-hero__heading">
            Craft Your Ultimate{" "}
            <span className="tours-hero__heading--accent">Sri Lankan Journey</span>
          </h1>
          <p className="tours-hero__sub">
            From the misty peaks of the Hill Country to the untamed wild of Yala, our curated tours
            are designed to show you the soul of the island. Whether you're seeking a quick escape or
            a grand month-long exploration, we turn your travel dreams into reality.
          </p>
          <button className="tours-hero__cta" type="button">
            <span className="tours-hero__cta-icon">⊕</span> Taxi Service
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="tours-main">
        <div className="tours-header">
          <h2 className="tours-header__title">
            Explore Sri Lanka Nine Province,{" "}
            <span className="tours-header__title--accent">Infinite Adventures</span>
          </h2>
        </div>

        {/* Search */}
        <div className="tours-search-wrap">
          <label htmlFor="tours-search" className="tours-search__icon" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </label>
          <input
            id="tours-search"
            className="tours-search__input"
            type="text"
            placeholder="Search by province or category..."
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
          />
          {searchQuery && (
            <button className="tours-search__clear" type="button" onClick={() => setSearch("")} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        {/* Cards / empty state */}
        {filtered.length === 0 ? (
          <div className="tours-empty">
            <p>No tours found for &ldquo;<strong>{searchQuery}</strong>&rdquo;.</p>
          </div>
        ) : (
          <>
            {/* Slider wrapper */}
            <div className="tours-slider-wrapper">
              <button
                className="tours-nav-btn tours-nav-btn--prev"
                type="button"
                onClick={prev}
                aria-label="Previous tours"
              >
                ‹
              </button>

              {/*
                tours-grid is a CSS Grid container.
                The column count is set purely by a CSS class (colClass),
                no inline styles. Each card fills exactly 1 grid cell.
                We only render the current page's cards, so there are
                never any empty or broken cells.
              */}
              <div
                ref={trackRef}
                className={`tours-grid ${colClass}${isDragging ? " tours-grid--dragging" : ""}`}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                aria-live="polite"
              >
                {visibleCards.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>

              <button
                className="tours-nav-btn tours-nav-btn--next"
                type="button"
                onClick={next}
                aria-label="Next tours"
              >
                ›
              </button>
            </div>

            {/* Dot indicators — one dot per page */}
            <div className="tours-dots" role="tablist" aria-label="Tour pages">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`tours-dot${clampedPage === i ? " tours-dot--active" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={clampedPage === i}
                  aria-label={`Go to page ${i + 1}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Bucket List Section ── */}
      <BucketListSection />

      {/* ── Ride in Style + Journey + Unique Experiences ── */}
      <RideInStyleSection />
    </section>
  );
}