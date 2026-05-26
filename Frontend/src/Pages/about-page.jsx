import "../Style/about-page.css";

// Placeholder image imports — replace with your actual assets
const heroImg =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80";
const templeImg1 =
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80";
const templeImg2 =
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=700&q=80";
const coastImg =
  "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80";

// const slides = [1, 2, 3, 4, 5, 6];

const AboutPage = () => {
  return (
    <div className="vt-about-wrapper">
      {/* ── HERO SECTION ── */}
      <section className="vt-hero">
        <img src={heroImg} alt="World landmarks hero" className="vt-hero__bg" />
        <div className="vt-hero__overlay" />

        <div className="vt-hero__content">
          <h1 className="vt-hero__title">About</h1>
          <p className="vt-hero__subtitle">
            Seamless airport transfers and curated tours designed for the elite
            traveler.
          </p>
          <button className="vt-hero__btn">
            <span className="vt-hero__btn-icon">⊕</span> Taxi Service
          </button>
        </div>

        {/* Dot indicators */}
        {/* <div className="vt-hero__dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`vt-hero__dot${i === 0 ? " vt-hero__dot--active" : ""}`}
            />
          ))}
        </div> */}
      </section>

      {/* ── WELCOME SECTION ── */}
      <section className="vt-welcome">
        {/* Decorative mask — right side */}
        <div className="vt-welcome__mask-right" aria-hidden="true" />

        <div className="vt-welcome__inner">
          <h2 className="vt-welcome__heading">
            Welcome to <span className="vt-welcome__brand">VOTARA TOURS</span>
          </h2>

          <p className="vt-welcome__body">
            At <strong>Voyara Adventures</strong>, we believe that every journey
            should be as remarkable as the destination itself. Our commitment to
            excellence is built on a foundation of absolute transparency,
            unwavering safety, and a deep understanding of what a{" "}
            <strong>modern traveler</strong> needs. From our diverse fleet of
            meticulously maintained vehicles to our dedicated 24/7 support, we
            go above and beyond to ensure your travel across Sri Lanka is
            seamless, secure, and tailored exactly to your rhythm. Choose us for
            a partnership that values your peace of mind as much as your
            adventure.
          </p>

          {/* Two-column feature row */}
          <div className="vt-welcome__feature-row">
            {/* Temple image card */}
            <div className="vt-welcome__img-card">
              <img
                src={templeImg1}
                alt="Ancient temple"
                className="vt-welcome__temple-img"
              />
            </div>

            {/* Personalized experience text */}
            <div className="vt-welcome__feature-text">
              <h3 className="vt-welcome__feature-heading">
                A Unique,{" "}
                <span className="vt-welcome__feature-accent">
                  Personalized Experience
                </span>
              </h3>
              <p className="vt-welcome__feature-body">
                At <strong>VOTARA TOURS</strong>, we believe in crafting a
                travel experience tailored to your needs. From the moment you
                book your ride, our team ensures your journey is designed to be
                comfortable, enjoyable, and unforgettable. Whether you're
                traveling for business or leisure, we cater to all your
                preferences and requirements.
              </p>
              <p className="vt-welcome__feature-body">
                We take pride in offering flexibility and convenience, ensuring
                that every trip is uniquely yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPLORE TOGETHER SECTION ── */}
      <section className="vt-explore">
        {/* Decorative mask — right side */}
        <div className="vt-explore__mask-right" aria-hidden="true" />

        <div className="vt-explore__inner">
          <div className="vt-explore__text-col">
            <h2 className="vt-explore__heading">
              <span className="vt-explore__heading-accent">Let's Explore</span>{" "}
              Together
            </h2>
            <p className="vt-explore__body">
              Let's explore the beauty of Sri Lanka together with Safe Sri Lanka
              Taxi. Our reliable, personalized services ensure your journey is
              comfortable, safe, and filled with unforgettable memories as you
              discover stunning destinations.
            </p>
            <button className="vt-explore__btn">Book Now</button>
          </div>

          <div className="vt-explore__img-card">
            <img
              src={templeImg2}
              alt="Temple destination"
              className="vt-explore__temple-img"
            />
          </div>
        </div>
      </section>

      {/* ── DARE TO EXPLORE (Stats Banner) ── */}
      <section className="vt-dare">
        <div className="vt-dare__card">
          <img
            src={coastImg}
            alt="Coastal scenery"
            className="vt-dare__bg-img"
          />
          <div className="vt-dare__overlay" />

          <div className="vt-dare__content">
            <h2 className="vt-dare__heading">Dare to Explore with Travello</h2>

            <div className="vt-dare__stats">
              <div className="vt-dare__stat">
                <span className="vt-dare__stat-num">200k</span>
                <span className="vt-dare__stat-label">Happy Travelers</span>
              </div>
              <div className="vt-dare__stat">
                <span className="vt-dare__stat-num">120</span>
                <span className="vt-dare__stat-label">Destinations</span>
              </div>
              <div className="vt-dare__stat">
                <span className="vt-dare__stat-num">224</span>
                <span className="vt-dare__stat-label">Tours</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
