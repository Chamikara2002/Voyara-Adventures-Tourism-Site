import { useState, useEffect, useRef } from "react";
import "../Style/about-page.css";
import png1 from "../assets/Images/png1.png";
import png2 from "../assets/Images/png2.png";
import png3 from "../assets/Images/png3.png";
import png4 from "../assets/Images/png4.png";
import png5 from "../assets/Images/png5.png";
import png6 from "../assets/Images/png6.png";

// ─── Hero slideshow data ───────────────────────────────────────────────────────
const SLIDES = [
  { id: 1, src: png1, alt: "World landmarks collage – slide 1" },
  { id: 2, src: png2, alt: "Mountain ski resort – slide 2" },
  { id: 3, src: png3, alt: "Coastal city view – slide 3" },
  { id: 4, src: png4, alt: "Desert dunes at sunset – slide 4" },
  { id: 5, src: png5, alt: "Tropical paradise – slide 5" },
  { id: 6, src: png6, alt: "European old town – slide 6" },
];

// ─── "What We Offer" lists per section ────────────────────────────────────────

/* 1 · Honest & Upfront Pricing */
const PRICING_OFFERS = [
  {
    title: "Bespoke Tour Itineraries",
    body: "We sell personalised travel plans tailored specifically to your unique interests and preferences.",
  },
  {
    title: "Local Expertise & Insider Tips",
    body: "Gain access to Sri Lanka's best-kept secrets with personalised recommendations from our expert local drivers.",
  },
  {
    title: "Ultimate Schedule Flexibility",
    body: "Your journey, your rules. We offer total flexibility in tour duration and locations.",
  },
  {
    title: "Tailored Group Experiences",
    body: "From solo explorers and romantic couples to large families and corporate groups, we provide specialised services for every traveller type.",
  },
  {
    title: "Dedicated Trip Planning Assistance",
    body: "Navigate the complexities of travel with ease through our professional itinerary planning support.",
  },
];

/* 2 · Your Safety, Our Priority */
const SAFETY_OFFERS = [
  {
    title: "Tailored Travel Itineraries",
    body: "We craft believe in one-size-fits-all. We design bespoke travel plans based on your specific interests.",
  },
  {
    title: "Local Insight & Expert Recommendations",
    body: "Skip the tourist traps and discover the real Sri Lanka.",
  },
  {
    title: "Custom Solutions for Every Group",
    body: "Whether you are travelling solo, a couple or a large family, we provide tailored solutions to match.",
  },
  {
    title: "Professional Trip Customisation Support",
    body: "From the first click to the final drop-off, our team assists you with expert itinerary planning.",
  },
  {
    title: "Total Journey Flexibility",
    body: "We understand that plans can change. We offer complete flexibility to adjust your schedule on the fly.",
  },
];

/* 3 · A Ride for Every Journey */
const FLEET_OFFERS = [
  {
    title: "24/7 Island-Wide Assistance",
    body: "We are with you every step of the way. Our dedicated support team is available around the clock.",
  },
  {
    title: "Seamless Airport Transfers",
    body: "Start and end your holiday with ease. We offer punctual, door-to-door airport pickups and drops at Bandaranaike International Airport.",
  },
  {
    title: "Multi-Lingual Expert Drivers",
    body: "Communication is key to a great trip. Our professional drivers are not only experienced, but are also multi-lingual.",
  },
];

/* 4 · 24/7 Island Wide Service */
const ISLAND_OFFERS = [
  {
    title: "Round the Clock Reliability",
    body: "Adventure can call at any hour. We provide consistent, 24/7 transportation services across the entire island.",
  },
  {
    title: "Door to Door Convenience",
    body: "We bring the adventure to your doorstep. Our service includes personalised pickups and drops from any hotel, villa, or airport.",
  },
  {
    title: "All Island Destination Coverage",
    body: "No location is too remote for us. From the popular tourist hubs to the hidden, off-the-beaten-path villages.",
  },
  {
    title: "Real Time Support & Dispatch",
    body: "Our active support line is always open. We use real-time dispatching to ensure your vehicle arrives exactly when and where you need it.",
  },
  {
    title: "Emergency Travel Assistance",
    body: "Peace of mind is part of the package. In case of unexpected plan changes or travel disruptions, our 24/7 assistance team is ready.",
  },
];

/* 5 · Elite Airport Transfers */
const AIRPORT_OFFERS = [
  {
    title: "Punctual Meet and Greet Service",
    body: "No more waiting around. Our drivers track your flight status in real-time to ensure they are at the arrivals terminal exactly when you land.",
  },
  {
    title: "Fixed Rate Airport Transfers",
    body: "Avoid the uncertainty of local metres. We offer transparent, fixed-rate pricing for all airport pickups and drops.",
  },
  {
    title: "Flight Delay Monitoring",
    body: "Travel plans can be unpredictable. We actively monitor your flight schedule, so even if your arrival is delayed or rescheduled, your Voyera Adventures ride will be there waiting for you.",
  },
  {
    title: "Luggage Assistance & Porterage",
    body: "Relax and let us handle the heavy lifting. Our service includes dedicated luggage assistance.",
  },
  {
    title: "Executive Door to Door Comfort",
    body: "Experience the ultimate convenience with our private, air-conditioned transfers that take you directly from the airport to your hotel.",
  },
];

/* 6 · Certified Local Experts */
const EXPERTS_OFFERS = [
  {
    title: "Professionalism & Local Knowledge",
    body: "Our drivers are certified experts who possess a deep understanding of Sri Lanka's geography, history, and culture.",
  },
  {
    title: "Multi-Lingual Communication",
    body: "Language should never be a barrier to adventure. We provide professional drivers who are fluent in multiple languages.",
  },
  {
    title: "Safety Certified Professionals",
    body: "Your security is our top priority. All our drivers undergo rigorous background checks and road safety training.",
  },
  {
    title: "Insider Access to Hidden Gems",
    body: "Experience Sri Lanka like a local. Our experts can guide you to off-the-beaten path locations, from secluded beaches to authentic village kitchens.",
  },
  {
    title: "Dedicated Personal Assistance",
    body: "More than just driving, our team is there to ensure you will never stress from luggage handling to local restaurant bookings or itinerary adjustments.",
  },
];

const CURATE_OFFERS = [
  {
    title: "Exclusive Wildlife Safaris",
    body: "Experience the wild side of Sri Lanka with our priority safari bookings. We connect you with the best rangers and Jeep services in National Parks like Yala, Udawalawe, and Minneriya for an elite wildlife encounter.",
  },
  {
    title: "Authentic Cultural Immersions",
    body: " Go beyond the monuments. We offer hand-picked cultural experiences, including traditional pottery workshops, village walks, and authentic Sri Lankan cooking classes led by local families in their own homes.",
  },
  {
    title: "Adrenaline & Water Sports",
    body: "Whether you want to ride the waves in Ahangama or go white-water rafting in Kithulgala, we provide easy bookings for certified instructors and high-quality equipment for all your adventure needs.",
  },
  {
    title: "Scenic Coastal & Marine Tours",
    body: "Discover the wonders of the Indian Ocean. From private boat tours and whale watching expeditions to snorkeling in crystal-clear reefs, we arrange secure and premium marine adventures with trusted operators.",
  },
  {
    title: "Curated Hiking & Nature Trails",
    body: "Explore the lush greenery of the hill country with our guided trekking tours. We plan the best routes through tea estates, waterfalls, and misty peaks, tailored to your fitness level and sense of adventure.",
  },
];

const EXECUTIVE_OFFERS = [
  {
    title: "Discreet & Professional Chauffeurs",
    body: "Our drivers are more than just experts on the road; they are trained in corporate etiquette and absolute discretion. Expect a punctual, well-dressed, and professional companion who respects your privacy and business needs.",
  },
  {
    title: "Premium Fleet of Luxury Vehicles",
    body: "Make a lasting impression with our selection of high-end executive vehicles. From sleek Mercedes Benz and BMW sedans to luxury 4x4 SUVs, we provide the ultimate environment for comfort and productivity on the move.",
  },
  {
    title: "Priority 24/7 Corporate Support",
    body: "Business never stops, and neither do we. Our corporate clients receive priority booking and a dedicated 24/7 support line to handle last-minute schedule changes, airport transfers, or multi city itineraries.",
  },
  {
    title: "Optimized for On the Go Productivity",
    body: "Our vehicles are equipped with modern amenities to help you stay productive. Enjoy high-speed Wi-Fi, climate control, and spacious interiors that serve as your mobile office between destinations.",
  },
  {
    title: "Seamless B2B Billing & Documentation",
    body: "We simplify the administrative side of travel. Enjoy transparent corporate billing, detailed invoicing, and flexible payment terms designed to integrate seamlessly with your company’s travel policy and accounting.",
  },
];

const CONCIERGE_OFFERS = [
  {
    title: "Real Time WhatsApp Support",
    body: " Skip the phone calls and long emails. Our instant-response WhatsApp concierge is available 24/7 to answer your questions, handle last-minute bookings, or provide directions while you are on the move.",
  },
  {
    title: "Expert Dining & Lifestyle Curation",
    body: " Looking for the best seafood in Galle or a quiet cafe in Kandy? We provide hand-picked restaurant recommendations and handle the reservations for you, ensuring you experience the island's finest flavors.",
  },
  {
    title: "Local Market & Shopping Guidance",
    body: "Discover authentic souvenirs without the stress. Our concierge provides insider tips on where to shop for genuine gems, spices, and tea, helping you find quality products at fair local prices.",
  },
  {
    title: "Emergency Assistance & Coordination",
    body: "Travel with total peace of mind. In the rare event of a medical emergency or lost documents, our support team is ready to coordinate with local authorities and service providers to get you the help you need immediately.",
  },
  {
    title: "Seamless Language Translation ",
    body: "Don't let language barriers slow you down. Our concierge team is always available to help with translations between you and local vendors, ensuring your needs are understood and met throughout your journey.",
  },
];

// ─── Photo Collage (the Sri Lanka image grid widget) ─────────────────────────
function PhotoCollage({ images, label }) {
  return (
    <div className="ap-collage">
      <div className="ap-collage__grid">
        {images.slice(0, 6).map((src, i) => (
          <div key={i} className="ap-collage__cell">
            <img
              src={src}
              alt=""
              className="ap-collage__img"
              draggable="false"
            />
          </div>
        ))}
      </div>
      <div className="ap-collage__label">{label}</div>
    </div>
  );
}

// ─── What We Offer numbered list ─────────────────────────────────────────────
function OfferList({ items }) {
  return (
    <div className="ap-offer-block">
      <h3 className="ap-offer-block__heading">What We Offer</h3>
      <div className="ap-offer-block__divider" aria-hidden="true" />
      <ol className="ap-offer-block__list">
        {items.map((item, idx) => (
          <li key={idx} className="ap-offer-block__item">
            <span className="ap-offer-block__num" aria-hidden="true">
              {idx + 1}
            </span>
            <span className="ap-offer-block__text">
              <span className="ap-offer-block__item-title">{item.title}</span>
              <span className="ap-offer-block__item-sep"> – </span>
              <span className="ap-offer-block__item-body">{item.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── Alternating content block ────────────────────────────────────────────────
// sectionIndex 1-based: odd = img left / text right; even = img right / text left
function ContentBlock({
  sectionIndex,
  images,
  label,
  title,
  accentTitle,
  body,
  offers,
}) {
  const isOdd = sectionIndex % 2 !== 0;

  return (
    <div className="ap-content-block">
      <div
        className={`ap-content-block__row${isOdd ? "" : " ap-content-block__row--reverse"}`}
      >
        <PhotoCollage images={images} label={label} />
        <div className="ap-content-block__copy">
          <h3 className="ap-content-block__title">
            {title}&nbsp;<span className="ap-accent-teal">{accentTitle}</span>
          </h3>
          <p className="ap-content-block__body">{body}</p>
        </div>
      </div>
      <OfferList items={offers} />
    </div>
  );
}

// ─── AboutPage ────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const goToSlide = (index) => {
    clearInterval(intervalRef.current);
    setActiveSlide(index);
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
  };

  const allImages = SLIDES.map((s) => s.src);

  return (
    <main className="ap-page">
      {/* ── Hero Slideshow ─────────────────────────────────────────────────── */}
      <section className="ap-hero" aria-label="About us hero slideshow">
        <div className="ap-hero__slides">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={`ap-hero__slide${i === activeSlide ? " ap-hero__slide--active" : ""}`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="ap-hero__slide-img"
                draggable="false"
              />
            </div>
          ))}
          <div className="ap-hero__overlay" aria-hidden="true" />
        </div>

        <div className="ap-hero__content">
          <h1 className="ap-hero__title">About Us.</h1>
          <p className="ap-hero__subtitle">
            Seamless airport transfers and curated tours designed for the elite
            traveler.
          </p>
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

        <nav className="ap-hero__bullets" aria-label="Slide navigation">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              className={`ap-hero__bullet${i === activeSlide ? " ap-hero__bullet--active" : ""}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === activeSlide ? "true" : undefined}
            />
          ))}
        </nav>
      </section>
      {/* ── End Hero ───────────────────────────────────────────────────────── */}

      {/* ================================================================
          WHY CHOOSE US
          ================================================================ */}
      <section className="ap-why" aria-labelledby="ap-why-heading">
        <div className="ap-why__header">
          <h2 className="ap-why__heading" id="ap-why-heading">
            Why <span className="ap-why__heading-accent">Choose Us</span>
          </h2>
          <p className="ap-why__intro">
            At Voyera Adventures, we believe that every journey should be as
            remarkable as the destination itself. Our commitment to excellence
            is built on a foundation of absolute transparency, unwavering
            safety, and a deep understanding of what a modern traveller needs.
          </p>
        </div>

        {/* Block 1 (ODD) — img LEFT, text RIGHT */}
        <ContentBlock
          sectionIndex={1}
          images={allImages}
          label="Sri Lanka"
          title="Honest &"
          accentTitle="Upfront Pricing"
          body="At Voyera Adventures, we believe in building trust through transparency. Our fixed-rate pricing model ensures there are absolutely no hidden costs, unexpected surcharges, or surprise fees. What you see at the time of booking is exactly what you pay. We provide a comprehensive breakdown of your costs upfront, allowing you to plan your trip with complete financial confidence and zero stress."
          offers={PRICING_OFFERS}
        />

        <div className="ap-why__divider" aria-hidden="true" />

        {/* Block 2 (EVEN) — img RIGHT, text LEFT */}
        <ContentBlock
          sectionIndex={2}
          images={allImages}
          label="Sri Lanka"
          title="Your Safety,"
          accentTitle="Our Priority"
          body="Your peace of mind is our highest commitment. Every journey with Voyera Adventures is backed by a modern, fully insured fleet and advanced real-time GPS tracking for constant monitoring. We go beyond basic transport safety by employing professionally trained drivers and maintaining strict safety protocols. Whether you're travelling through misty mountains or coastal highways, our occasional services are available 24 hours a day, 7 days a week. With our extensive network reaching every corner of Sri Lanka, you are never stranded."
          offers={SAFETY_OFFERS}
        />

        <div className="ap-why__divider" aria-hidden="true" />

        <ContentBlock
          sectionIndex={3}
          images={allImages}
          label="Sri Lanka"
          title="24/7 Island Wide"
          accentTitle="Service"
          body="At Voyera Adventures, we understand that travel doesn't follow a 9-to-5 schedule. Whether it's a sunrise hike in the mountains, a late-night arrival at the coast, or an urgent cross-country transfer, our services are available 24 hours a day, 7 days a week. With our extensive network reaching every corner of Sri Lanka, you are never stranded."
          offers={ISLAND_OFFERS}
        />

        <div className="ap-why__divider" aria-hidden="true" />

        {/* Block 3 (ODD) — img LEFT, text RIGHT */}
        <ContentBlock
          sectionIndex={3}
          images={allImages}
          label="Sri Lanka"
          title="A Ride for"
          accentTitle="Every Journey"
          body="At Voyera Adventures, we take pride in offering a versatile fleet that caters
            to every traveller's unique needs and budget. Whether you are looking for a
            fuel-efficient, compact car for city hopping, a spacious one for a family
            gateway, or a prestigious full-size SUV for a luxurious highland experience,
            we have the perfect vehicle for you. Every vehicle in our collection is
            meticulously maintained, air-conditioned, and equipped with modern amenities
            to ensure that no matter where the road takes you, you travel in absolute
            comfort and style."
          offers={FLEET_OFFERS}
        />
        <div className="ap-why__divider" aria-hidden="true" />
        {/* Block 3 (ODD) — img LEFT, text RIGHT */}

        {/* Block 4 (EVEN) — img RIGHT, text LEFT */}
        <ContentBlock
          sectionIndex={4}
          images={allImages}
          label="Sri Lanka"
          title="Elite"
          accentTitle="Airport Transfers"
          body="At Voyera Adventures, we specialise in making your arrival and departure as smooth as the tropical breeze. The Elite Airport Transfer service guarantees a stress-free experience of flawless international airport entry, eliminating the hassle of long taxi queues or unpredictable pricing. From the moment you land, our professional drivers ensure you receive a personalised welcome, assisting with your luggage and whisking you away in ultimate comfort to your chosen vehicle. Whether it's a midnight arrival or a crack-of-dawn departure, we guarantee punctuality and a seamless door-to-door transition."
          offers={AIRPORT_OFFERS}
        />
        <div className="ap-why__divider" aria-hidden="true" />

        {/* Block 5 (ODD) — img LEFT, text RIGHT */}
        <ContentBlock
          sectionIndex={5}
          images={allImages}
          label="Sri Lanka"
          title="Certified"
          accentTitle="Local Experts"
          body="At Voyera Adventures, our drivers are much more than just navigators: they are the heart of your Sri Lankan experience. Every member of our team is a certified professional with years of experience navigating the island's diverse terrain. Beyond their expert driving skills, they are multi-lingual professionals who know the hidden gems that typical trip guides miss. From finding the perfect secluded beach to the best hidden local eateries, our drivers create a seamless, worry-free, and reliable experience for you and your loved ones."
          offers={EXPERTS_OFFERS}
        />

        <div className="ap-why__divider" aria-hidden="true" />

        <ContentBlock
          sectionIndex={6}
          images={allImages}
          label="Sri Lanka"
          title="Curated"
          accentTitle="Island Activities"
          body="At Voyara Adventures, we go beyond transport to offer exclusive access to Sri Lanka’s most iconic experiences. From thrilling wildlife safaris and whale watching to surfing lessons and authentic cooking classes, we handle every detail with local expertise. By partnering with the island's finest, we ensure a seamless booking process and unforgettable stories, making your holiday truly extraordinary."
          offers={CURATE_OFFERS}
        />

        <div className="ap-why__divider" aria-hidden="true" />

        <ContentBlock
          sectionIndex={7}
          images={allImages}
          label="Sri Lanka"
          title="Executive"
          accentTitle="Chauffeur Service"
          body="At Voyara Adventures, we redefine professional travel with our Elite Executive Chauffeur Service. Tailored specifically for business travelers, diplomats, and VIP guests, we provide a sophisticated transport solution where privacy, punctuality, and comfort are paramount. Our fleet features the latest premium sedans and luxury SUVs, operated by highly discreet, professional chauffeurs trained to meet the highest corporate standards. Whether it’s a high-stakes meeting, a corporate event, or a VIP island tour, we ensure you arrive in style, refreshed and ready for business."
          offers={EXECUTIVE_OFFERS}
        />

        <div className="ap-why__divider" aria-hidden="true" />

        <ContentBlock
          sectionIndex={8}
          images={allImages}
          label="Sri Lanka"
          title="Concierge & Travel"
          accentTitle="Support"
          body="At Voyara Adventures, we believe that premium travel is defined by the support you receive when you need it most. Our 24/7 Travel Concierge is more than just a help desk—it’s your personal link to the best of Sri Lanka. Whether you need an urgent restaurant reservation, guidance through a bustling local market, or help navigating a language barrier, our dedicated team is just a WhatsApp message away. We provide real-time, personalized assistance to ensure that every aspect of your journey is seamless, allowing you to explore with the confidence that an expert is always by your side."
          offers={CONCIERGE_OFFERS}
        />
      </section>
      {/* ── End Why Choose Us ─────────────────────────────────────────────── */}

      {/* ================================================================
          FLEET SLIDESHOW — rounded banner box
          ================================================================ */}
      <section className="ap-fleet-slideshow" aria-label="Fleet slideshow">
        <div className="ap-fleet-slideshow__banner">
          <div className="ap-fleet-slideshow__slides">
            {SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className={`ap-fleet-slideshow__slide${i === activeSlide ? " ap-fleet-slideshow__slide--active" : ""}`}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="ap-fleet-slideshow__img"
                  draggable="false"
                />
              </div>
            ))}
            <div className="ap-fleet-slideshow__overlay" aria-hidden="true" />
          </div>

          <div className="ap-fleet-slideshow__caption" aria-hidden="true">
            <span className="ap-fleet-slideshow__caption-title">Our Fleet</span>
            <span className="ap-fleet-slideshow__caption-sub">Premium Vehicles · Island-Wide Coverage</span>
          </div>
        </div>

        <nav className="ap-fleet-slideshow__bullets" aria-label="Fleet slide navigation">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              className={`ap-fleet-slideshow__bullet${i === activeSlide ? " ap-fleet-slideshow__bullet--active" : ""}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === activeSlide ? "true" : undefined}
            />
          ))}
        </nav>
      </section>
      {/* ── End Fleet Slideshow ───────────────────────────────────────────── */}
    </main>
  );
}