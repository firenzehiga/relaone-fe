import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Pages
import LandingPage from "./pages/LandingPage";
import EventsPage from "./pages/EventsPage";

// Modals
import JoinEventModal from "./components/JoinEventModal";

function App() {
  return (
    <Router>
      <Header />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <main className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/events" element={<EventsPage />} />
              {/* Add more routes as needed */}
            </Routes>
          </AnimatePresence>
        </main>

        {/* Global Modals */}
        <JoinEventModal />
      </div>
      <Footer />
    </Router>
  );
}

export default App;
