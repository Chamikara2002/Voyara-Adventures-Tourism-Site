import { useState } from "react";
import "../Style/booking-page.css";

// ─── IMAGE PLACEHOLDERS ───────────────────────────────────────────────────────
// TODO: Replace all `src` values below with your actual asset paths.
//
// HERO_BG        → Full-width tea-plantation / landscape hero image
//                  Temp: https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600
//
// FOOD_PROMO     → Authentic Sri Lankan culinary experiences promo image
//                  Temp: https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600
//
// CAR_STANDARD   → Essential Comfort / Standard Sedan photo
//                  Temp: https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400
//
// CAR_PREMIUM    → Traveler's Choice / Premium car photo
//                  Temp: https://images.unsplash.com/photo-1563720223185-11003d516935?w=400
//
// CAR_LUXURY     → Signature Luxury car photo
//                  Temp: https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=400
// ─────────────────────────────────────────────────────────────────────────────

const HERO_BG =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&auto=format&fit=crop";
const FOOD_PROMO =
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop";
const CAR_STANDARD =
  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&auto=format&fit=crop";
const CAR_PREMIUM =
  "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&auto=format&fit=crop";
const CAR_LUXURY =
  "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=400&auto=format&fit=crop";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const VEHICLES = [
  {
    id: "standard",
    tier: "Essential Comfort",
    label: "Standard",
    img: CAR_STANDARD,
    action: "SELECTED",
    selected: true,
  },
  {
    id: "premium",
    tier: "Traveler's Choice",
    label: "Premium",
    img: CAR_PREMIUM,
    action: "UPGRADE",
    selected: false,
  },
  {
    id: "luxury",
    tier: "Signature Luxury",
    label: "Luxury",
    img: CAR_LUXURY,
    action: "ELITE UPGRADE",
    selected: false,
  },
];

const UPCOMING = [
  {
    id: "#VT-2026-8842",
    date: "Oct 12, 2026",
    vehicle: "Premium SUV (Lexus RX)",
    status: "confirmed",
    hasMore: true,
  },
  {
    id: "#VT-2026-9011",
    date: "Oct 15, 2026",
    vehicle: "Standard Sedan (Camry)",
    status: "pending",
    hasMore: false,
  },
  {
    id: "#VT-2026-7721",
    date: "Oct 08, 2026",
    vehicle: "Luxury Van (Commuter)",
    status: "confirmed",
    hasMore: true,
  },
  {
    id: "#VT-2026-6554",
    date: "Sep 30, 2026",
    vehicle: "Premium SUV (Lexus RX)",
    status: "completed",
    hasMore: false,
  },
];

const HISTORY = [
  {
    id: "#VT-2026-5421",
    date: "Aug 12, 2026",
    vehicle: "Luxury Van (Commuter)",
    status: "completed",
  },
  {
    id: "#VT-2026-4109",
    date: "Jul 28, 2026",
    vehicle: "Premium SUV (Lexus RX)",
    status: "completed",
  },
];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function Counter({ value, onChange }) {
  return (
    <div className="counter">
      <button className="counter__btn" onClick={() => onChange(Math.max(0, value - 1))}>
        −
      </button>
      <span className="counter__val">{value}</span>
      <button className="counter__btn" onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`badge badge--${status}`}>{status.toUpperCase()}</span>;
}

// ─── PAGE SECTIONS ────────────────────────────────────────────────────────────

function ConfirmBookingSection() {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState("standard");

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="hero"
        style={{ backgroundImage: `url('${HERO_BG}')` }}
        /* NOTE: backgroundImage cannot be moved to CSS without a CSS variable;
           if you prefer, set --hero-bg in a <style> tag at runtime or use a
           CSS custom property injected via JS. The rest of the component uses
           no other inline styles. */
      >
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1 className="hero__title">Confirm Your Booking</h1>
          <p className="hero__sub">
            You're almost there! Please verify your trip details and vehicle selection below. Once
            confirmed, our team will handle the rest to ensure you have a seamless journey.
          </p>
          <span className="hero__badge">🚖 Taxi Service</span>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="confirm-body">
        {/* LEFT COLUMN */}
        <div className="confirm-body__left">
          {/* Guest Contact Details */}
          <section className="card">
            <h2 className="card__title">
              <span className="accent">Guest</span> Contact Details
            </h2>

            <div className="form-grid">
              <div className="form-col">
                <p className="form-group__label">Lead Traveler Detail</p>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" placeholder="Enter your full name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="email@voyara.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp Number</label>
                  <input className="form-input" placeholder="+94 XX XXX XXXX" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <input className="form-input" defaultValue="English" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input className="form-input" defaultValue="Sri Lanka" />
                  </div>
                </div>
              </div>

              <div className="form-col">
                <p className="form-group__label">Arrival &amp; Composition</p>
                <div className="form-group">
                  <label className="form-label">Passengers</label>
                  <div className="counters-row">
                    <div className="counter-group">
                      <span className="counter-group__label">Adults</span>
                      <Counter value={adults} onChange={setAdults} />
                    </div>
                    <div className="counter-group">
                      <span className="counter-group__label">Children</span>
                      <Counter value={children} onChange={setChildren} />
                    </div>
                    <div className="counter-group">
                      <span className="counter-group__label">Infants</span>
                      <Counter value={infants} onChange={setInfants} />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Arrival Flight Number</label>
                  <input className="form-input" defaultValue="UL 101" />
                </div>
                <div className="form-group">
                  <label className="form-label">Pickup Location</label>
                  <input className="form-input" defaultValue="Bandaranaike Int. Airport" />
                </div>
                <div className="form-group">
                  <label className="form-label">Drop Location</label>
                  <input className="form-input" defaultValue="Colombo Hotel" />
                </div>
              </div>
            </div>
          </section>

          {/* Trip & Journey Customization */}
          <section className="card">
            <h2 className="card__title">
              🗺 Trip &amp; Journey <span className="accent">Customization</span>
            </h2>
            <div className="form-grid">
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Field Type</label>
                  <select className="form-input form-select">
                    <option>Nature &amp; Wildlife</option>
                    <option>Cultural</option>
                    <option>Adventure</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Selected Tour Route</label>
                  <div className="route-tag">
                    Colombo → Sigiriya → Kandy
                    <button className="route-tag__change">Change</button>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input className="form-input" placeholder="mm/dd/yyyy" type="date" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input className="form-input" type="time" />
                  </div>
                </div>
              </div>
              <div className="form-col">
                {/* Map placeholder */}
                <div className="map-placeholder">
                  {/* TODO: Replace with real Google Maps embed or Leaflet map */}
                  <img
                    src="https://maps.googleapis.com/maps/api/staticmap?center=Colombo,Sri+Lanka&zoom=9&size=400x220&maptype=roadmap&markers=color:blue%7CColombo,Sri+Lanka&markers=color:red%7CSigiriya,Sri+Lanka&key=YOUR_GOOGLE_MAPS_API_KEY"
                    alt="Tour route map"
                    className="map-placeholder__img"
                    onError={(e) => {
                      // Fallback when no API key
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="map-placeholder__fallback">
                    {/* Shown when Maps API key isn't set */}
                    <span>🗺</span>
                    <p>Map preview</p>
                    <small>Add Google Maps API key to enable</small>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN – Booking Summary */}
        <aside className="booking-summary">
          <h3 className="booking-summary__title">Booking Summary</h3>
          <div className="booking-summary__row">
            <span>Tour Route</span>
            <span>Cultural Triangle</span>
          </div>
          <div className="booking-summary__row">
            <span>Vehicle</span>
            <span>Standard Sedan</span>
          </div>
          <div className="booking-summary__row">
            <span>Group</span>
            <span>
              {adults} Adults, {children} Children
            </span>
          </div>
          <div className="booking-summary__total">
            <span>Estimated Total</span>
            <strong>$450.00</strong>
          </div>
          <p className="booking-summary__note">
            ℹ Final price will be confirmed after flight details are verified by our concierge.
          </p>

          {/* Food promo image */}
          {/* TODO: Replace src with your own Sri Lankan food image */}
          <div className="promo-img-wrap">
            <img src={FOOD_PROMO} alt="Authentic Sri Lankan culinary experiences" className="promo-img" />
            <p className="promo-img__caption">Explore authentic culinary experiences with Voyara.</p>
          </div>
        </aside>
      </div>

      {/* ── Vehicle Preview & Change ── */}
      <section className="card vehicle-section">
        <h2 className="card__title">
          🚗 Vehicle <span className="accent">Preview</span> &amp; Change
        </h2>
        <div className="vehicle-grid">
          {VEHICLES.map((v) => (
            <div
              key={v.id}
              className={`vehicle-card ${selectedVehicle === v.id ? "vehicle-card--selected" : ""}`}
              onClick={() => setSelectedVehicle(v.id)}
            >
              {/* TODO: Replace v.img with your actual car photos */}
              <img src={v.img} alt={v.tier} className="vehicle-card__img" />
              <p className="vehicle-card__tier">{v.tier}</p>
              <p className="vehicle-card__label">({v.label})</p>
              <button
                className={`vehicle-card__btn ${selectedVehicle === v.id ? "vehicle-card__btn--selected" : ""}`}
              >
                {selectedVehicle === v.id ? "SELECTED" : v.action}
              </button>
            </div>
          ))}
        </div>
        <div className="vehicle-actions">
          <button className="btn btn--cancel">Cancel Booking</button>
          <button className="btn btn--confirm">Confirm Booking</button>
        </div>
      </section>
    </>
  );
}

function MyBookingsSection() {
  return (
    <div className="my-bookings">
      <div className="my-bookings__header">
        <h2 className="my-bookings__title">
          My <span className="accent">Bookings</span>
        </h2>
        <p className="my-bookings__sub">
          Manage your upcoming luxury travel experiences, track your premium chauffeurs in real-time,
          and view your complete journey history across Sri Lanka.
        </p>
      </div>

      <div className="bookings-layout">
        {/* LEFT – Tables */}
        <div className="bookings-tables">
          {/* Upcoming Journeys */}
          <section className="card">
            <div className="table-header">
              <h3 className="table-header__title">Upcoming Journeys</h3>
              <div className="table-header__actions">
                <button className="icon-btn">⚙</button>
                <button className="icon-btn">🔍</button>
              </div>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Date</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {UPCOMING.map((b) => (
                    <tr key={b.id}>
                      <td className="booking-id">{b.id}</td>
                      <td>{b.date}</td>
                      <td>{b.vehicle}</td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td>
                        {b.hasMore ? (
                          <button className="link-btn">More Details →</button>
                        ) : (
                          <button className="link-btn link-btn--muted">More Details</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span>Showing 4 of 24 bookings</span>
              <div className="pagination">
                <button className="page-btn">Prev</button>
                <button className="page-btn">Next</button>
              </div>
            </div>
          </section>

          {/* Booking History */}
          <section className="card">
            <div className="table-header">
              <h3 className="table-header__title">Booking History</h3>
              <button className="icon-btn">⚙</button>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Date</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {HISTORY.map((b) => (
                    <tr key={b.id}>
                      <td className="booking-id">{b.id}</td>
                      <td>{b.date}</td>
                      <td>{b.vehicle}</td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span>Showing 2 of 15 past bookings</span>
              <button className="link-btn">View All History</button>
            </div>
          </section>

          {/* Service Cards */}
          <div className="service-cards">
            <div className="service-card service-card--blue">
              <span className="service-card__icon">🎩</span>
              <h4 className="service-card__title">VIP Concierge</h4>
              <p className="service-card__desc">
                24/7 dedicated support for all your luxury travel requirements and modifications.
              </p>
            </div>
            <div className="service-card service-card--pink">
              <span className="service-card__icon">🛡</span>
              <h4 className="service-card__title">Travel Insurance</h4>
              <p className="service-card__desc">
                Your journey is fully protected under our global premium travel insurance coverage.
              </p>
            </div>
            <div className="service-card service-card--gray">
              <span className="service-card__icon">📄</span>
              <h4 className="service-card__title">Tax Invoices</h4>
              <p className="service-card__desc">
                Download detailed billing and tax documentation for your corporate or personal records.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT – Live Tracking */}
        <aside className="live-tracking">
          <div className="live-tracking__head">
            <h3 className="live-tracking__title">Live Tracking</h3>
            <span className="live-dot">● LIVE</span>
          </div>
          <p className="live-tracking__booking">Active Booking: #VT-2026-8842</p>

          {/* Map placeholder */}
          <div className="tracking-map">
            {/* TODO: Replace with real live tracking map (Google Maps / Leaflet) */}
            <div className="tracking-map__inner">
              <span className="tracking-map__pin">📍</span>
            </div>
          </div>

          <div className="tracking-info">
            <div className="tracking-info__row">
              <span className="tracking-info__icon">📍</span>
              <div>
                <p className="tracking-info__label">Current Location</p>
                <p className="tracking-info__val">Galle Face Green, Colombo 03</p>
              </div>
            </div>
            <div className="tracking-info__row">
              <span className="tracking-info__icon">🏁</span>
              <div>
                <p className="tracking-info__label">Destination</p>
                <p className="tracking-info__val">Bandaranaike Intl Airport (CMB)</p>
              </div>
            </div>
          </div>

          <div className="tracking-stats">
            <div className="tracking-stat">
              <p className="tracking-stat__label">Estimated Arrival</p>
              <p className="tracking-stat__val">14:45 PM</p>
            </div>
            <div className="tracking-stat">
              <p className="tracking-stat__label">Distance Left</p>
              <p className="tracking-stat__val">32.4 km</p>
            </div>
          </div>

          <div className="tracking-btns">
            <button className="btn btn--confirm tracking-btns__contact">📞 Contact Driver</button>
            <button className="icon-btn">↗</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function BookingPage() {
  const [tab, setTab] = useState("confirm");

  return (
    <div className="booking-page">
      {/* Top nav tabs */}
      <nav className="booking-tabs">
        <button
          className={`booking-tabs__btn ${tab === "confirm" ? "booking-tabs__btn--active" : ""}`}
          onClick={() => setTab("confirm")}
        >
          Confirm Booking
        </button>
        <button
          className={`booking-tabs__btn ${tab === "mybookings" ? "booking-tabs__btn--active" : ""}`}
          onClick={() => setTab("mybookings")}
        >
          My Bookings
        </button>
      </nav>

      {tab === "confirm" && <ConfirmBookingSection />}
      {tab === "mybookings" && <MyBookingsSection />}
    </div>
  );
}