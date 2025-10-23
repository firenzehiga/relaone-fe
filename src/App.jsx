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

// Admin Pages
import AdminDashboard from "@/pages/Admin/AdminDashboard";

import AdminUser from "@/pages/Admin/users/UserRead";
import AdminUserCreate from "@/pages/Admin/users/UserCreate";
import AdminUserEdit from "@/pages/Admin/users/UserEdit";

import AdminOrganization from "@/pages/Admin/organizations/OrganizationRead";
import AdminOrganizationCreate from "@/pages/Admin/organizations/OrganizationCreate";
import AdminOrganizationEdit from "@/pages/Admin/organizations/OrganizationEdit";

import AdminEvent from "@/pages/Admin/events/EventRead";
import AdminEventCreate from "@/pages/Admin/events/EventCreate";
import AdminEventEdit from "@/pages/Admin/events/EventEdit";

import AdminEventParticipant from "@/pages/Admin/event-participants/EventParticipantRead";
import AdminEventParticipantCreate from "@/pages/Admin/event-participants/EventParticipantCreate";
import AdminEventParticipantEdit from "@/pages/Admin/event-participants/EventParticipantEdit";

import AdminLocation from "@/pages/Admin/locations/LocationRead";
import AdminLocationCreate from "@/pages/Admin/locations/LocationCreate";
import AdminLocationEdit from "@/pages/Admin/locations/LocationEdit";

import AdminFeedback from "@/pages/Admin/feedbacks/FeedbackRead";
import AdminFeedbackEdit from "@/pages/Admin/feedbacks/FeedbackEdit";

// Organization Pages
import OrganizationsDashboard from "@/pages/Organization/OrganizationDashboard";

import OrganizationEvent from "@/pages/Organization/events/EventRead";
import OrganizationEventCreate from "@/pages/Organization/events/EventCreate";
import OrganizationEventEdit from "@/pages/Organization/events/EventEdit";

import OrganizationEventParticipant from "@/pages/Organization/event-participants/EventParticipantRead";

import OrganizationFeedback from "@/pages/Organization/feedbacks/FeedbackRead";

import OrganizationLocation from "@/pages/Organization/locations/LocationRead";
import OrganizationLocationCreate from "@/pages/Organization/locations/LocationCreate";
import OrganizationLocationEdit from "@/pages/Organization/locations/LocationEdit";
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
					<Route path="dashboard" element={<AdminDashboard />} />

					<Route path="events">
						<Route index element={<AdminEvent />} />
						<Route path="create" element={<AdminEventCreate />} />
						<Route path="edit/:id" element={<AdminEventEdit />} />
					</Route>

					<Route path="users">
						<Route index element={<AdminUser />} />
						<Route path="create" element={<AdminUserCreate />} />
						<Route path="edit/:id" element={<AdminUserEdit />} />
					</Route>

					<Route path="organizations">
						<Route index element={<AdminOrganization />} />
						<Route path="create" element={<AdminOrganizationCreate />} />
						<Route path="edit/:id" element={<AdminOrganizationEdit />} />
					</Route>

					<Route path="event-participants">
						<Route index element={<AdminEventParticipant />} />
						<Route path="create" element={<AdminEventParticipantCreate />} />
						<Route path="edit/:id" element={<AdminEventParticipantEdit />} />
					</Route>
					<Route path="locations">
						<Route index element={<AdminLocation />} />
						<Route path="create" element={<AdminLocationCreate />} />
						<Route path="edit/:id" element={<AdminLocationEdit />} />
					</Route>
					<Route path="feedbacks">
						<Route index element={<AdminFeedback />} />
						<Route path="edit/:id" element={<AdminFeedbackEdit />} />
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
					<Route path="dashboard" element={<OrganizationsDashboard />} />

					<Route path="event-participants">
						<Route index element={<OrganizationEventParticipant />} />
					</Route>

					<Route path="events">
						<Route index element={<OrganizationEvent />} />
						<Route path="create" element={<OrganizationEventCreate />} />
						<Route path="edit/:id" element={<OrganizationEventEdit />} />
					</Route>

					<Route path="feedbacks">
						<Route index element={<OrganizationFeedback />} />
					</Route>

					<Route path="locations">
						<Route index element={<OrganizationLocation />} />
						<Route path="create" element={<OrganizationLocationCreate />} />
						<Route path="edit/:id" element={<OrganizationLocationEdit />} />
					</Route>
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
