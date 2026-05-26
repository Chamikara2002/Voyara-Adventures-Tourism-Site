import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";
import { useEffect } from "react";

// Pages Imports
import Home from "./Pages/home-page";
import About from "./Pages/about-page";
import Service from "./Pages/service-page";
import Packages from "./Pages/packages-page";
import Tour from "./Pages/tours-page";
import Contact from "./Pages/contact-page";
import Navbar from "./components/Navigation/navbar";
import Footer from "./components/Footer/footer";

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const navigationEntries = performance.getEntriesByType("navigation");
    const isReload = navigationEntries.length > 0 && navigationEntries[0].type === "reload";

    const isFirstLoadInSession = !sessionStorage.getItem("session_started");

    if (isReload || isFirstLoadInSession) {
      sessionStorage.setItem("session_started", "true");
      navigate("/");
    }
  }, [navigate]);

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