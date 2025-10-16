import { Routes, Route } from "react-router-dom";

// Layout Components
import MainLayout from "@/layout/MainLayout";

// Pages
import LandingPage from "@/pages/LandingPage";
import EventsPage from "@/pages/EventsPage";
import OrganizationsPage from "@/pages/OrganizationsPage";

// Auth Pages
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";

// Modals
import JoinEventModal from "@/components/JoinEventModal";
import EventDetailModal from "@/components/EventDetailModal";

/**
 * Komponen utama aplikasi volunteer platform
 * Mengatur routing dengan layout yang menggunakan Outlet
 * AnimatePresence sekarang dihandle di MainLayout
 *
 * @returns {JSX.Element} Struktur aplikasi lengkap dengan routing dan layout
 */
function App() {
	return (
		<>
			<Routes>
				{/* Public Routes with MainLayout */}
				<Route path="/" element={<MainLayout />}>
					<Route index element={<LandingPage />} />
					<Route path="events" element={<EventsPage />} />
					<Route path="organizations" element={<OrganizationsPage />} />

					{/* Add more routes as needed */}
				</Route>

				{/* Auth Routes (tanpa layout) */}
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
			</Routes>

			{/* Global Modals */}
			<JoinEventModal />
			<EventDetailModal />
		</>
	);
}

export default App;
