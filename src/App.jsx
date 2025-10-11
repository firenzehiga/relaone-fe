import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layout Components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Pages
import LandingPage from "@/pages/LandingPage";
import EventsPage from "@/pages/EventsPage";
import OrganizationsPage from "@/pages/OrganizationsPage";

// Modals
import JoinEventModal from "@/components/JoinEventModal";

/**
 * Komponen utama aplikasi volunteer platform
 * Mengatur routing, layout global, dan modal-modal yang dapat diakses dari mana saja
 * Menggunakan React Router untuk navigasi dan Framer Motion untuk animasi halaman
 *
 * @returns {JSX.Element} Struktur aplikasi lengkap dengan routing dan layout
 */
function App() {
	const location = useLocation();

	// Auto scroll to top setiap pindah halaman
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	return (
		<>
			<Header />
			<div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
				<main className="flex-1 w-full">
					<AnimatePresence mode="wait">
						<Routes>
							<Route path="/" element={<LandingPage />} />
							<Route path="/events" element={<EventsPage />} />
							<Route path="/organizations" element={<OrganizationsPage />} />

							{/* Add more routes as needed */}
						</Routes>
					</AnimatePresence>
				</main>

				{/* Global Modals */}
				<JoinEventModal />
			</div>
			<Footer />
		</>
	);
}

export default App;
