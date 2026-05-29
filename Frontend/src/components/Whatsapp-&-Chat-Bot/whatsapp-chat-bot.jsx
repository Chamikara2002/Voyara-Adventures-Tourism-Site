import { useState, useEffect } from "react";
import "./whatsapp-chat-bot.css";

const WHATSAPP_NUMBER = "94477401569"; // Sri Lanka format — no spaces
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function WhatsAppButton() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`wa-stack ${scrolled ? "wa-stack--dimmed" : ""}`}>
      <div className="wa-item">
        <span className="wa-tooltip">WhatsApp</span>
        <a
          className="wa-btn wa-btn--whatsapp"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <svg
            className="wa-icon"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.003 3C9.376 3 4 8.376 4 15.003c0 2.184.592 4.228 1.621 5.984L4 29l8.246-1.594A11.93 11.93 0 0016.003 28C22.627 28 28 22.624 28 15.997 28 9.373 22.627 3 16.003 3zm6.07 16.594c-.258.726-1.502 1.388-2.063 1.477-.527.083-1.193.117-1.924-.12-.443-.144-1.013-.335-1.74-.656-3.063-1.322-5.067-4.386-5.22-4.59-.154-.203-1.253-1.666-1.253-3.18 0-1.515.793-2.263 1.074-2.572.281-.309.614-.386.82-.386.205 0 .41.002.59.01.189.009.443-.072.693.529.258.618.877 2.131.953 2.286.077.154.128.336.026.54-.103.205-.154.333-.308.513-.154.18-.322.402-.462.54-.154.154-.315.32-.135.629.18.308.798 1.318 1.713 2.135 1.176 1.048 2.168 1.372 2.476 1.527.308.154.487.128.667-.077.18-.205.77-.898.975-1.207.205-.308.41-.257.693-.154.283.103 1.796.848 2.104 1.002.308.154.513.231.59.36.077.128.077.744-.18 1.47z" />
          </svg>
          <span className="wa-label">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
