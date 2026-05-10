import { useState, useEffect, useRef } from "react";
import "../Navigation/navbar.css";
import LanguageSwitcher from "../Navigation/language-switcher"; // ← NEW IMPORT

// ── Navigation Menu Items ──────────────────────────────────────────────────
// add menu section: Add or remove nav links here. Set `dropdown` for sub-items.
const NAV_ITEMS = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Service", href: "#" },
  { label: "Packages", href: "#" },
  { label: "Tours", href: "#" },
  {
    label: "Booking",
    href: "#",
    dropdown: [
      { label: "Individual Booking", href: "#" },
      { label: "Couple Booking", href: "#" },
      { label: "Group Booking", href: "#" },
    ],
  },
  { label: "Itineraries", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Navbar() {
  // ── State ────────────────────────────────────────────────────────────────
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home"); // ── Tracks active nav item

  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  // ── Close dropdown on outside click (security: no stale open menus) ─────
  useEffect(() => {
    function handleOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileOpen(false);
        setMobileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ── Close mobile menu on resize to desktop ───────────────────────────────
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 900) {
        setMobileOpen(false);
        setMobileDropdownOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Prevent body scroll when mobile menu is open ─────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
    setMobileDropdownOpen(false);
  };

  const handleBookingClick = (e) => {
    e.preventDefault();
    setDropdownOpen((prev) => !prev);
  };

  const handleMobileBookingClick = (e) => {
    e.preventDefault();
    setMobileDropdownOpen((prev) => !prev);
  };

  const handleDropdownLinkClick = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    setMobileDropdownOpen(false);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <header className="vt-navbar" ref={navRef}>
      <nav className="vt-navbar__container">
        {/* ── LEFT: Hamburger (mobile only) ── */}
        {/* Mobile responsive: 3-line hamburger shown on left for small screens */}
        <button
          className={`vt-navbar__hamburger${mobileOpen ? " vt-navbar__hamburger--active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          <span className="vt-navbar__hamburger-line"></span>
          <span className="vt-navbar__hamburger-line"></span>
          <span className="vt-navbar__hamburger-line"></span>
        </button>

        {/* ── CENTER-LEFT: Logo + Brand ── */}
        {/* add image: Replace src with your actual logo path e.g. "/assets/logo.png" */}
        <a href="#" className="vt-navbar__brand">
          <img
            src="/assets/logo.png"
            alt="Voyara Tours lighthouse logo"
            className="vt-navbar__logo"
          />
        </a>

        {/* ── DESKTOP NAV LINKS ── */}
        {/* add menu section: Desktop nav rendered from NAV_ITEMS array */}
        <div className="vt-navbar__nav-wrapper">
          <span className="vt-navbar__nav-label">Navigation</span>
          <ul className="vt-navbar__menu">
            {NAV_ITEMS.map((item) =>
              item.dropdown ? (
                // ── Booking dropdown item ──────────────────────────────────
                <li
                  key={item.label}
                  className={`vt-navbar__menu-item vt-navbar__menu-item--has-dropdown${dropdownOpen ? " vt-navbar__menu-item--open" : ""}`}
                  ref={dropdownRef}
                >
                  <a
                    href={item.href}
                    className={`vt-navbar__menu-link${activeItem === item.label ? " vt-navbar__menu-link--active" : ""}`}
                    onClick={(e) => {
                      handleBookingClick(e);
                      setActiveItem(item.label);
                    }}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    {item.label}
                    <span
                      className="vt-navbar__caret"
                      aria-hidden="true"
                    ></span>
                  </a>

                  {/* ── Dropdown panel ── */}
                  <ul
                    className={`vt-navbar__dropdown${dropdownOpen ? " vt-navbar__dropdown--open" : ""}`}
                    role="menu"
                  >
                    {item.dropdown.map((sub) => (
                      <li
                        key={sub.label}
                        className="vt-navbar__dropdown-item"
                        role="none"
                      >
                        <a
                          href={sub.href}
                          className="vt-navbar__dropdown-link"
                          role="menuitem"
                          onClick={handleDropdownLinkClick}
                        >
                          {sub.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                // ── Regular nav item ──────────────────────────────────────
                <li key={item.label} className="vt-navbar__menu-item">
                  <a
                    href={item.href}
                    className={`vt-navbar__menu-link${activeItem === item.label ? " vt-navbar__menu-link--active" : ""}`}
                    onClick={() => setActiveItem(item.label)}
                  >
                    {item.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* ── RIGHT: Profile Avatar ── */}
        {/* add image: Replace src with dynamic user avatar or a static placeholder */}
        <div className="vt-navbar__profile">
          <img
            src="/assets/avatar.png"
            alt="User profile"
            className="vt-navbar__avatar"
          />
        </div>

        {/* ── RIGHT: Language Switcher ── */}
        {/* NEW: replaces the static "LNG" button */}
        <LanguageSwitcher />
      </nav>

      {/* ── MOBILE DRAWER ── */}
      {/* Mobile responsive: full drawer slides in from left */}
      <div
        className={`vt-navbar__mobile-drawer${mobileOpen ? " vt-navbar__mobile-drawer--open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        {/* ── Mobile Logo ── */}
        {/* add image: Mobile drawer logo */}
        <div className="vt-navbar__mobile-brand">
          <img
            src="/assets/logo.png"
            alt="Voyara Tours"
            className="vt-navbar__mobile-logo"
          />
          <span className="vt-navbar__mobile-brand-name">Voyara Tours</span>
        </div>

        {/* ── Mobile Menu Links ── */}
        {/* add menu section: Mobile menu rendered from same NAV_ITEMS array */}
        <ul className="vt-navbar__mobile-menu">
          {NAV_ITEMS.map((item) =>
            item.dropdown ? (
              <li
                key={item.label}
                className="vt-navbar__mobile-item vt-navbar__mobile-item--has-dropdown"
              >
                <button
                  className={`vt-navbar__mobile-link vt-navbar__mobile-link--dropdown${mobileDropdownOpen ? " vt-navbar__mobile-link--dropdown-open" : ""}`}
                  onClick={handleMobileBookingClick}
                  aria-expanded={mobileDropdownOpen}
                >
                  {item.label}
                  <span
                    className="vt-navbar__mobile-caret"
                    aria-hidden="true"
                  ></span>
                </button>

                {/* ── Mobile Dropdown ── */}
                <ul
                  className={`vt-navbar__mobile-submenu${mobileDropdownOpen ? " vt-navbar__mobile-submenu--open" : ""}`}
                >
                  {item.dropdown.map((sub) => (
                    <li key={sub.label} className="vt-navbar__mobile-subitem">
                      <a
                        href={sub.href}
                        className="vt-navbar__mobile-sublink"
                        onClick={handleDropdownLinkClick}
                      >
                        {sub.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.label} className="vt-navbar__mobile-item">
                <a
                  href={item.href}
                  className="vt-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ),
          )}
        </ul>
      </div>

      {/* ── Mobile Overlay (closes drawer on backdrop click) ── */}
      {mobileOpen && (
        <div
          className="vt-navbar__overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
