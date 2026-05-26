import "../Style/contact-page.css";

const Contact = () => {
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">
            <span className="contact-hero-title-highlight">Contact</span> Us
          </h1>
          <p className="contact-hero-description">
            Get in touch with <strong>Voyara Adventures Tourism</strong> for bookings,
            inquiries, or assistance. Our team is here to help you plan your
            perfect trip across Sri Lanka with personalized, reliable service.
          </p>
          <button className="contact-taxi-btn">
            <span className="contact-taxi-icon">⊕</span> Taxi Service
          </button>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="contact-details-section">
        <h2 className="contact-details-heading">Our Contact Details</h2>

        <div className="contact-details-card">
          <div className="contact-detail-item">
            <div className="contact-detail-icon">
              <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </div>
            <p className="contact-detail-label">Phone</p>
            <p className="contact-detail-value">+94712547851</p>
          </div>

          <div className="contact-detail-item">
            <div className="contact-detail-icon">
              <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <p className="contact-detail-label">Address</p>
            <p className="contact-detail-value">No 97, Rambukkana.</p>
          </div>

          <div className="contact-detail-item">
            <div className="contact-detail-icon">
              <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </div>
            <p className="contact-detail-label">Email</p>
            <p className="contact-detail-value">Voyaraadventure@gmail.com</p>
          </div>
        </div>

        {/* Get in Touch Form Section */}
        <div className="contact-form-section">
          <div className="contact-form-left">
            <h2 className="contact-form-left-title">
              Get in Touch with Us!
            </h2>
            <p className="contact-form-left-subtitle">
              We're Here to Help You Explore!
            </p>
          </div>

          <div className="contact-form-right">
            <div className="contact-form-group">
              <label className="contact-form-label">First Name</label>
              <input className="contact-form-input" type="text" placeholder="Text Box" />
            </div>
            <div className="contact-form-group">
              <label className="contact-form-label">Last Name</label>
              <input className="contact-form-input" type="text" placeholder="Text Box" />
            </div>
            <div className="contact-form-group">
              <label className="contact-form-label">WhatsApp Number</label>
              <input className="contact-form-input" type="text" placeholder="Text Box" />
            </div>
            <div className="contact-form-group">
              <label className="contact-form-label">Your Email Address</label>
              <input className="contact-form-input" type="email" placeholder="Text Box" />
            </div>
            <div className="contact-form-group">
              <label className="contact-form-label">Message</label>
              <textarea className="contact-form-textarea" placeholder="Text Box"></textarea>
            </div>

            <button className="contact-submit-btn">Confirm Booking</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;