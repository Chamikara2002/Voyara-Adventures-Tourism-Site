import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import "../Style/home-page.css";
//import maskimage from "../assets/Images/maskimage.png";
//import sun from "../assets/Images/sun.png";
//import moon from "../assets/Images/moon";
import full_opacity from "../assets/Images/full_opacity.png";
import half_opasity from "../assets/Images/half_opacity.png";
import sigiriya from "../assets/Images/sigiriya.png";
import anuradhapura from "../assets/Images/anuradhapura.png";
import polonnaruwa from "../assets/Images/polonnaruwa.png";
import kandy from "../assets/Images/kandy.png";
import trincomalee from "../assets/Images/trincomalee.png";
import yapahuwa from "../assets/Images/yapahuwa.png";

// -------------- Sri Lankan Location Data
// Each location has: display name, IANA timezone, and the path to its landmark
// transparent PNG image. Six iconic landmarks of Sri Lanka.
//
// add images: Replace each `landmark` path with your actual transparent PNG.
// Recommended size: 400–800px tall, transparent background.
// Naming convention: /assets/landmarks/<name>-silhouette.png
//
// Landmark image display notes:
//   • The active landmark renders in .vt-home__landmark-spotlight (center-bottom)
//   • CSS class vt-home--location-<key> is added to .vt-home so per-location
//     sizing tweaks can be made in CSS without touching JSX.
const LOCATIONS = [
  {
    key: "sigiriya",
    label: "Sigiriya",
    timezone: "Asia/Colombo",
    // add images: Sigiriya Rock Fortress transparent PNG
    description: "The Lion Rock Fortress",
  },
  {
    key: "aukana",
    label: "Aukana",
    timezone: "Asia/Colombo",
    // add images: Aukana Buddha Statue transparent PNG
    description: "The Standing Buddha Statue",
  },
  {
    key: "polonnaruwa",
    label: "Polonnaruwa",
    timezone: "Asia/Colombo",
    // add images: Polonnaruwa Ancient City transparent PNG
    description: "The Ancient Royal City",
  },
  {
    key: "sripada",
    label: "Sri Pada",
    timezone: "Asia/Colombo",
    // add images: Sri Pada (Adam's Peak) transparent PNG
    description: "The Sacred Mountain",
  },
  {
    key: "ruwanweli",
    label: "Anuradhapura",
    timezone: "Asia/Colombo",
    // add images: Ruwanweli Maha Seya stupa transparent PNG
    description: "Ruwanweli Maha Seya",
  },
  {
    key: "srimaha",
    label: "Sri Maha Bodhi",
    timezone: "Asia/Colombo",
    // add images: Sri Maha Bodhi sacred tree transparent PNG
    description: "The Sacred Bodhi Tree",
  },
];

// -------------- Weather API Placeholder
// Replace this function with a real API call to fetch live weather.
// Recommended API: OpenWeatherMap — https://openweathermap.org/api
//
// Expected return: one of the WEATHER_VARIANTS keys for the given period.
// Example integration:
//   const res = await fetch(
//     `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
//   );
//   const data = await res.json();
//   const conditionId = data.weather[0].id;
//   if (conditionId >= 200 && conditionId < 300) return "stormy";
//   if (conditionId >= 300 && conditionId < 600) return "rainy";
//   if (conditionId >= 600 && conditionId < 700) return "cloudy";
//   if (conditionId >= 700 && conditionId < 800) return "misty";
//   if (conditionId === 800) return "clear";
//   return "partly-cloudy";
async function fetchWeatherForLocation(/* locationKey */) {
  // TODO: Replace with real weather API call.
  // Currently returns null so the system falls back to random weather rotation.
  return null;
}

// -------------- Environment Period Configuration
// Each period maps to a real-world hour range (24h clock).
// The period key becomes the `data-env` attribute on .vt-home — all visual
// changes (sky colour, overlay tint, particles, sun/moon position, weather)
// are driven purely by CSS selectors on that attribute. No inline styles.
//
// Period boundaries (hour is 0–23):
//   dawn    → 04:00 – 05:59   soft pink/purple pre-sunrise glow
//   morning → 06:00 – 11:59   warm golden-hour / bright daylight
//   noon    → 12:00 – 16:59   high-sun blue sky, harsh midday light
//   evening → 17:00 – 19:59   orange/amber sunset palette
//   night   → 20:00 – 03:59   deep navy/indigo, stars, moonlight
const ENV_PERIODS = [
  { key: "dawn", startH: 4, endH: 5, label: "Dawn", icon: "🌅" },
  { key: "morning", startH: 6, endH: 11, label: "Morning", icon: "☀️" },
  { key: "noon", startH: 12, endH: 16, label: "Noon", icon: "🌤️" },
  { key: "evening", startH: 17, endH: 19, label: "Evening", icon: "🌇" },
  { key: "night", startH: 20, endH: 3, label: "Night", icon: "🌙" },
];

// -------------- Weather State Pool per Period
// Weather variants add an extra CSS modifier class: vt-home--weather-<variant>
// The hook picks one randomly when the period first initialises, then re-picks
// every WEATHER_CHANGE_MS milliseconds to simulate natural variation.
const WEATHER_VARIANTS = {
  dawn: ["clear", "misty", "cloudy"],
  morning: ["clear", "sunny", "partly-cloudy", "rainy"],
  noon: ["clear", "sunny", "partly-cloudy", "stormy"],
  evening: ["clear", "cloudy", "golden", "rainy"],
  night: ["clear", "starry", "cloudy", "misty"],
};

// How often (ms) the weather variant randomly cycles within the same period
const WEATHER_CHANGE_MS = 90_000; // 90 seconds

// -------------- Determine Current Environment Period
// Pure function — no side effects. Returns one of the ENV_PERIODS keys.
// Handles the night period which wraps across midnight (20:00–03:59).
// @param  {number} h  Integer hour (0–23)
// @returns {string}   Period key: "dawn" | "morning" | "noon" | "evening" | "night"
function getPeriodForHour(h) {
  // Night wraps midnight: startH > endH means it spans 20:00–03:59
  for (const p of ENV_PERIODS) {
    if (p.startH <= p.endH) {
      if (h >= p.startH && h <= p.endH) return p.key;
    } else {
      // Wrapping period (e.g. night: 20 → 3)
      if (h >= p.startH || h <= p.endH) return p.key;
    }
  }
  return "morning"; // fallback
}

// -------------- Pick a Random Weather Variant for the Current Period
// Selects one weather variant at random from WEATHER_VARIANTS[periodKey].
// Falls back to "clear" if the period key is not found.
// @param  {string} periodKey  One of the ENV_PERIODS keys
// @returns {string}           Weather variant e.g. "clear", "rainy", "stormy"
function pickWeather(periodKey) {
  const variants = WEATHER_VARIANTS[periodKey] ?? ["clear"];
  return variants[Math.floor(Math.random() * variants.length)];
}

// -------------- Sun/Moon Arc Calculator
// Computes the sun or moon position along a smooth arc across the sky based on
// the current time expressed as a fraction of the 24-hour day (0.0–1.0).
//
// Arc model:
//   • Sun rises East (left) at ~06:00, reaches zenith at 12:00, sets West
//     (right) at ~19:00.
//   • Moon mirrors the sun: rises after sunset and sets before sunrise.
//   • Both travel along a parabolic arc: y = 1 − 4(x − 0.5)².
//     x=0 → far left at horizon; x=0.5 → top-center zenith; x=1 → far right.
//
// Returns CSS custom-property values (percentage strings) consumed by the
// existing --env-sun-x / --env-sun-y variables via the period class cascade.
// These are set as data attributes (data-sun-x, data-sun-y) on .vt-home
// and read by CSS via `attr()` — keeping all rendering in CSS.
//
// NOTE: The returned values are used to generate CSS variable override strings
// that are injected via a <style> tag scoped to the section (still no inline
// style on any element). See the `<style>` block rendered inside .vt-home.
function computeSunMoonArc(hourDecimal) {
  // Normalise hour to 0-24 range
  const h = ((hourDecimal % 24) + 24) % 24;

  // -------------- Sun Arc (active 05:00 – 20:00)
  // Map 05:00 → 0.0 (left horizon), 12:30 → 0.5 (zenith), 20:00 → 1.0 (right)
  const sunStart = 5; // hour sun appears at left horizon
  const sunEnd = 20; // hour sun disappears at right horizon
  const sunRange = sunEnd - sunStart;

  let sunX = 0,
    sunY = 0,
    sunVisible = false;
  if (h >= sunStart && h <= sunEnd) {
    sunVisible = true;
    const t = (h - sunStart) / sunRange; // 0.0 (E) → 1.0 (W)
    sunX = t * 100; // left% across hero
    // Parabolic arc: highest at t=0.5, horizon at t=0 and t=1
    const arcH = 1 - 4 * Math.pow(t - 0.5, 2); // 0 at edges, 1 at peak
    sunY = 90 - arcH * 78; // % from top: 90% horizon → 12% zenith
  }

  // -------------- Moon Arc (active 19:00 – 07:00, wraps midnight)
  // Moon arc mirrors sun: rises when sun sets and sets when sun rises.
  const moonStart = 19;
  const moonEnd = 7 + 24; // treated as 31 for wrap math
  const moonRange = moonEnd - moonStart; // 12 hours

  // Normalise h for moon (add 24 if h < moonStart to handle wrap)
  const hMoon = h < moonStart ? h + 24 : h;
  let moonX = 0,
    moonY = 0,
    moonVisible = false;
  if (hMoon >= moonStart && hMoon <= moonEnd) {
    moonVisible = true;
    const t = (hMoon - moonStart) / moonRange;
    moonX = t * 100;
    const arcH = 1 - 4 * Math.pow(t - 0.5, 2);
    moonY = 90 - arcH * 70;
  }

  return { sunX, sunY, sunVisible, moonX, moonY, moonVisible };
}

// -------------- Get Current Hour in a Given Timezone
// Uses Intl.DateTimeFormat to extract the local hour for any IANA timezone.
// Returns a decimal hour (e.g. 14.5 for 14:30) for smooth arc computation.
// Falls back to system local hour if the timezone is invalid or unsupported.
// @param  {string} timezone  IANA timezone string e.g. "Asia/Colombo"
// @returns {number}          Decimal hour 0.0–23.99
function getHourInTimezone(timezone) {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).formatToParts(now);

    const hourPart = parts.find((p) => p.type === "hour");
    const minutePart = parts.find((p) => p.type === "minute");
    const h = parseInt(hourPart?.value ?? "0", 10);
    const m = parseInt(minutePart?.value ?? "0", 10);
    return h + m / 60; // decimal hour e.g. 14.5 for 14:30
  } catch {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  }
}

// -------------- useEnvironment Hook
// Reads the real-world clock and derives the current sky period, weather
// variant, and sun/moon arc positions for the selected Sri Lankan location.
// Supports an optional timeOverride (decimal hour 0–24) for the UI time slider.
//
// -------------- Three concerns, three patterns — all lint rules satisfied
//
//  1. PROP-DERIVED values (period, arc, hourDecimal)
//     → Computed by useMemo during render. Pure functions of props only.
//       No setState, no ref reads/writes inside the memo.
//       ✅ react-hooks/set-state-in-effect  — no setState in any effect body
//       ✅ react-hooks/refs                 — no ref access inside useMemo
//
//  2. WEATHER state (randomly chosen; rotated by a timer)
//     → Stored in useState. Cannot be derived from props alone.
//       Updated ONLY inside setInterval callbacks — never synchronously
//       in an effect body.
//       ✅ react-hooks/set-state-in-effect
//
//  3. LIVE CLOCK arc/hour (smooth 10-second updates when no override)
//     → Stored in two useState values (clockArc, clockHour).
//       Updated by setInterval callbacks — external subscription pattern.
//       ✅ react-hooks/set-state-in-effect
//
//  Refs (tzRef, overrideRef, periodRef) are written ONLY inside useEffect
//  bodies — never during render — providing stale-closure-safe access to the
//  latest prop values inside the interval callbacks.
//
function useEnvironment(timezone = "Asia/Colombo", timeOverride = null) {
  // -------------- 1. PROP-DERIVED values — pure render computation (no setState)
  // period, arc, hourDecimal are entirely determined by the two props.
  // useMemo recomputes synchronously whenever the props change — no effect,
  // no setState, no refs touched inside the callback.
  const { period, arc, hourDecimal } = useMemo(() => {
    const h =
      timeOverride !== null ? timeOverride : getHourInTimezone(timezone);
    const hFloor = Math.floor(h);
    return {
      hourDecimal: h,
      period: getPeriodForHour(hFloor),
      arc: computeSunMoonArc(h),
    };
  }, [timezone, timeOverride]);

  // -------------- 2. WEATHER state — only value that requires useState
  // Randomly initialised on mount; later rotated by the weather timer.
  // The lazy initialiser is safe to call getHourInTimezone() in (runs once).
  const [weather, setWeather] = useState(() => {
    const h =
      timeOverride !== null ? timeOverride : getHourInTimezone(timezone);
    return pickWeather(getPeriodForHour(Math.floor(h)));
  });

  // -------------- 3. LIVE CLOCK arc/hour — useState driven by setInterval callbacks
  // Initialised from the useMemo values so the first render is correct.
  // The setInterval callbacks update these every 10 s for smooth arc movement.
  const [clockArc, setClockArc] = useState(() => arc);
  const [clockHour, setClockHour] = useState(() => hourDecimal);

  // -------------- Refs for stale-closure prevention inside callbacks
  // Declared here; written ONLY inside the useEffect below (after commit).
  // Never read or written during the render phase itself.
  const periodRef = useRef(period);
  const tzRef = useRef(timezone);
  const overrideRef = useRef(timeOverride);

  // Sync refs to latest values after every commit.
  // Writing .current inside useEffect is the React-compliant pattern.
  // No dep-array → runs after every render, keeping refs always current.
  useEffect(() => {
    periodRef.current = period;
    tzRef.current = timezone;
    overrideRef.current = timeOverride;
  });

  // -------------- Clock tick subscriptions — setState inside callbacks only
  // All setWeather / setClockArc / setClockHour calls below are inside
  // setInterval callbacks. React explicitly permits this (external subscription
  // pattern) and the react-hooks/set-state-in-effect rule does NOT fire.
  useEffect(() => {
    // When a manual override is active the slider drives the arc — no clock tick needed.
    if (overrideRef.current !== null) return;

    // Arc tick (every 10 s) — smooth sun/moon movement across the sky.
    // Only arc + hour are updated; period and weather are stable until 60 s tick.
    // setState inside setInterval callback = external subscription ✓
    const arcTick = setInterval(() => {
      const h = getHourInTimezone(tzRef.current);
      setClockArc(computeSunMoonArc(h));
      setClockHour(h);
    }, 10_000);

    // Clock tick (every 60 s) — re-evaluate period; pick new weather on change.
    // setState inside setInterval callback = external subscription ✓
    const clockTick = setInterval(() => {
      const h = getHourInTimezone(tzRef.current);
      const newPeriod = getPeriodForHour(Math.floor(h));
      setClockArc(computeSunMoonArc(h));
      setClockHour(h);
      // Change weather only when the period boundary is crossed
      if (newPeriod !== periodRef.current) {
        setWeather(pickWeather(newPeriod));
        periodRef.current = newPeriod; // keep ref in sync for next tick
      }
    }, 60_000);

    // Weather rotation (every WEATHER_CHANGE_MS) — natural variation within period.
    // setState inside setInterval callback = external subscription ✓
    const weatherTick = setInterval(() => {
      setWeather(pickWeather(periodRef.current));
    }, WEATHER_CHANGE_MS);

    // Weather API tick — placeholder; replace fetchWeatherForLocation with a real
    // API call. setState inside async callback = external subscription ✓
    const weatherApiTick = setInterval(async () => {
      const apiWeather = await fetchWeatherForLocation(tzRef.current);
      if (apiWeather) setWeather(apiWeather);
    }, 300_000); // poll every 5 minutes

    // Cleanup: clear all intervals on unmount or when override-nullability flips
    return () => {
      clearInterval(arcTick);
      clearInterval(clockTick);
      clearInterval(weatherTick);
      clearInterval(weatherApiTick);
    };
    // Re-subscribe only when the override transitions between null ↔ a value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeOverride !== null]);

  // -------------- Merge prop-derived and clock-driven values
  // Override active  → use useMemo arc (slider-reactive, clock paused)
  // Live clock active → use setInterval-driven clockArc / clockHour
  // period always comes from useMemo (instantly reactive to prop changes)
  const effectiveArc = timeOverride !== null ? arc : clockArc;
  const effectiveHour = timeOverride !== null ? hourDecimal : clockHour;

  // Return the merged environment snapshot.
  // Shape: { period, weather, arc: { sunX, sunY, sunVisible, moonX, moonY, moonVisible }, hourDecimal }
  return { period, weather, arc: effectiveArc, hourDecimal: effectiveHour };
}

// -------------- Slideshow Data
// add images: Replace each `image` value with your actual slide image paths.
// Recommended size: 1920×900px. Add or remove slide objects as needed.
const SLIDES = [
  {
    id: 1,
    // add images: Slide 1 background image
    image: sigiriya,
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
    image: anuradhapura,
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
    image: polonnaruwa,
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
    image: kandy,
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
    image: trincomalee,
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
    image: yapahuwa,
    headingLine1: "Adventure Awaits You in",
    headingHighlight: "Sri Lanka",
    subtext:
      "Thrilling whale watching, surfing and hiking tailored to your pace.",
    btnLabel: "Get Started",
    btnIcon: "⚡",
  },
];

// -------------- Auto-play interval (ms)
const AUTOPLAY_DELAY = 50000;

// -------------- Taxi Service Cards — managed by Super Admin
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

// -------------- Tour Cards — managed by Super Admin
// add images: Replace `image` values with actual tour card images (recommended 600×400px)
// Super Admin: Add/remove tour objects here to update what customers see.
const TOUR_CARDS = [
  {
    id: 1,
    image: "/assets/tours/homagama.jpg", // add images
    title: "Homagama Taxi Service",
    readMore: "#",
  },
  {
    id: 2,
    image: "/assets/tours/kelaniya.jpg", // add images
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
    image: "/assets/tours/polonnaruwa.jpg", // add images
    title: "Polonnaruwa Taxi Service",
    readMore: "#",
  },
  {
    id: 5,
    image: "/assets/tours/jaffna.jpg", // add images
    title: "Jaffna Taxi Service",
    readMore: "#",
  },
  {
    id: 6,
    image: "/assets/tours/galle.jpg", // add images
    title: "Galle Tour Service",
    readMore: "#",
  },
];

// -------------- "Exclusive Rides" Feature Slides
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

// -------------- Itinerary Cards — managed by Super Admin
// add images: Replace `image` values with actual itinerary card images (recommended 800×600px)
// Super Admin: Add/remove objects here to update what customers see.
const ITINERARY_CARDS = [
  {
    id: 1,
    image: "/assets/itineraries/adventure.jpg", // add images
    title: "The Adventure Capital",
    desc: "Nestled along the scenic Kelani River, Kitulgala is the adventure destination for thrill-seekers. This hub of adrenaline activities includes white-water rafting, offering a often-overlooked blend of natural beauty and excitement. Discover the hidden side of Sri Lanka in this adventure haven.",
  },
  {
    id: 2,
    image: "/assets/itineraries/shores.jpg", // add images
    title: "Sea-Kissed Shores & Turquoise Horizons",
    desc: "Sri Lanka's coastline is a breathtaking tapestry of pristine sands and turquoise waters. From the sun-drenched beaches of Mirissa to the surf paradise of Arugam Bay, our itineraries offer a slice of coastal beauty to savour. Discover secluded coves, vibrant coral reef snorkel spots and cultural fishing villages that make the Sri Lankan coastal experience truly unforgettable.",
  },
  {
    id: 3,
    image: "/assets/itineraries/highlands.jpg", // add images
    title: "Misty Highland Escapes",
    desc: "Journey through emerald tea estates and mist-laden mountains in Sri Lanka's stunning hill country. Experience the cool climate of Nuwara Eliya, the cascading waterfalls of Ella, and the ancient rock fortress of Sigiriya on a curated highland adventure.",
  },
  {
    id: 4,
    image: "/assets/itineraries/wildlife.jpg", // add images
    title: "Wildlife & Safari Wonders",
    desc: "Embark on unforgettable wildlife encounters across Sri Lanka's legendary national parks. Spot leopards at Yala, elephants at Minneriya, and whales off the coast of Mirissa. Every safari is expertly guided and tailored to your group.",
  },
];

// -------------- Collect Moments Slide Images — managed by Super Admin
// add images: Replace `image` values (recommended 400×300px)
const MOMENTS_IMAGES = [
  { id: 1, image: "/assets/moments/img1.jpg", alt: "Sri Lanka landscape 1" }, // add images
  { id: 2, image: "/assets/moments/img2.jpg", alt: "Sri Lanka landscape 2" }, // add images
  { id: 3, image: "/assets/moments/img3.jpg", alt: "Sri Lanka landscape 3" }, // add images
  { id: 4, image: "/assets/moments/img4.jpg", alt: "Sri Lanka landscape 4" }, // add images
  { id: 5, image: "/assets/moments/img5.jpg", alt: "Sri Lanka landscape 5" }, // add images
  { id: 6, image: "/assets/moments/img6.jpg", alt: "Sri Lanka landscape 6" }, // add images
];

// -------------- Slide 6 Special Layout Images — managed by Super Admin ─
// When the slideshow reaches Slide 6 (index 5), the hero switches from the
// standard full-bleed slide background to a 6-image mosaic layout.
// This creates a visually distinct "adventure collage" effect unique to slide 6.
//
// add images: Replace each `image` path with your actual adventure/activity images.
// Recommended size: 600×400px for each, consistent aspect ratio preferred.
// The mosaic renders as a 3×2 grid (3 columns, 2 rows) filling the hero area.
//
// Super Admin: Add, remove or reorder images here to update what customers see on Slide 6.
const SLIDE_6_IMAGES = [
  {
    id: 1,
    // add images: Slide 6 mosaic image 1 — e.g. whale watching
    image: "/assets/slide6/whale-watching.jpg",
    alt: "Whale Watching Sri Lanka",
  },
  {
    id: 2,
    // add images: Slide 6 mosaic image 2 — e.g. surfing
    image: "/assets/slide6/surfing.jpg",
    alt: "Surfing Adventure Sri Lanka",
  },
  {
    id: 3,
    // add images: Slide 6 mosaic image 3 — e.g. hiking
    image: "/assets/slide6/hiking.jpg",
    alt: "Mountain Hiking Sri Lanka",
  },
  {
    id: 4,
    // add images: Slide 6 mosaic image 4 — e.g. safari
    image: "/assets/slide6/safari.jpg",
    alt: "Wildlife Safari Sri Lanka",
  },
  {
    id: 5,
    // add images: Slide 6 mosaic image 5 — e.g. diving
    image: "/assets/slide6/diving.jpg",
    alt: "Scuba Diving Sri Lanka",
  },
  {
    id: 6,
    // add images: Slide 6 mosaic image 6 — e.g. zip-lining / rafting
    image: "/assets/slide6/rafting.jpg",
    alt: "White Water Rafting Sri Lanka",
  },
];

// -------------- "Everything You Need to Know" Items — managed by Super Admin
// Super Admin: Add/remove/edit items. layout: "text-right" | "text-left" | "banner" | "image-right"
const ENYTK_ITEMS = [
  {
    id: 1,
    layout: "text-right",
    image: "/assets/enytk/item1.jpg", // add images
    title: "Everything You Need to Know",
    desc: "Experience the true essence of paradise with our premier island-wide tour services, where every mile is crafted for your comfort and wonder. From the golden southern coasts to the rain-covered central highlands, we provide more than just a destination. We offer a seamless, worry-free immersion into the heart of Sri Lanka. With our dedicated 24/7 questions and local expertise, you can trust us to handle every detail of your journey — safe, punctual, and premium travel experiences that capture the hidden beauty of our island.",
    readMore: "#",
  },
  {
    id: 2,
    layout: "text-left",
    image: "/assets/enytk/item2.jpg", // add images
    title: "Everything You Need to Know",
    desc: "Experience the true essence of paradise with our premier island-wide tour services, where every mile is crafted for your comfort and wonder. From the golden southern coasts to the rain-covered central highlands, we provide more than just a destination. We offer a seamless, worry-free immersion into the heart of Sri Lanka. With our dedicated 24/7 questions and local expertise.",
    readMore: "#",
  },
  {
    id: 3,
    layout: "banner",
    image: "/assets/enytk/banner.jpg", // add images
    title: "Everything You Need to Know",
    subtitle:
      "Experience the true essence of paradise with our premier island-wide tour services.",
  },
];

// -------------- Sri Lanka Tour & About US — managed by Super Admin
const SL_TOUR = {
  image: "/assets/sltour/main.jpg", // add images
  desc: "Experience the true essence of paradise with our premier island-wide tour services, where every mile is crafted for your comfort and wonder. From the golden southern coasts to the rain-covered central highlands, we provide more than just a destination. We offer a seamless, worry-free immersion into the heart of Sri Lanka. With our dedicated 24/7 questions and local expertise, you can trust us to handle every detail of your journey. We offer a seamless, worry-free immersion into the heart of Sri Lanka. With our dedicated 24/7 questions and local expertise, you can trust us to handle every detail of your journey that capture the hidden beauty of our island.",
  readMore: "#",
};

const ABOUT_US = {
  image: "/assets/about/main.jpg", // add images
  desc: "Experience the true essence of paradise with our premier island-wide tour services, where every mile is crafted for your comfort and wonder. From the golden southern coasts to the rain-covered central highlands, we provide more than just a destination. We offer a seamless, worry-free immersion into the heart of Sri Lanka. With our dedicated 24/7 questions and local expertise, you can trust us to handle every detail of your journey. We offer a seamless, worry-free immersion into the heart of Sri Lanka. With our dedicated 24/7 questions and local expertise, you can trust us to handle every detail of your journey that capture the hidden beauty of our island.",
  readMore: "#",
};

const DISCOVER_SOUL = {
  image: "/assets/soul/main.jpg", // add images
  desc: "Since our journey began, Voyara Adventures has been more than just a transport service — we are your dedicated curators of authentic Sri Lankan experiences. Sri Manning Boot appetites with professional reliability, we ensure that every mile you travel always delivers golden blend in skills, comfortably, and design memorably. From the bustling streets of Colombo to the hidden coastal gems, let us handle the journey while you focus on creating memories that last a lifetime.",
  seeMore: "#",
};

// -------------- Voyara Tales Blog Cards — managed by Super Admin
// add images: Replace `image` values (recommended 600×400px)
const VOYARA_TALES = [
  {
    id: 1,
    image: "/assets/tales/tale1.jpg", // add images
    caption: "Inspiring travel stories",
  },
  {
    id: 2,
    image: "/assets/tales/tale2.jpg", // add images
    caption: "Inspiring related adventures",
  },
  {
    id: 3,
    image: "/assets/tales/tale3.jpg", // add images
    caption: "Inspiring travel stories",
  },
];

// -------------- Traveller Reviews — pulled from Packages page comments
// Super Admin / Packages page: Travellers submit comments there;
// the approved reviews appear here automatically.
// For wiring to a real backend, replace this array with an API fetch.
const TRAVELLER_REVIEWS = [
  {
    id: 1,
    avatar: "/assets/avatars/avatar1.jpg", // add images — traveller profile photo
    name: "Johna Mundo",
    comment: "Great Driving and visited awesome beautiful places.",
    date: "2026-05-26",
    rating: 5,
  },
  {
    id: 2,
    avatar: "/assets/avatars/avatar2.jpg", // add images
    name: "Johna Mundo",
    comment: "Great Driving and visited awesome beautiful places.",
    date: "2026-05-26",
    rating: 5,
  },
  {
    id: 3,
    avatar: "/assets/avatars/avatar3.jpg", // add images
    name: "Johna Mundo",
    comment: "Great Driving and visited awesome beautiful places.",
    date: "2026-05-26",
    rating: 4,
  },
];

// -------------- Cards per page based on viewport (used for card sliders)
const CARDS_PER_PAGE = 3;
const CARD_AUTOPLAY_MS = 3500;

// -------------- Reusable Card Slider Hook
// Generic paginated slider used by taxi, tour, itinerary, tales, and reviews.
// Manages page state, auto-advance timer, and prev/next/goTo navigation.
// @param  {number} total       Total number of items in the data array
// @param  {number} perPage     How many items to display per page
// @param  {number} autoplayMs  Auto-advance interval in milliseconds
// @returns {{ page, next, prev, goTo, maxPage, resetTimer }}
function useCardSlider(total, perPage, autoplayMs) {
  // Current page index (0-based)
  const [page, setPage] = useState(0);
  // Timer ref for auto-advance interval — kept outside state to avoid re-renders
  const timerRef = useRef(null);
  // Highest valid page index
  const maxPage = Math.ceil(total / perPage) - 1;

  // Advance to next page, wrapping at end
  const next = useCallback(
    () => setPage((p) => (p >= maxPage ? 0 : p + 1)),
    [maxPage],
  );
  // Go back to previous page, wrapping at start
  const prev = useCallback(
    () => setPage((p) => (p <= 0 ? maxPage : p - 1)),
    [maxPage],
  );
  // Jump directly to a specific page index
  const goTo = useCallback((i) => setPage(i), []);

  // Restart the auto-advance interval (called after manual navigation to reset timer)
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, autoplayMs);
  }, [next, autoplayMs]);

  // Start auto-advance on mount; clean up on unmount
  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  return { page, next, prev, goTo, maxPage, resetTimer };
}

export default function Home() {
  // -------------- Hero Slideshow State
  // `current` — index of the active slide (0-based)
  // `direction` — animation direction: "next" (forward) | "prev" (backward)
  // `timerRef`  — interval ref for auto-advance; kept outside state to avoid re-renders
  // `currentRef` — mirrors `current` in a ref so interval callbacks can read it
  //               without stale closure issues
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("next");
  const timerRef = useRef(null);
  const currentRef = useRef(current);
  const total = SLIDES.length;

  // Keep currentRef in sync with the current slide index after every render
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  // advance — moves the slideshow one step in either direction.
  // Sets the CSS entry class direction so transitions animate correctly.
  // @param {"next"|"prev"} dir — direction of navigation
  //   "next" → increments index (wraps at end back to 0)
  //   "prev" → decrements index (wraps at start back to last slide)
  // The `direction` state is consumed by JSX class names:
  //   vt-home__slide--enter-next → new slide enters from the right
  //   vt-home__slide--enter-prev → new slide enters from the left
  const advance = useCallback(
    (dir) => {
      // Set animation direction class BEFORE updating current so CSS picks it up
      setDirection(dir);
      // Wrap-around: % total keeps index within [0, total-1]
      setCurrent((prev) =>
        dir === "next" ? (prev + 1) % total : (prev - 1 + total) % total,
      );
    },
    [total],
  );

  // resetTimer — clears and restarts the auto-advance interval.
  // Called after manual navigation so the 5-second countdown resets.
  // Uses timerRef (not state) to avoid triggering re-renders on interval ID changes.
  // @returns {void}
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current); // cancel any existing interval
    timerRef.current = setInterval(() => advance("next"), AUTOPLAY_DELAY);
  }, [advance]);

  // Start auto-advance on mount; tear down interval on unmount
  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  // goToNext — advance forward and restart the auto-play timer.
  // Bound to the "›" arrow button and ArrowRight key.
  const goToNext = useCallback(() => {
    advance("next");
    resetTimer(); // reset so the next auto-advance starts from now
  }, [advance, resetTimer]);

  // goToPrev — step backward and restart the auto-play timer.
  // Bound to the "‹" arrow button and ArrowLeft key.
  const goToPrev = useCallback(() => {
    advance("prev");
    resetTimer();
  }, [advance, resetTimer]);

  // goTo — jump directly to a named slide index; infers direction for animation.
  // Used by the dot indicators so clicking dot 3 when on dot 1 enters from right.
  // @param {number} index — zero-based target slide index
  const goTo = useCallback(
    (index) => {
      // Infer direction based on target vs current slide position
      const dir = index > currentRef.current ? "next" : "prev";
      setDirection(dir);
      setCurrent(index);
      resetTimer();
    },
    [resetTimer],
  );

  // Keyboard navigation — ArrowRight/ArrowLeft keys control the slideshow
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goToNext, goToPrev]);

  // Convenience reference to the currently active slide data object
  const slide = SLIDES[current];

  // -------------- Slide 6 Special Layout Detection
  // When `current` is 5 (0-based index of Slide 6), activate the mosaic layout.
  // This boolean drives:
  //   1. The vt-home--slide6 CSS class on .vt-home (enables mosaic overlay)
  //   2. Rendering of the SLIDE_6_IMAGES mosaic inside .vt-home__slide6-mosaic
  // The class transitions smoothly via opacity/transform CSS transitions.
  const isSlide6 = current === 5;

  // -------------- Location Switcher State
  // Tracks the currently selected Sri Lankan landmark location.
  // Changes the active landmark PNG and the timezone used for env calculations.
  const [selectedLocationKey, setSelectedLocationKey] = useState(
    LOCATIONS[0].key,
  );
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  // Derive selected location object from key
  const selectedLocation =
    LOCATIONS.find((l) => l.key === selectedLocationKey) ?? LOCATIONS[0];

  // Close dropdown when clicking outside
  const dropdownRef = useRef(null);
  useEffect(() => {
    // Close location dropdown on outside click
    function handleOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLocationDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // -------------- Time Override State (for manual time testing slider)
  // null = use real clock; number 0–24 = override hour
  const [timeOverride, setTimeOverride] = useState(null);
  const [showTimeSlider, setShowTimeSlider] = useState(false);

  // Slider value state (always tracks slider position, even when override is off)
  const [sliderHour, setSliderHour] = useState(() => new Date().getHours());

  // Handle slider change — enables override automatically
  const handleSliderChange = useCallback((e) => {
    const val = parseFloat(e.target.value);
    setSliderHour(val);
    setTimeOverride(val);
  }, []);

  // Reset override to real clock
  const resetToRealTime = useCallback(() => {
    setTimeOverride(null);
    setSliderHour(new Date().getHours());
  }, []);

  // -------------- Real-Time Environmental System
  // Derives period (dawn/morning/noon/evening/night), weather, and sun/moon arc
  // from the real-world clock for the selected location's timezone.
  // These are applied as CSS class modifiers on .vt-home — no inline styles.
  const {
    period: envPeriod,
    weather: envWeather,
    arc: envArc,
    hourDecimal: envHour,
  } = useEnvironment(selectedLocation.timezone, timeOverride);

  // -------------- Bats vs Birds — switch based on period
  // During night / late evening: show bats (waullu). Other times: birds.
  // The CSS classes vt-home--show-birds / vt-home--show-bats toggle visibility.
  const showBats =
    envPeriod === "night" ||
    (envPeriod === "evening" && (envArc?.sunY ?? 0) > 75);

  // -------------- Format decimal hour for display
  const displayHour = timeOverride !== null ? timeOverride : envHour;
  const displayTimeStr = (() => {
    const h = Math.floor(displayHour ?? 0);
    const m = Math.round(((displayHour ?? 0) - h) * 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  })();

  // -------------- Taxi Card Slider
  const taxi = useCardSlider(
    TAXI_CARDS.length,
    CARDS_PER_PAGE,
    CARD_AUTOPLAY_MS,
  );
  const taxiVisible = TAXI_CARDS.slice(
    taxi.page * CARDS_PER_PAGE,
    taxi.page * CARDS_PER_PAGE + CARDS_PER_PAGE,
  );

  // -------------- Tour Card Slider
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

  // -------------- Feature Slider
  const feat = useCardSlider(FEATURE_SLIDES.length, 3, CARD_AUTOPLAY_MS);
  const featVisible = FEATURE_SLIDES.slice(feat.page * 3, feat.page * 3 + 3);

  // -------------- Itinerary Slider (2 cards visible at a time)
  const itin = useCardSlider(ITINERARY_CARDS.length, 2, CARD_AUTOPLAY_MS);
  const itinVisible = ITINERARY_CARDS.slice(itin.page * 2, itin.page * 2 + 2);

  // -------------- Moments Image Slider (5 images visible — scrolling strip)
  const mom = useCardSlider(MOMENTS_IMAGES.length, 5, 2500);
  const momVisible = MOMENTS_IMAGES.slice(mom.page * 5, mom.page * 5 + 5);

  // -------------- Voyara Tales Slider (3 cards)
  const tales = useCardSlider(VOYARA_TALES.length, 3, CARD_AUTOPLAY_MS);
  const talesVisible = VOYARA_TALES.slice(tales.page * 3, tales.page * 3 + 3);

  // -------------- Reviews Slider (3 per page, wraps from Packages comments)
  const reviews = useCardSlider(TRAVELLER_REVIEWS.length, 3, 4000);
  const reviewsVisible = TRAVELLER_REVIEWS.slice(
    reviews.page * 3,
    reviews.page * 3 + 3,
  );

  // -------------- Apply data-bg attributes as CSS backgroundImage (zero inline styles)
  // This single effect handles ALL elements that carry a data-bg attribute,
  // including slide backgrounds, landmark spotlight PNGs, card images, airport
  // images, itinerary cards, moments strip images, ENYTK rows, tale cards,
  // review avatars and any other image element using the data-bg pattern.
  // Running without a dependency array (every render) ensures newly-mounted
  // elements (e.g. after a slider page change) always receive their background.
  //
  // add images: For any new image element, add data-bg="<path>" to the JSX div
  //             and this effect will automatically wire up the backgroundImage.
  useEffect(() => {
    // Select all elements that carry the data-bg image path attribute
    const els = document.querySelectorAll("[data-bg]");
    els.forEach((el) => {
      // Apply as CSS backgroundImage — keeps all styling out of JSX attributes
      el.style.backgroundImage = `url(${el.getAttribute("data-bg")})`;
    });
  });

  // -------------- Render
  return (
    <>
      {/* -------------- Hero Section — enhanced with real-time environment system  */}
      {/*
        CSS class strategy (no inline styles):
          vt-home--env-<period>      → controls sky tone, overlay colour, ambient light
          vt-home--weather-<variant> → adds atmospheric particles / cloud layers
        Both classes transition via CSS so changes feel gradual and natural.
      */}
      <section
        className={[
          "vt-home",
          /* Environment period class — drives sky colour & overlay tint */
          `vt-home--env-${envPeriod}`,
          /* Weather variant class — drives particle/cloud/rain layers */
          `vt-home--weather-${envWeather}`,
          /* Location class — allows per-landmark CSS sizing tweaks */
          `vt-home--location-${selectedLocationKey}`,
          /* Creature class — switches between birds and bats */
          showBats ? "vt-home--show-bats" : "vt-home--show-birds",
          /* Slide 6 class — triggers the 6-image mosaic special layout */
          isSlide6 ? "vt-home--slide6" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Hero slideshow"
        /* data-env is used by CSS attribute selectors as an alternative hook */
        data-env={envPeriod}
        data-weather={envWeather}
        data-location={selectedLocationKey}
      >
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
              {/* add images: Slide background — Ken Burns zoom applied via CSS.
                  The data-bg attribute is picked up by the useEffect data-bg handler
                  below, which applies it as backgroundImage without inline styles. */}
              <div
                className="vt-home__slide-bg"
                data-bg={s.image}
                role="img"
                aria-label={`Slide ${i + 1} background`}
              />
              {/* Dynamic overlay — colour tint shifts with envPeriod via CSS */}
              <div className="vt-home__overlay" aria-hidden="true" />
            </div>
          ))}
        </div>

        {/* -------------- Environment Atmosphere Layer   */}
        {/*
          All child divs are purely CSS-animated — no JS drives their visuals.
          The parent env/weather classes on .vt-home toggle their opacity and
          animation-play-state to activate/deactivate each effect.
          Layer order (z-index within .vt-home__env z:2):
            sky-enhanced → sky → stormclouds → sunrays/moonrays →
            clouds → rain → mist → fog → rainsplash →
            sun → moon → stars → flare → dawn-glow → lightning
        */}
        <div className="vt-home__env" aria-hidden="true">
          {/* Enhanced cinematic sky gradient — richer per-period colours */}
          {/* add images: Pure CSS gradient — no image needed */}
          <div className="vt-home__env-sky-enhanced" img={full_opacity} />

          {/* Base sky gradient layer — fades smoothly between period palettes */}
          <div className="vt-home__env-sky" img={half_opasity} />

          {/* -------------- Six Sri Lankan Landmark Silhouettes (between sky and clouds) -------------- */}
          {/*
            These 6 landmark images are placed ABOVE the sky gradient but BELOW
            the cloud layer so they appear nestled between the sky and the clouds,
            giving a realistic depth-layered scene.

            Image change: Each div uses data-bg to load its transparent PNG.
            The useEffect data-bg handler (below in the component) picks up every
            [data-bg] element after each render and applies it as backgroundImage
            without any inline style on the DOM element.

            Recommended image spec:
              • Format : transparent PNG (no background)
              • Height : 300–600px (taller = more prominent)
              • Width  : match landmark natural proportions
              • Naming : /assets/landmarks/<name>-silhouette.png

            Layer z-order within .vt-home__env:
              sky-enhanced → sky → [THESE 6 LANDMARKS] → stormclouds →
              sunrays → clouds → rain → mist → fog → rainsplash →
              sun → moon → stars → flare → dawn-glow → lightning
          */}

          {/* Landmark Image 1 — Sigiriya Rock Fortress
              Image change: /assets/landmarks/sigiriya-silhouette.png
              Position: far-right dominant column rising above clouds */}
          <div
            className="vt-home__env-landmark vt-home__env-landmark--sigiriya"
            data-bg="/assets/landmarks/sigiriya-silhouette.png"
            role="img"
            aria-label="Sigiriya Rock Fortress silhouette"
          />

          {/* Landmark Image 2 — Aukana Buddha Statue
              Image change: /assets/landmarks/aukana-silhouette.png
              Position: far-left, tall narrow standing figure */}
          <div
            className="vt-home__env-landmark vt-home__env-landmark--aukana"
            data-bg="/assets/landmarks/aukana-silhouette.png"
            role="img"
            aria-label="Aukana Buddha Statue silhouette"
          />

          {/* Landmark Image 3 — Polonnaruwa Ancient City
              Image change: /assets/landmarks/polonnaruwa-silhouette.png
              Position: centre-right, low-spread ruin pillars */}
          <div
            className="vt-home__env-landmark vt-home__env-landmark--polonnaruwa"
            data-bg="/assets/landmarks/polonnaruwa-silhouette.png"
            role="img"
            aria-label="Polonnaruwa Ancient City silhouette"
          />

          {/* Landmark Image 4 — Sri Pada (Adam's Peak)
              Image change: /assets/landmarks/sripada-silhouette.png
              Position: centre, triangular peak piercing the cloud base */}
          <div
            className="vt-home__env-landmark vt-home__env-landmark--sripada"
            data-bg="/assets/landmarks/sripada-silhouette.png"
            role="img"
            aria-label="Sri Pada (Adam's Peak) silhouette"
          />

          {/* Landmark Image 5 — Ruwanweli Maha Seya Stupa
              Image change: /assets/landmarks/ruwanweli-silhouette.png
              Position: centre-left, dome-shaped dagoba */}
          <div
            className="vt-home__env-landmark vt-home__env-landmark--ruwanweli"
            data-bg="/assets/landmarks/ruwanweli-silhouette.png"
            role="img"
            aria-label="Ruwanweli Maha Seya stupa silhouette"
          />

          {/* Landmark Image 6 — Sri Maha Bodhi Sacred Tree
              Image change: /assets/landmarks/srimaha-silhouette.png
              Position: mid-left, wide canopy silhouette */}
          <div
            className="vt-home__env-landmark vt-home__env-landmark--srimaha"
            data-bg="/assets/landmarks/srimaha-silhouette.png"
            role="img"
            aria-label="Sri Maha Bodhi sacred tree silhouette"
          />
          {/* add images: CSS radial-gradient dark cloud masses — no image */}
          <div className="vt-home__env-stormclouds" />

          {/* Sun crepuscular rays — visible morning, noon, evening (clear weather) */}
          {/* add images: CSS conic-gradient rays from sun position — no image */}
          <div className="vt-home__env-sunrays" />

          {/* -------------- Cloud System — 2 Layers (Walakulu / වලාකුළු) 
              Two distinct cloud layers create atmospheric depth:

              LAYER 2 — Back Layer (vt-home__env-clouds--back)
                Rendered first (behind layer 1) — slower drift, slightly smaller.
                7 clouds — opacity pattern: 1,3,4,7 → 50% | 2,5,6 → 100%
                Mimics distant clouds high in the sky.

              LAYER 1 — Front Layer (vt-home__env-clouds--front)
                Rendered second (in front of layer 2) — faster drift, slightly larger.
                7 clouds — opacity pattern: 1,3,4,7 → 100% | 2,5,6 → 50%
                Mimics near clouds at mid-sky level.

              Both layers share --env-cloud-opacity from the environment system so
              they react to period (dawn/morning/noon/evening/night) and weather
              (clear, cloudy, stormy, etc.) identically. Individual cloud alpha is
              stacked ON TOP of the layer opacity via the CSS --cloud-alpha variable.

              add images: Each .vt-home__env-cloud div uses a data-bg attribute to
              load a real cloud PNG. The useEffect data-bg handler applies it as
              backgroundImage automatically. To use real cloud images:
                1. Place your cloud PNG files in /assets/clouds/
                2. Add data-bg="/assets/clouds/cloud-N.png" to each cloud div below
                3. Remove the CSS radial-gradient background from those cloud rules
                4. Recommended cloud image: 600–1200px wide, transparent PNG

              WHERE TO ADD CLOUD IMAGES:
                Front layer clouds → data-bg="/assets/clouds/walakulu-front-N.png"
                Back  layer clouds → data-bg="/assets/clouds/walakulu-back-N.png"
                Naming convention : walakulu-front-1.png … walakulu-front-7.png
                                    walakulu-back-1.png  … walakulu-back-7.png
            */}

          {/* -------------- Cloud Layer 2: Back Layer  */}
          {/*
              Back layer — slower, deeper, more transparent. Renders behind the
              front layer to simulate clouds at a greater altitude/distance.
              Opacity spec: clouds 1,3,4,7 → 50% | clouds 2,5,6 → 100%
          */}
          <div
            className="vt-home__env-clouds vt-home__env-clouds--back"
            aria-hidden="true"
          >
            {/* Back Cloud 1 — opacity: 50% (dim) — large, upper-left */}
            {/* add images: data-bg="/assets/clouds/walakulu-back-1.png" */}
            <div className="vt-home__env-cloud vt-home__env-cloud--b1 vt-home__env-cloud--dim" />

            {/* Back Cloud 2 — opacity: 100% (bright) — medium, upper-centre-left */}
            {/* add images: data-bg="/assets/clouds/walakulu-back-2.png" */}
            <div className="vt-home__env-cloud vt-home__env-cloud--b2 vt-home__env-cloud--bright" />

            {/* Back Cloud 3 — opacity: 50% (dim) — small, high upper-right */}
            {/* add images: data-bg="/assets/clouds/walakulu-back-3.png" */}
            <div className="vt-home__env-cloud vt-home__env-cloud--b3 vt-home__env-cloud--dim" />

            {/* Back Cloud 4 — opacity: 50% (dim) — wide, mid-left */}
            {/* add images: data-bg="/assets/clouds/walakulu-back-4.png" */}
            <div className="vt-home__env-cloud vt-home__env-cloud--b4 vt-home__env-cloud--dim" />

            {/* Back Cloud 5 — opacity: 100% (bright) — large, mid-right */}
            {/* add images: data-bg="/assets/clouds/walakulu-back-5.png" */}
            <div className="vt-home__env-cloud vt-home__env-cloud--b5 vt-home__env-cloud--bright" />

            {/* Back Cloud 6 — opacity: 100% (bright) — medium, centre */}
            {/* add images: data-bg="/assets/clouds/walakulu-back-6.png" */}
            <div className="vt-home__env-cloud vt-home__env-cloud--b6 vt-home__env-cloud--bright" />

            {/* Back Cloud 7 — opacity: 50% (dim) — small, far right */}
            {/* add images: data-bg="/assets/clouds/walakulu-back-7.png" */}
            <div className="vt-home__env-cloud vt-home__env-cloud--b7 vt-home__env-cloud--dim" />
          </div>

          {/* -------------- Cloud Layer 1: Front Layer  */}
          {/*
              Front layer — faster drift, lower altitude, more prominent. Renders
              in front of the back layer to simulate close mid-sky clouds.
              Opacity spec: clouds 1,3,4,7 → 100% | clouds 2,5,6 → 50%
          */}
          <div
            className="vt-home__env-clouds vt-home__env-clouds--front"
            aria-hidden="true"
          >
            {/* Front Cloud 1 — opacity: 100% (bright) — large, mid-left */}
            {/* add images: data-bg="/assets/clouds/walakulu-front-1.png" */}
            <div className="vt-home__env-cloud vt-home__env-cloud--f1 vt-home__env-cloud--bright" />

            {/* Front Cloud 2 — opacity: 50% (dim) — medium, centre-left */}
            {/* add images: data-bg="/assets/clouds/walakulu-front-2.png" */}
            <div className="vt-home__env-cloud vt-home__env-cloud--f2 vt-home__env-cloud--dim" />

            {/* Front Cloud 3 — opacity: 100% (bright) — large, centre */}
            {/* add images: data-bg="/assets/clouds/walakulu-front-3.png" */}
            <div className="vt-home__env-cloud vt-home__env-cloud--f3 vt-home__env-cloud--bright" />

            {/* Front Cloud 4 — opacity: 100% (bright) — wide, right-of-centre */}
            {/* add images: data-bg="/assets/clouds/walakulu-front-4.png" */}
            <div className="vt-home__env-cloud vt-home__env-cloud--f4 vt-home__env-cloud--bright" />

            {/* Front Cloud 5 — opacity: 50% (dim) — medium, right */}
            {/* add images: data-bg="/assets/clouds/walakulu-front-5.png" */}
            <div className="vt-home__env-cloud vt-home__env-cloud--f5 vt-home__env-cloud--dim" />

            {/* Front Cloud 6 — opacity: 50% (dim) — small, far right */}
            {/* add images: data-bg="/assets/clouds/walakulu-front-6.png" */}
            <div className="vt-home__env-cloud vt-home__env-cloud--f6 vt-home__env-cloud--dim" />

            {/* Front Cloud 7 — opacity: 100% (bright) — large, trailing */}
            {/* add images: data-bg="/assets/clouds/walakulu-front-7.png" */}
            <div className="vt-home__env-cloud vt-home__env-cloud--f7 vt-home__env-cloud--bright" />
          </div>

          {/* Rain streaks — activated by rainy/stormy weather variants via CSS */}
          <div className="vt-home__env-rain" aria-hidden="true">
            {/* 40 raindrop streaks — CSS distributes positions and speeds */}
            {Array.from({ length: 40 }).map((_, ri) => (
              <span
                key={ri}
                className={`vt-home__env-raindrop vt-home__env-raindrop--${(ri % 5) + 1}`}
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Mist layer — activated by misty weather variant via CSS */}
          {/* add images: CSS blur gradient layer — no image */}
          <div className="vt-home__env-mist" aria-hidden="true" />

          {/* Horizon fog layer — morning mist, dawn fog, evening haze */}
          {/* add images: CSS gradient fog at base of landmarks — no image */}
          <div className="vt-home__env-fog" aria-hidden="true" />

          {/* Rain puddle splash reflection — wet ground effect when raining */}
          {/* add images: CSS gradient wet-ground reflection — no image */}
          <div className="vt-home__env-rainsplash" aria-hidden="true" />

          {/* Sun orb — rises morning/noon, hidden evening/night */}
          {/* add images: Sun position animates via CSS keyframes on env class */}
          <div className="vt-home__env-sun" />

          {/* Moon orb — visible during night and dawn periods */}
          {/* add images: Moon CSS radial-gradient disc — no image */}
          <div className="vt-home__env-moon" />

          {/* Moonlight crepuscular rays — visible at night/dawn */}
          {/* add images: CSS conic-gradient rays from moon position — no image */}
          <div className="vt-home__env-moonrays" />

          {/* Star field — animated twinkle, only shown at night/dawn */}
          {/* add images: CSS dot particles — no image */}
          <div className="vt-home__env-stars">
            {/* 60 individual star dots — positions & timing controlled by CSS nth-child */}
            {Array.from({ length: 60 }).map((_, si) => (
              <span
                key={si}
                className={`vt-home__env-star vt-home__env-star--${(si % 3) + 1}`}
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Golden-hour lens flare — shown during morning / golden evening */}
          {/* add images: CSS radial-gradient flare near sun — no image */}
          <div className="vt-home__env-flare" aria-hidden="true" />

          {/* Dawn horizon glow — soft pink/purple wash at bottom of sky */}
          {/* add images: CSS gradient warm glow rising from horizon — no image */}
          <div className="vt-home__env-dawn-glow" aria-hidden="true" />

          {/* Lightning flash — only active during stormy weather variant */}
          {/* add images: CSS white flash overlay — no image */}
          <div className="vt-home__env-lightning" aria-hidden="true" />
        </div>

        {/* -------------- Birds Layer   */}
        {/*
          8 bird silhouettes flying across the hero sky.
          Visibility is controlled by period class on .vt-home:
            dawn/morning/evening → fully visible
            noon → 60% visible
            night → hidden
          Bird sizes (sm/md/lg) create natural depth/distance illusion.
          Each bird has independent flight duration and delay for organic scatter.

          add images: Replace each bird <span> with an <img> of a bird silhouette
                      SVG for higher-quality wing detail. Animate with CSS.
        */}
        <div className="vt-home__env-birds" aria-hidden="true">
          {/* Bird 1 — large foreground bird, slow flight */}
          {/* add images: Bird silhouette 1 — upper sky, slow */}
          <span className="vt-home__env-bird vt-home__env-bird--lg vt-home__env-bird--1" />

          {/* Bird 2 — small distant bird, faster */}
          {/* add images: Bird silhouette 2 — high altitude, fast */}
          <span className="vt-home__env-bird vt-home__env-bird--sm vt-home__env-bird--2" />

          {/* Bird 3 — medium bird, mid-sky */}
          {/* add images: Bird silhouette 3 — mid-sky, medium speed */}
          <span className="vt-home__env-bird vt-home__env-bird--md vt-home__env-bird--3" />

          {/* Bird 4 — small very-high bird */}
          {/* add images: Bird silhouette 4 — very high altitude */}
          <span className="vt-home__env-bird vt-home__env-bird--sm vt-home__env-bird--4" />

          {/* Bird 5 — large lower-sky bird */}
          {/* add images: Bird silhouette 5 — lower sky, large */}
          <span className="vt-home__env-bird vt-home__env-bird--lg vt-home__env-bird--5" />

          {/* Bird 6 — medium second-wave bird */}
          {/* add images: Bird silhouette 6 — mid altitude, second wave */}
          <span className="vt-home__env-bird vt-home__env-bird--md vt-home__env-bird--6" />

          {/* Bird 7 — small high straggler */}
          {/* add images: Bird silhouette 7 — straggler, high and slow */}
          <span className="vt-home__env-bird vt-home__env-bird--sm vt-home__env-bird--7" />

          {/* Bird 8 — medium evening return flock bird */}
          {/* add images: Bird silhouette 8 — evening return, medium */}
          <span className="vt-home__env-bird vt-home__env-bird--md vt-home__env-bird--8" />
        </div>

        {/* -------------- Fireflies Layer  */}
        {/*
          16 bioluminescent firefly particles floating in the lower hero area.
          Only visible during night and dawn periods.
          Each firefly has independent drift duration, glow pulse, and position.
          Controlled entirely by CSS — no JS animation logic.

          add images: No image — pure CSS radial-gradient glow dots.
        */}
        <div className="vt-home__env-fireflies" aria-hidden="true">
          {/* 16 fireflies — CSS nth-child positions and timing */}
          {Array.from({ length: 16 }).map((_, fi) => (
            <span
              key={fi}
              className="vt-home__env-firefly"
              aria-hidden="true"
            />
          ))}
        </div>

        {/* -------------- Environment Badge (period + weather indicator)  */}
        {/*
          Shows the current period icon and label in the top-left corner.
          Styled entirely via CSS — badge colours shift with env period class.
        */}
        {/* -------------- Dynamic Sun/Moon Arc — scoped CSS variable override   */}
        {/*
          The sun and moon positions are computed from the actual clock minute
          by minute via computeSunMoonArc(). We inject them as CSS custom
          properties using a scoped <style> tag inside the section.

          WHY a <style> tag and not inline styles?
            • The brief requires "no inline style" on DOM elements.
            • A <style> tag is a CSS mechanism (not an element attribute), so it
              satisfies the constraint while still enabling JS-driven positions.
            • The override is automatically scoped to .vt-home because it uses
              the section's own CSS variables.
            • Only the arc variables are overridden here; all other env variables
              remain fully CSS-driven via the period/weather classes.
        */}
        <style>{`
          /* Sun/moon arc positions computed from real-time clock */
          .vt-home--location-${selectedLocationKey} {
            --env-sun-x:    ${envArc?.sunX?.toFixed(1) ?? "50"}%;
            --env-sun-y:    ${envArc?.sunY?.toFixed(1) ?? "40"}%;
            --env-moon-x:   ${envArc?.moonX?.toFixed(1) ?? "70"}%;
            --env-moon-y:   ${envArc?.moonY?.toFixed(1) ?? "18"}%;
          }
        `}</style>

        {/* -------------- Active Landmark Spotlight Layer  */}
        {/*
          Displays the selected location's landmark PNG as the centered hero
          subject. The landmark image is positioned at bottom-center, reacting
          to time via CSS filter (brightness shifts per env period class).

          add images: Each location's `landmark` path points to a transparent
          PNG (see LOCATIONS array at top of file). Replace placeholder paths
          with actual landmark silhouette images.

          CSS class: vt-home__landmark-spotlight
            • Centered horizontally, anchored to bottom
            • Transitions opacity and filter smoothly on location change
            • Period-responsive: glows at dawn/morning, darkens at night
        */}
        <div className="vt-home__landmarks-spotlight" aria-hidden="true">
          {/* Ground plane — dark base behind spotlight landmark */}
          <div className="vt-home__landmark vt-home__landmark--ground" />

          {/* add images: Spotlight landmark — set via backgroundImage from LOCATIONS */}
          {LOCATIONS.map((loc) => (
            <div
              key={loc.key}
              className={[
                "vt-home__landmark-spotlight",
                loc.key === selectedLocationKey
                  ? "vt-home__landmark-spotlight--active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              /* Landmark image set here; useEffect applies it as backgroundImage */
              data-bg={loc.landmark}
              role="img"
              aria-label={`${loc.label} landmark — ${loc.description}`}
            />
          ))}
        </div>

        {/* -------------- Slide 6 Special Mosaic Layout   */}
        {/*
          When Slide 6 (index 5) is active, this 6-image mosaic overlay fades
          in on top of the standard slide background, replacing the single full-
          bleed landscape with a dynamic 3×2 grid of adventure activity images.

          Visibility: controlled by the `vt-home--slide6` class on .vt-home.
            • class present  → mosaic fades in (opacity 1, scale 1)
            • class absent   → mosaic fades out (opacity 0, scale 0.97)
          Both transitions use --vt-home-transition (0.7s cubic-bezier) so the
          effect is smooth and consistent with the rest of the slide system.

          Z-index: sits at z-index 4 (above landmarks z:3, below content z:10).
          This places the mosaic between the landmark layer and the content,
          matching the required visual hierarchy:
            Sky → Main Images → Cloud Layers → Content

          add images: Each .vt-slide6__img div uses a data-bg attribute so the
          existing useEffect data-bg handler automatically applies backgroundImage.
          To change Slide 6 images, edit the SLIDE_6_IMAGES array at the top of
          this file — no JSX changes needed.
        */}
        <div
          className="vt-home__slide6-mosaic"
          aria-hidden={!isSlide6}
          role={isSlide6 ? "img" : undefined}
          aria-label={
            isSlide6 ? "Slide 6: Adventure activities in Sri Lanka" : undefined
          }
        >
          {SLIDE_6_IMAGES.map((img) => (
            <div
              key={img.id}
              className={`vt-slide6__img vt-slide6__img--${img.id}`}
              /* add images: backgroundImage applied by the useEffect data-bg handler */
              data-bg={img.image}
              role="img"
              aria-label={img.alt}
            />
          ))}
        </div>

        {/* -------------- Bats Layer (Waullu) — shown at night in place of birds  */}
        {/*
          8 bat silhouettes flying erratically across the night sky.
          Controlled by CSS: visible when .vt-home--show-bats is set.
          Bats fly from right to left (opposite to daytime birds) and have
          a jagged, erratic flight path compared to birds' smooth arcs.

          add images: Replace each bat <span> with an <img> of a bat silhouette
                      SVG for higher-quality wing detail if desired.

          Layer order: same z-index as birds (above env, below content).
          CSS class vt-home__env-bats controls overall visibility.
          Individual bat classes --1 through --8 control timing/position.
        */}
        <div className="vt-home__env-bats" aria-hidden="true">
          {/* Bat 1 — large, mid-sky, slow erratic */}
          {/* add images: Bat silhouette 1 — mid-sky, large */}
          <span className="vt-home__env-bat vt-home__env-bat--lg vt-home__env-bat--1" />

          {/* Bat 2 — small, high altitude, fast */}
          {/* add images: Bat silhouette 2 — high, small, fast */}
          <span className="vt-home__env-bat vt-home__env-bat--sm vt-home__env-bat--2" />

          {/* Bat 3 — medium, near moon, swooping */}
          {/* add images: Bat silhouette 3 — near moon, medium */}
          <span className="vt-home__env-bat vt-home__env-bat--md vt-home__env-bat--3" />

          {/* Bat 4 — small, very high */}
          {/* add images: Bat silhouette 4 — very high, small */}
          <span className="vt-home__env-bat vt-home__env-bat--sm vt-home__env-bat--4" />

          {/* Bat 5 — large, low pass near landmarks */}
          {/* add images: Bat silhouette 5 — low sky, large */}
          <span className="vt-home__env-bat vt-home__env-bat--lg vt-home__env-bat--5" />

          {/* Bat 6 — medium, second wave */}
          {/* add images: Bat silhouette 6 — second wave, medium */}
          <span className="vt-home__env-bat vt-home__env-bat--md vt-home__env-bat--6" />

          {/* Bat 7 — small, fast straggler */}
          {/* add images: Bat silhouette 7 — straggler, high, small */}
          <span className="vt-home__env-bat vt-home__env-bat--sm vt-home__env-bat--7" />

          {/* Bat 8 — medium, diving swooper */}
          {/* add images: Bat silhouette 8 — swooping dive, medium */}
          <span className="vt-home__env-bat vt-home__env-bat--md vt-home__env-bat--8" />
        </div>

        {/* -------------- Location Switcher Control Panel  */}
        {/*
          Floating control panel at the bottom of the hero.
          Contains:
            1. Location dropdown — changes the active landmark + timezone
            2. Time slider — allows manual override of the time for demo/testing
               (press the clock icon to reveal; "Live" button resets to real clock)

          All styling via CSS classes — no inline styles.
          Panel class: vt-home__env-controls
        */}
        <div
          className="vt-home__env-controls"
          role="region"
          aria-label="Environment controls"
        >
          {/* -------------- Location Selector Dropdown  */}
          <div
            className={`vt-home__location-select${locationDropdownOpen ? " vt-home__location-select--open" : ""}`}
            ref={dropdownRef}
          >
            {/* Dropdown trigger button — shows selected location label */}
            <button
              className="vt-home__location-btn"
              onClick={() => setLocationDropdownOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={locationDropdownOpen}
              aria-label={`Selected location: ${selectedLocation.label}. Click to change.`}
            >
              {/* Pin icon */}
              <span className="vt-home__location-btn-icon" aria-hidden="true">
                📍
              </span>
              <span className="vt-home__location-btn-label">
                {selectedLocation.label}
              </span>
              {/* Chevron rotates when open */}
              <span
                className={`vt-home__location-btn-chevron${locationDropdownOpen ? " vt-home__location-btn-chevron--open" : ""}`}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>

            {/* Dropdown option list */}
            {locationDropdownOpen && (
              <ul
                className="vt-home__location-dropdown"
                role="listbox"
                aria-label="Select a Sri Lankan location"
              >
                {LOCATIONS.map((loc) => (
                  <li
                    key={loc.key}
                    className={[
                      "vt-home__location-option",
                      loc.key === selectedLocationKey
                        ? "vt-home__location-option--active"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    role="option"
                    aria-selected={loc.key === selectedLocationKey}
                    onClick={() => {
                      /* Location change: updates landmark image + timezone */
                      setSelectedLocationKey(loc.key);
                      setLocationDropdownOpen(false);
                    }}
                  >
                    <span className="vt-home__location-option-label">
                      {loc.label}
                    </span>
                    <span className="vt-home__location-option-desc">
                      {loc.description}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* -------------- Time Display + Slider Toggle  */}
          <div className="vt-home__time-panel">
            {/* Current time badge — clicking shows the slider */}
            <button
              className={`vt-home__time-badge${showTimeSlider ? " vt-home__time-badge--active" : ""}`}
              onClick={() => setShowTimeSlider((v) => !v)}
              aria-label={`Current time: ${displayTimeStr}. Click to open time override.`}
            >
              {/* Clock icon changes based on period */}
              <span className="vt-home__time-badge-icon" aria-hidden="true">
                {ENV_PERIODS.find((p) => p.key === envPeriod)?.icon ?? "🕐"}
              </span>
              <span className="vt-home__time-badge-time">{displayTimeStr}</span>
              {/* "LIVE" indicator shown when using real clock */}
              {timeOverride === null && (
                <span
                  className="vt-home__time-badge-live"
                  aria-label="Using live time"
                >
                  LIVE
                </span>
              )}
            </button>

            {/* Time slider — only visible when toggled open */}
            {showTimeSlider && (
              <div
                className="vt-home__time-slider-wrap"
                role="group"
                aria-label="Time override slider"
              >
                <span className="vt-home__time-slider-label" aria-hidden="true">
                  0
                </span>
                {/* Time range slider: 0 to 24 hours */}
                <input
                  className="vt-home__time-slider"
                  type="range"
                  min="0"
                  max="24"
                  step="0.25"
                  value={sliderHour}
                  onChange={handleSliderChange}
                  aria-label="Override time of day (hours)"
                  aria-valuetext={displayTimeStr}
                />
                <span className="vt-home__time-slider-label" aria-hidden="true">
                  24
                </span>
                {/* Reset to live clock */}
                <button
                  className="vt-home__time-reset-btn"
                  onClick={resetToRealTime}
                  aria-label="Reset to live real-time clock"
                >
                  ↺ Live
                </button>
              </div>
            )}
          </div>

          {/* -------------- Sri Lanka Map Thumbnail  */}
          {/*
            Small decorative SVG outline of Sri Lanka shown in the control panel.
            Purely decorative — no image file needed (pure SVG paths).
            add images: Replace with an actual Sri Lanka map PNG for higher detail.
          */}
          <div className="vt-home__sl-map" aria-hidden="true">
            <svg
              className="vt-home__sl-map-svg"
              viewBox="0 0 80 120"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Simplified outline of Sri Lanka island */}
              <path
                className="vt-home__sl-map-path"
                d="M40,5 C45,5 52,8 55,14 C60,22 62,30 60,42 C58,54 62,62 58,72 C54,82 50,90 44,100 C40,108 36,112 34,112 C30,110 26,104 24,96 C20,84 18,72 20,60 C22,50 18,40 22,30 C26,20 30,10 36,6 Z"
              />
              {/* Selected location dot — positioned roughly per location */}
              <circle
                className="vt-home__sl-map-dot"
                cx={
                  selectedLocationKey === "sigiriya"
                    ? 41
                    : selectedLocationKey === "aukana"
                      ? 38
                      : selectedLocationKey === "polonnaruwa"
                        ? 47
                        : selectedLocationKey === "sripada"
                          ? 33
                          : selectedLocationKey === "ruwanweli"
                            ? 36
                            : selectedLocationKey === "srimaha"
                              ? 36
                              : 40
                }
                cy={
                  selectedLocationKey === "sigiriya"
                    ? 45
                    : selectedLocationKey === "aukana"
                      ? 38
                      : selectedLocationKey === "polonnaruwa"
                        ? 50
                        : selectedLocationKey === "sripada"
                          ? 70
                          : selectedLocationKey === "ruwanweli"
                            ? 35
                            : selectedLocationKey === "srimaha"
                              ? 35
                              : 45
                }
                r="4"
              />
            </svg>
          </div>

          {/* -------------- Bottom credit / tagline  */}
          <p className="vt-home__env-tagline" aria-live="polite">
            Discover the Beauty of{" "}
            <span className="vt-home__env-tagline-highlight">Sri Lanka</span>
          </p>

          {/* -------------- Period icons row — visual indicator of current time-of-day  */}
          <div
            className="vt-home__env-period-icons"
            aria-label="Time of day indicators"
            role="img"
          >
            {ENV_PERIODS.map((p) => (
              <span
                key={p.key}
                className={`vt-home__env-period-icon${p.key === envPeriod ? " vt-home__env-period-icon--active" : ""}`}
                title={p.label}
                aria-hidden="true"
              >
                {p.icon}
              </span>
            ))}
          </div>
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

      {/* -------------- Premium Lanka Taxi Service Section  */}
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
                {/* add images: Taxi card image — set via data-bg attribute;
                    the useEffect data-bg handler applies it as backgroundImage. */}
                <div
                  className="vt-card__img"
                  data-bg={card.image}
                  role="img"
                  aria-label={card.title}
                />
              </div>
              <div className="vt-card__body">
                <h3 className="vt-card__title">{card.title}</h3>
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

      {/* -------------- Premium Colombo Airport Transfers Section  */}
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
              {/* add images: Replace with actual pickup service image.
                  Path: /assets/airport/pickup.jpg — data-bg picks it up via useEffect. */}
              <div
                className="vt-airport__card-img"
                data-bg="/assets/airport/pickup.jpg"
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
              {/* add images: Replace with actual drop service image.
                  Path: /assets/airport/drop.jpg — data-bg picks it up via useEffect. */}
              <div
                className="vt-airport__card-img"
                data-bg="/assets/airport/drop.jpg"
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

      {/* -------------- Exclusive Rides CTA Section  */}
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

      {/* -------------- Tour Section   */}
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
                {/* add images: Tour card image — set via data-bg attribute;
                    the useEffect data-bg handler applies it as backgroundImage. */}
                <div
                  className="vt-card__img"
                  data-bg={card.image}
                  role="img"
                  aria-label={card.title}
                />
              </div>
              <div className="vt-card__body">
                <h3 className="vt-card__title">{card.title}</h3>
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
      {/* -------------- Unforgettable Personalized Itineraries Section  */}
      <section
        className="vt-section vt-itin"
        aria-label="Unforgettable Personalized Itineraries"
      >
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
            onClick={() => {
              itin.prev();
              itin.resetTimer();
            }}
            aria-label="Previous itineraries"
          >
            &#8249;
          </button>
          <div className="vt-cards__dots" role="tablist">
            {Array.from({ length: itin.maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                className={`vt-cards__dot${i === itin.page ? " vt-cards__dot--active" : ""}`}
                onClick={() => {
                  itin.goTo(i);
                  itin.resetTimer();
                }}
                aria-label={`Go to itinerary page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
          <button
            className="vt-cards__arrow vt-cards__arrow--next"
            onClick={() => {
              itin.next();
              itin.resetTimer();
            }}
            aria-label="Next itineraries"
          >
            &#8250;
          </button>
        </div>
      </section>

      {/* -------------- Collect Moments Section  */}
      <section
        className="vt-section vt-moments"
        aria-label="Collect Moments Not Just Miles"
      >
        <div className="vt-moments__header">
          <h2 className="vt-moments__title">
            Collect Moments,{" "}
            <span className="vt-moments__title-highlight">Not Just Miles.</span>
          </h2>
          <p className="vt-moments__sub">
            Enjoy Sri Lanka's breathtaking landscapes in authentic local
            encounters and help you explore the wonders of Sri Lanka and
            preserve every memory forever.
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
            onClick={() => {
              mom.prev();
              mom.resetTimer();
            }}
            aria-label="Previous moments"
          >
            &#8249;
          </button>
          <div className="vt-cards__dots" role="tablist">
            {Array.from({ length: mom.maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                className={`vt-cards__dot${i === mom.page ? " vt-cards__dot--active" : ""}`}
                onClick={() => {
                  mom.goTo(i);
                  mom.resetTimer();
                }}
                aria-label={`Go to moments page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
          <button
            className="vt-cards__arrow vt-cards__arrow--next"
            onClick={() => {
              mom.next();
              mom.resetTimer();
            }}
            aria-label="Next moments"
          >
            &#8250;
          </button>
        </div>
      </section>

      {/* -------------- Everything You Need to Know Section  */}
      <section
        className="vt-section vt-enytk"
        aria-label="Everything You Need to Know"
      >
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
              Sri Lanka{" "}
              <span className="vt-enytk__row-title-highlight">Tour</span>
            </h2>
            <p className="vt-enytk__row-desc">{SL_TOUR.desc}</p>
            <a href={SL_TOUR.readMore} className="vt-enytk__row-btn">
              Read More
            </a>
          </div>
        </div>

        {/* Everything You Need to Know items */}
        {ENYTK_ITEMS.map((item) => {
          if (item.layout === "text-right") {
            return (
              <div
                className="vt-enytk__row vt-enytk__row--img-left"
                key={item.id}
              >
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
                  <a href={item.readMore} className="vt-enytk__row-btn">
                    Read More
                  </a>
                </div>
              </div>
            );
          }
          if (item.layout === "text-left") {
            return (
              <div
                className="vt-enytk__row vt-enytk__row--img-right"
                key={item.id}
              >
                <div className="vt-enytk__text-col">
                  <h3 className="vt-enytk__item-title">{item.title}</h3>
                  <p className="vt-enytk__item-desc">{item.desc}</p>
                  <a href={item.readMore} className="vt-enytk__row-btn">
                    Read More
                  </a>
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
            <a href={ABOUT_US.readMore} className="vt-enytk__row-btn">
              Read More
            </a>
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
            <a href={DISCOVER_SOUL.seeMore} className="vt-enytk__soul-btn">
              See More
            </a>
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

      {/* -------------- Voyara Tales Section  */}
      <section className="vt-section vt-tales" aria-label="Voyara Tales">
        <div className="vt-tales__header">
          <h2 className="vt-tales__title">Voyara Tales</h2>
          <p className="vt-tales__sub">
            Inspiring travel stories, local events, and expert tips for your
            next great adventure.
          </p>
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
            onClick={() => {
              tales.prev();
              tales.resetTimer();
            }}
            aria-label="Previous tales"
          >
            &#8249;
          </button>
          <div className="vt-cards__dots" role="tablist">
            {Array.from({ length: tales.maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                className={`vt-cards__dot${i === tales.page ? " vt-cards__dot--active" : ""}`}
                onClick={() => {
                  tales.goTo(i);
                  tales.resetTimer();
                }}
                aria-label={`Go to tales page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
          <button
            className="vt-cards__arrow vt-cards__arrow--next"
            onClick={() => {
              tales.next();
              tales.resetTimer();
            }}
            aria-label="Next tales"
          >
            &#8250;
          </button>
        </div>
      </section>

      {/* -------------- Memories Shared by Our Travelers Section  */}
      {/* Reviews are pulled from the Packages page traveller comment section */}
      <section
        className="vt-section vt-reviews"
        aria-label="Memories Shared by Our Travelers"
      >
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
                <div
                  className="vt-reviews__stars"
                  aria-label={`Rating: ${rev.rating} out of 5`}
                >
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
            onClick={() => {
              reviews.prev();
              reviews.resetTimer();
            }}
            aria-label="Previous reviews"
          >
            &#8249;
          </button>
          <div className="vt-cards__dots" role="tablist">
            {Array.from({ length: reviews.maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                className={`vt-cards__dot${i === reviews.page ? " vt-cards__dot--active" : ""}`}
                onClick={() => {
                  reviews.goTo(i);
                  reviews.resetTimer();
                }}
                aria-label={`Go to reviews page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
          <button
            className="vt-cards__arrow vt-cards__arrow--next"
            onClick={() => {
              reviews.next();
              reviews.resetTimer();
            }}
            aria-label="Next reviews"
          >
            &#8250;
          </button>
        </div>
      </section>
    </>
  );
}
