import { Routes, Route, Navigate } from "react-router-dom";

// Layout Components
import MainLayout from "@/layout/MainLayout";

// Auth Components
import GuestRoute from "@/components/auth/GuestRoute";
import {
	AdminRoute,
	OrganizationRoute,
	VolunteerRoute,
} from "@/components/auth/ProtectedRoute";

// Pages
import LandingPage from "@/pages/LandingPage";
import EventsPage from "@/pages/EventsPage";
import OrganizationsPage from "@/pages/OrganizationsPage";
import DetailEventPage from "@/pages/DetailEventPage";

// Auth Pages
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";

// Modals
import JoinEventModal from "@/components/JoinEventModal";
import NotFound from "@/components/fallback/NotFound";

// Admin Route
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEvents from "./pages/admin/events/EventReadPage";
import AdminCreadEvent from "./pages/admin/events/EventCreatePage";
import AdminLocations from "./pages/admin/locations/LocationReadPage";
import AdminCreateLocation from "./pages/admin/locations/LocationCreatePage";
import AdminUsers from "./pages/admin/users/UserReadPage";
import AdminCreateUsers from "./pages/admin/users/UserCreatePage";
import AdminEditEvent from "./pages/admin/events/EventEditPage";
import AdminEditLocation from "./pages/admin/locations/LocationEditPage";
import AdminEditUser from "./pages/admin/users/UserEditPage";
import AdminOrganization from "./pages/admin/organizations/OrganizationReadPage";
import AdminCreateOrganization from "./pages/admin/organizations/OrganizationCreatePage";
import AdminEditOrganization from "./pages/admin/organizations/OrganizationEditPage";
import AdminEventsParticipant from "./pages/admin/eventParticipants/EventParticipantReadPage";
import AdminCreateEventParticipant from "./pages/admin/eventParticipants/EventParticipantCreatePage";
import AdminEditEventParticipant from "./pages/admin/eventParticipants/EventParticipantEditPage";

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
				{/* PUBLIC ROUTES (bareng volunteer nanti) */}
				<Route element={<MainLayout />}>
					<Route index element={<Navigate to="/home" replace />} />
					<Route path="home" element={<LandingPage />} />
					<Route path="events">
						<Route index element={<EventsPage />} />
						<Route path="details/:eventId" element={<DetailEventPage />} />
					</Route>
					<Route path="organizations" element={<OrganizationsPage />} />
				</Route>

				{/* ADMIN ROUTES */}
				<Route
					path="admin"
					element={
						<AdminRoute>
							<MainLayout />
						</AdminRoute>
					}>
					<Route index element={<AdminDashboard />} />

					<Route path="events">
						<Route index element={<AdminEvents />} />
						<Route path="create" element={<AdminCreadEvent />} />
						<Route path="edit/:id" element={<AdminEditEvent />} />
					</Route>
					
					<Route path="locations">
						<Route index element={<AdminLocations />} />
						<Route path="create" element={<AdminCreateLocation />} />
						<Route path="edit/:id" element={<AdminEditLocation />} />
					</Route>
					
					<Route path="users">
						<Route index element={<AdminUsers />} />
						<Route path="create" element={<AdminCreateUsers />} />
						<Route path="edit/:id" element={<AdminEditUser />} />
					</Route>

					<Route path="organizations">
						<Route index element={<AdminOrganization />} />
						<Route path="create" element={<AdminCreateOrganization />} />
						<Route path="edit/:id" element={<AdminEditOrganization />} />
					</Route>

					<Route path="event-participants">
						<Route index element={<AdminEventsParticipant />} />
						<Route path="create" element={<AdminCreateEventParticipant />} />
						<Route path="edit/:id" element={<AdminEditEventParticipant />} />
					</Route>
				</Route>
				
				{/* ORGANIZATION ROUTES */}
				<Route
					path="organization"
					element={
						<OrganizationRoute>
							<MainLayout />
						</OrganizationRoute>
					}>
					<Route
						path="dashboard"
						element={
							<div className="min-h-screen flex items-center justify-center bg-gray-50">
								<div className="text-center">
									<h1 className="text-2xl font-bold text-gray-900 mb-4">
										Organization Dashboard
									</h1>
								</div>
							</div>
						}
					/>
				</Route>

				{/* AUTH ROUTES */}
				<Route
					path="/login"
					element={
						<GuestRoute>
							<LoginPage />
						</GuestRoute>
					}
				/>
				<Route
					path="/register"
					element={
						<GuestRoute>
							<RegisterPage />
						</GuestRoute>
					}
				/>
				{/* Fallback Route */}
				<Route path="*" element={<NotFound />} />
			</Routes>

			{/* Global Modals */}
			<JoinEventModal />
		</>
	);
}

export default App;
