import "../Footer/footer.css";
import Footer_Icon from "../../assets/Images/footericon.png";

// --- Social Media Icons (SVG inline) ---
const IconEmail = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const IconAt = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.4 7" />
  </svg>
);

const IconFacebook = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const IconLocation = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// --- Quick Links data ---
const quickLinks = [
  { label: "Home", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Services", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Booking", href: "#" },
];

// --- Social media links ---
const socialLinks = [
  {
    icon: <IconEmail />,
    href: "mailto:voyaraadventures@gmail.com",
    label: "Email Us",
  },
  { icon: <IconAt />, href: "#", label: "Tag Us" },
  { icon: <IconFacebook />, href: "#", label: "Facebook" },
  { icon: <IconLocation />, href: "#", label: "Find Us" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* ── Brand Column ── */}
        <div className="footer__brand">
          <img
            src={Footer_Icon}
            alt="Voyara Tours logo"
            className="footer__logo"
          />
          <div className="footer__brand-text">
            <h2 className="footer__brand-name">Voyara Tours</h2>
            <p className="footer__tagline">
              Experience the ultimate island lifestyle along Sri Lanka's
              pristine southern and eastern coasts.
            </p>
          </div>
        </div>

        {/* ── Quick Links Column ── */}
        <div className="footer__links">
          <h3 className="footer__col-title">Quick Links</h3>
          <nav className="footer__nav">
            {quickLinks.map((link) => (
              <a key={link.label} href={link.href} className="footer__nav-link">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* ── Contact Column ── */}
        <div className="footer__contact">
          <h3 className="footer__col-title">Contact Us.</h3>
          <p className="footer__contact-label">Address:</p>
          <p className="footer__contact-value">No 33, Galle Road, Colombo.</p>
          <p className="footer__contact-label">Phone:</p>
          <p className="footer__contact-value">+9475 876 5674</p>
          <p className="footer__contact-label">Email:</p>
          <p className="footer__contact-value">voyaraadventures@gmail.com</p>
        </div>

        {/* ── Social Icons Column ── */}
        <div className="footer__social">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="footer__social-icon"
              aria-label={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer__bottom">
        <p className="footer__copy">
          © 2026 Voyara Adventures Tourism. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
