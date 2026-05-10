import { useState, useEffect, useRef, useCallback } from "react";
import "../Navigation/language-switcher.css";

// ── Language Data ─────────────────────────────────────────────────────────
// Each entry: { code, name, native, flag, region }
const LANGUAGES = [
  // South Asia
  {
    code: "en",
    name: "English",
    native: "English",
    flag: "🇬🇧",
    region: "Global",
  },
  {
    code: "si",
    name: "Sinhala",
    native: "සිංහල",
    flag: "🇱🇰",
    region: "South Asia",
  },
  {
    code: "ta",
    name: "Tamil",
    native: "தமிழ்",
    flag: "🇮🇳",
    region: "South Asia",
  },
  {
    code: "hi",
    name: "Hindi",
    native: "हिन्दी",
    flag: "🇮🇳",
    region: "South Asia",
  },
  {
    code: "bn",
    name: "Bengali",
    native: "বাংলা",
    flag: "🇧🇩",
    region: "South Asia",
  },
  {
    code: "ur",
    name: "Urdu",
    native: "اردو",
    flag: "🇵🇰",
    region: "South Asia",
  },
  {
    code: "ne",
    name: "Nepali",
    native: "नेपाली",
    flag: "🇳🇵",
    region: "South Asia",
  },

  // East Asia
  {
    code: "zh-CN",
    name: "Chinese (Simplified)",
    native: "简体中文",
    flag: "🇨🇳",
    region: "East Asia",
  },
  {
    code: "zh-TW",
    name: "Chinese (Traditional)",
    native: "繁體中文",
    flag: "🇹🇼",
    region: "East Asia",
  },
  {
    code: "ja",
    name: "Japanese",
    native: "日本語",
    flag: "🇯🇵",
    region: "East Asia",
  },
  {
    code: "ko",
    name: "Korean",
    native: "한국어",
    flag: "🇰🇷",
    region: "East Asia",
  },

  // Southeast Asia
  {
    code: "th",
    name: "Thai",
    native: "ภาษาไทย",
    flag: "🇹🇭",
    region: "Southeast Asia",
  },
  {
    code: "id",
    name: "Indonesian",
    native: "Bahasa Indonesia",
    flag: "🇮🇩",
    region: "Southeast Asia",
  },
  {
    code: "ms",
    name: "Malay",
    native: "Bahasa Melayu",
    flag: "🇲🇾",
    region: "Southeast Asia",
  },
  {
    code: "vi",
    name: "Vietnamese",
    native: "Tiếng Việt",
    flag: "🇻🇳",
    region: "Southeast Asia",
  },
  {
    code: "fil",
    name: "Filipino",
    native: "Filipino",
    flag: "🇵🇭",
    region: "Southeast Asia",
  },
  {
    code: "my",
    name: "Burmese",
    native: "မြန်မာဘာသာ",
    flag: "🇲🇲",
    region: "Southeast Asia",
  },

  // Middle East
  {
    code: "ar",
    name: "Arabic",
    native: "العربية",
    flag: "🇸🇦",
    region: "Middle East",
  },
  {
    code: "fa",
    name: "Persian",
    native: "فارسی",
    flag: "🇮🇷",
    region: "Middle East",
  },
  {
    code: "he",
    name: "Hebrew",
    native: "עברית",
    flag: "🇮🇱",
    region: "Middle East",
  },
  {
    code: "tr",
    name: "Turkish",
    native: "Türkçe",
    flag: "🇹🇷",
    region: "Middle East",
  },

  // Europe — West
  {
    code: "fr",
    name: "French",
    native: "Français",
    flag: "🇫🇷",
    region: "Europe",
  },
  {
    code: "de",
    name: "German",
    native: "Deutsch",
    flag: "🇩🇪",
    region: "Europe",
  },
  {
    code: "es",
    name: "Spanish",
    native: "Español",
    flag: "🇪🇸",
    region: "Europe",
  },
  {
    code: "it",
    name: "Italian",
    native: "Italiano",
    flag: "🇮🇹",
    region: "Europe",
  },
  {
    code: "pt",
    name: "Portuguese",
    native: "Português",
    flag: "🇵🇹",
    region: "Europe",
  },
  {
    code: "nl",
    name: "Dutch",
    native: "Nederlands",
    flag: "🇳🇱",
    region: "Europe",
  },
  {
    code: "el",
    name: "Greek",
    native: "Ελληνικά",
    flag: "🇬🇷",
    region: "Europe",
  },

  // Europe — North
  {
    code: "sv",
    name: "Swedish",
    native: "Svenska",
    flag: "🇸🇪",
    region: "Europe",
  },
  {
    code: "no",
    name: "Norwegian",
    native: "Norsk",
    flag: "🇳🇴",
    region: "Europe",
  },
  { code: "da", name: "Danish", native: "Dansk", flag: "🇩🇰", region: "Europe" },
  {
    code: "fi",
    name: "Finnish",
    native: "Suomi",
    flag: "🇫🇮",
    region: "Europe",
  },

  // Europe — East
  {
    code: "ru",
    name: "Russian",
    native: "Русский",
    flag: "🇷🇺",
    region: "Europe",
  },
  {
    code: "pl",
    name: "Polish",
    native: "Polski",
    flag: "🇵🇱",
    region: "Europe",
  },
  {
    code: "uk",
    name: "Ukrainian",
    native: "Українська",
    flag: "🇺🇦",
    region: "Europe",
  },
  {
    code: "cs",
    name: "Czech",
    native: "Čeština",
    flag: "🇨🇿",
    region: "Europe",
  },
  {
    code: "hu",
    name: "Hungarian",
    native: "Magyar",
    flag: "🇭🇺",
    region: "Europe",
  },
  {
    code: "ro",
    name: "Romanian",
    native: "Română",
    flag: "🇷🇴",
    region: "Europe",
  },

  // Americas
  {
    code: "pt-BR",
    name: "Portuguese (Brazil)",
    native: "Português (BR)",
    flag: "🇧🇷",
    region: "Americas",
  },
  {
    code: "es-419",
    name: "Spanish (Latin America)",
    native: "Español (Lat)",
    flag: "🌎",
    region: "Americas",
  },

  // Africa
  {
    code: "sw",
    name: "Swahili",
    native: "Kiswahili",
    flag: "🇰🇪",
    region: "Africa",
  },
  { code: "am", name: "Amharic", native: "አማርኛ", flag: "🇪🇹", region: "Africa" },
  { code: "ha", name: "Hausa", native: "Hausa", flag: "🇳🇬", region: "Africa" },
  {
    code: "yo",
    name: "Yoruba",
    native: "Yorùbá",
    flag: "🇳🇬",
    region: "Africa",
  },
  {
    code: "af",
    name: "Afrikaans",
    native: "Afrikaans",
    flag: "🇿🇦",
    region: "Africa",
  },
];

// ── Google Translate Injection ────────────────────────────────────────────
// Uses the free Google Translate widget element approach (no API key required)
function initGoogleTranslate() {
  if (window.google && window.google.translate) return;

  window.googleTranslateElementInit = function () {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
        includedLanguages: LANGUAGES.map((l) => l.code).join(","),
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      "google_translate_element",
    );
  };

  const script = document.createElement("script");
  script.src =
    "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  script.onerror = () =>
    console.warn("[LangSwitcher] Google Translate script failed to load.");
  document.head.appendChild(script);

  // Hidden container for the Google widget (required)
  if (!document.getElementById("google_translate_element")) {
    const el = document.createElement("div");
    el.id = "google_translate_element";
    el.style.display = "none";
    document.body.appendChild(el);
  }
}

function applyGoogleTranslate(langCode) {
  // Google Translate uses a cookie & iframe approach via the select element it injects
  const selectEl = document.querySelector(
    "#google_translate_element select.goog-te-combo",
  );

  if (selectEl) {
    selectEl.value = langCode;
    selectEl.dispatchEvent(new Event("change"));
    return true;
  }
  return false;
}

function resetToEnglish() {
  // Google Translate provides a restore method
  const frame = document.querySelector(".goog-te-banner-frame");
  if (frame) {
    const frameDoc = frame.contentDocument || frame.contentWindow?.document;
    const restoreBtn = frameDoc?.querySelector(".goog-te-banner-frame");
    if (restoreBtn) restoreBtn.click();
    return;
  }
  // Fallback: reload without translate cookie
  const url = new URL(window.location.href);
  url.searchParams.delete("_x_tr_sl");
  url.searchParams.delete("_x_tr_tl");
  window.location.href = url.toString();
}

// ── Storage helpers ───────────────────────────────────────────────────────
const STORAGE_KEY = "vt_lang_code";

function saveLang(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch (err) {
    console.warn("[LangSwitcher] localStorage unavailable:", err);
  }
}

function loadLang() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "en";
    // eslint-disable-next-line no-unused-vars
  } catch (_) {
    return "en";
  }
}

// ── Group languages by region ─────────────────────────────────────────────
function groupByRegion(list) {
  const order = [
    "Global",
    "South Asia",
    "East Asia",
    "Southeast Asia",
    "Middle East",
    "Europe",
    "Americas",
    "Africa",
  ];
  const map = {};
  list.forEach((lang) => {
    if (!map[lang.region]) map[lang.region] = [];
    map[lang.region].push(lang);
  });
  return order.filter((r) => map[r]).map((r) => ({ region: r, langs: map[r] }));
}

// ── Component ─────────────────────────────────────────────────────────────
export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeLang, setActiveLang] = useState(
    () => LANGUAGES.find((l) => l.code === loadLang()) || LANGUAGES[0],
  );
  const [gtReady, setGtReady] = useState(false);

  const panelRef = useRef(null);
  const btnRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  // ── Boot Google Translate ────────────────────────────────────────────────
  useEffect(() => {
    initGoogleTranslate();

    // Poll until the Google Translate widget select is available
    const poll = setInterval(() => {
      const sel = document.querySelector(
        "#google_translate_element select.goog-te-combo",
      );
      if (sel) {
        setGtReady(true);
        clearInterval(poll);

        // Apply persisted language on load
        const saved = loadLang();
        if (saved && saved !== "en") {
          setTimeout(() => applyGoogleTranslate(saved), 400);
        }
      }
    }, 500);

    return () => clearInterval(poll);
  }, []);

  // ── Close on outside click ───────────────────────────────────────────────
  useEffect(() => {
    function onOutside(e) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  // ── Close on Escape ──────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        btnRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // ── Focus search when panel opens ───────────────────────────────────────
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 80);
    }
  }, [open]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const togglePanel = () => {
    setOpen((prev) => !prev);
    if (open) setQuery("");
  };

  const handleSelect = useCallback(
    (lang) => {
      setActiveLang(lang);
      saveLang(lang.code);
      setOpen(false);
      setQuery("");

      if (lang.code === "en") {
        resetToEnglish();
      } else {
        if (gtReady) {
          applyGoogleTranslate(lang.code);
        } else {
          // Queue until ready
          const interval = setInterval(() => {
            if (applyGoogleTranslate(lang.code)) clearInterval(interval);
          }, 300);
        }
      }
    },
    [gtReady],
  );

  // ── Filtered + grouped languages ─────────────────────────────────────────
  const filtered = query.trim()
    ? LANGUAGES.filter(
        (l) =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          l.native.toLowerCase().includes(query.toLowerCase()) ||
          l.code.toLowerCase().includes(query.toLowerCase()),
      )
    : LANGUAGES;

  const grouped = groupByRegion(filtered);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="vt-lang" aria-label="Language selector">
      {/* ── Trigger Button ── */}
      <button
        ref={btnRef}
        className={`vt-lang__btn${open ? " vt-lang__btn--open" : ""}`}
        onClick={togglePanel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${activeLang.name}. Click to change language.`}
      >
        <span className="vt-lang__btn-globe" aria-hidden="true">
          {activeLang.flag}
        </span>
        <span className="vt-lang__btn-code">
          {activeLang.code.toUpperCase().slice(0, 3)}
        </span>
        <span className="vt-lang__btn-caret" aria-hidden="true"></span>
      </button>

      {/* ── Dropdown Panel ── */}
      <div
        ref={panelRef}
        className={`vt-lang__panel${open ? " vt-lang__panel--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Select language"
      >
        {/* Header + Search */}
        <div className="vt-lang__panel-header">
          <p className="vt-lang__panel-title">Select Language</p>
          <div className="vt-lang__search-wrap">
            <span className="vt-lang__search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              ref={searchRef}
              className="vt-lang__search"
              type="text"
              placeholder="Search languages…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search languages"
              autoComplete="off"
              spellCheck="false"
            />
            {query && (
              <button
                className="vt-lang__search-clear"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                tabIndex={0}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Language List */}
        <ul
          ref={listRef}
          className="vt-lang__list"
          role="listbox"
          aria-label="Available languages"
        >
          {grouped.length === 0 && (
            <p className="vt-lang__no-results">No languages found</p>
          )}

          {grouped.map(({ region, langs }) => (
            <li key={region} role="presentation">
              <p className="vt-lang__region-label" aria-hidden="true">
                {region}
              </p>
              <ul
                role="presentation"
                style={{ listStyle: "none", margin: 0, padding: 0 }}
              >
                {langs.map((lang) => {
                  const isActive = lang.code === activeLang.code;
                  return (
                    <li
                      key={lang.code}
                      className="vt-lang__item"
                      role="presentation"
                    >
                      <button
                        className={`vt-lang__item-btn${isActive ? " vt-lang__item-btn--active" : ""}`}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => handleSelect(lang)}
                        tabIndex={open ? 0 : -1}
                      >
                        <span className="vt-lang__item-flag" aria-hidden="true">
                          {lang.flag}
                        </span>
                        <span className="vt-lang__item-name">{lang.name}</span>
                        <span
                          className="vt-lang__item-native"
                          aria-hidden="true"
                        >
                          {lang.native}
                        </span>
                        {isActive && (
                          <span
                            className="vt-lang__item-check"
                            aria-label="Selected"
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="vt-lang__panel-footer">
          Powered by Google Translate · {LANGUAGES.length} languages
        </div>
      </div>
    </div>
  );
}
