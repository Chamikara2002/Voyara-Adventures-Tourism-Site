//import { Link } from "react-router-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages Imports
import Home from "./Pages/home-page";
import Service from "./Pages/service-page";
import Packages from "./Pages/packages-page";
import Tour from "./Pages/tours-page";
import Navbar from "./components/Navigation/navbar";
import Footer from "./components/Footer/footer";




function AppContent() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Service />} />
        {/* <Route path="/about" element={<About />} />*/} 
        <Route path="/packages" element={<Packages />} />
        <Route path="/tours" element={<Tour />} />
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
