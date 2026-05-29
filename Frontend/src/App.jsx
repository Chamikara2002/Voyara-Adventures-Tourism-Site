import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages Imports
import Home from "./Pages/home-page";
import About from "./Pages/about-page";
import Service from "./Pages/service-page";
import Packages from "./Pages/packages-page";
import Tour from "./Pages/tours-page";
import Contact from "./Pages/contact-page";
import WCButtons from "./components/Whatsapp-&-Chat-Bot/whatsapp-chat-bot";
import ChatB from "./components/Chat-Bot/chat-bot-page";
import Navbar from "./components/Navigation/navbar";
import Footer from "./components/Footer/footer";

function AppContent() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Service />} />
        <Route path="/about" element={<About />} /> 
        <Route path="/packages" element={<Packages />} />
        <Route path="/tours" element={<Tour />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
      <div className="floating-btn-stack">
        <WCButtons />
        <ChatB />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;