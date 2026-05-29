import { useState, useEffect, useRef } from "react";
import "./chat-bot-page.css";

// ── Config ──────────────────────────────────────────────
const WHATSAPP_BASE = "https://wa.me/";

// Business context for the AI
const BUSINESS_CONTEXT = `
You are a friendly AI support assistant for a business in Sri Lanka.
Answer customer questions helpfully and concisely (2–4 sentences max).
If the customer asks something complex, needs a quote, wants to speak to a human,
or if you cannot fully answer, suggest they contact us via WhatsApp for more details.
Always be polite and professional.
Respond in the same language the customer uses.

IMPORTANT FLOW — follow this exactly:
1. Answer the user's question first.
2. After your answer, on a new line, check if you already have their WhatsApp number from the conversation.
   - If you do NOT have their number yet, after 1-2 exchanges ask naturally: 
     "Could you share your WhatsApp number so our team can follow up with you directly? 😊"
   - If you already have their number, do NOT ask again.
3. If the user shares a phone number (any format), acknowledge warmly:
     "Thank you! I've saved your number. A WhatsApp button will appear so you can connect with our team directly."
4. Never ask for the number more than once.
`;

// ── Helpers ──────────────────────────────────────────────
function getSLGreeting() {
  const slOffset = 5.5 * 60;
  const now = new Date();
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const slMinutes = (utcMinutes + slOffset) % (24 * 60);
  const slHour = Math.floor(slMinutes / 60);
  if (slHour >= 5 && slHour < 12) return "Good Morning";
  if (slHour >= 12 && slHour < 17) return "Good Afternoon";
  if (slHour >= 17 && slHour < 21) return "Good Evening";
  return "Good Night";
}

function extractPhoneNumber(text) {
  const cleaned = text.replace(/[\s\-().+]/g, "");
  const match = cleaned.match(/\d{7,15}/);
  if (!match) return null;
  let num = match[0];
  if (num.startsWith("0") && num.length === 10) num = "94" + num.slice(1);
  else if (num.length === 9) num = "94" + num;
  if (num.length >= 10 && num.length <= 15) return num;
  return null;
}

async function callClaude(messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: BUSINESS_CONTEXT,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? "Sorry, I couldn't get a response.";
}

// ── Component ─────────────────────────────────────────────
export default function Chatbot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      from: "bot",
      text: `${getSLGreeting()}! 👋 Welcome! How can I help you today?`,
      withWa: false,
    },
  ]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userPhone, setUserPhone] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (chatOpen)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, chatOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");
    setIsLoading(true);

    const detectedPhone = extractPhoneNumber(trimmed);
    let resolvedPhone = userPhone;
    if (detectedPhone && !userPhone) {
      resolvedPhone = detectedPhone;
      setUserPhone(detectedPhone);
    }

    const newHistory = [...history, { role: "user", content: trimmed }];

    try {
      const reply = await callClaude(newHistory);

      const botMentionsWa =
        /whatsapp|contact us|speak to|human|agent|more detail|quote|call us/i.test(
          reply,
        );
      const showWa = !!resolvedPhone && (!!detectedPhone || botMentionsWa);

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: reply, withWa: showWa, waNumber: resolvedPhone },
      ]);
      setHistory([...newHistory, { role: "assistant", content: reply }]);
    } catch (err) {
      // Show specific error type
      let errMsg = "";
      const status = err.message?.match(/\d{3}/)?.[0];
      if (status === "401") {
        errMsg =
          "API key is missing or invalid. Please check your configuration.";
      } else if (status === "429") {
        errMsg = "Too many requests. Please wait a moment and try again.";
      } else if (status === "500") {
        errMsg =
          "The AI service is temporarily unavailable. Please try again shortly.";
      } else if (
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("NetworkError")
      ) {
        errMsg =
          "Network error — this API cannot be called directly from a browser due to CORS restrictions. A backend proxy is required.";
      } else {
        errMsg = `Something went wrong (${err.message}). Please try again.`;
      }
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: errMsg, withWa: false, isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSend();
  };

  return (
    <>
      {chatOpen && (
        <div className="cb-chat-window">
          <div className="cb-chat-header">
            <span className="cb-chat-avatar">🤖</span>
            <div className="cb-chat-header-info">
              <span className="cb-chat-title">Support Chat</span>
              <span className="cb-chat-status">Online</span>
            </div>
            <button
              className="cb-chat-close"
              onClick={() => setChatOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="cb-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`cb-msg cb-msg--${msg.from}`}>
                {msg.from === "bot" && (
                  <span className="cb-msg-avatar">🤖</span>
                )}
                {msg.from === "bot" && msg.withWa && msg.waNumber ? (
                  <div className="cb-msg-with-action">
                    <span
                      className={`cb-msg-bubble${msg.isError ? " cb-msg-bubble--error" : ""}`}
                    >
                      {msg.text}
                    </span>
                    <a
                      className="cb-wa-cta"
                      href={`${WHATSAPP_BASE}${msg.waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        viewBox="0 0 32 32"
                        width="14"
                        height="14"
                        fill="currentColor"
                      >
                        <path d="M16.003 3C9.376 3 4 8.376 4 15.003c0 2.184.592 4.228 1.621 5.984L4 29l8.246-1.594A11.93 11.93 0 0016.003 28C22.627 28 28 22.624 28 15.997 28 9.373 22.627 3 16.003 3zm6.07 16.594c-.258.726-1.502 1.388-2.063 1.477-.527.083-1.193.117-1.924-.12-.443-.144-1.013-.335-1.74-.656-3.063-1.322-5.067-4.386-5.22-4.59-.154-.203-1.253-1.666-1.253-3.18 0-1.515.793-2.263 1.074-2.572.281-.309.614-.386.82-.386.205 0 .41.002.59.01.189.009.443-.072.693.529.258.618.877 2.131.953 2.286.077.154.128.336.026.54-.103.205-.154.333-.308.513-.154.18-.322.402-.462.54-.154.154-.315.32-.135.629.18.308.798 1.318 1.713 2.135 1.176 1.048 2.168 1.372 2.476 1.527.308.154.487.128.667-.077.18-.205.77-.898.975-1.207.205-.308.41-.257.693-.154.283.103 1.796.848 2.104 1.002.308.154.513.231.59.36.077.128.077.744-.18 1.47z" />
                      </svg>
                      Chat on WhatsApp
                    </a>
                  </div>
                ) : (
                  <span
                    className={`cb-msg-bubble${msg.isError ? " cb-msg-bubble--error" : ""}`}
                  >
                    {msg.text}
                  </span>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="cb-msg cb-msg--bot">
                <span className="cb-msg-avatar">🤖</span>
                <span className="cb-msg-bubble cb-msg-bubble--typing">
                  <span className="cb-typing-dot"></span>
                  <span className="cb-typing-dot"></span>
                  <span className="cb-typing-dot"></span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="cb-chat-input-row">
            <input
              className="cb-chat-input"
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={isLoading}
            />
            <button
              className="cb-chat-send"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <svg
                className="cb-chat-send-icon"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M22 2L11 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className={`cb-stack ${scrolled ? "cb-stack--dimmed" : ""}`}>
        <div className="cb-item">
          <span className="cb-tooltip">Chat with us</span>
          <button
            className={`cb-btn cb-btn--chat ${chatOpen ? "cb-btn--active" : ""}`}
            onClick={() => setChatOpen((o) => !o)}
            aria-label="Open Chat"
          >
            <svg className="cb-icon" viewBox="0 0 32 32">
              <path d="M16 3C9.373 3 4 7.925 4 14c0 3.228 1.446 6.13 3.76 8.21L6.5 27l5.01-2.505A13.08 13.08 0 0016 25c6.627 0 12-4.925 12-11S22.627 3 16 3zm-4 13a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
            </svg>
            <span className="cb-label">Chat</span>
          </button>
        </div>
      </div>
    </>
  );
}
