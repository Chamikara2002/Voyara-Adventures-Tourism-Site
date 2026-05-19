//import { Link } from "react-router-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages Imports
import Home from "./Pages/home-page";
import About from "./Pages/about-page";
import Navbar from "./components/Navigation/navbar";
import Footer from "./components/Footer/footer";




function AppContent() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/services" element={<Services />} /> {/* ← මේ විදිහට routes හදාගන්න */} 
        {/* <Route path="/packages" element={<Packages />} /> */}
        {/* අනිත් routes ටිකත් මෙතනට දාන්න */}
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
