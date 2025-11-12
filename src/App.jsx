import { Routes, Route, Navigate } from "react-router-dom";

// Layout Components
import MainLayout from "@/layout/MainLayout";

// Auth Components
import GuestRoute from "@/components/auth/GuestRoute";
import {
	AdminRoute,
	OrganizationRoute,
	PublicRoute,
	VolunteerRoute,
} from "@/components/auth/ProtectedRoute";

// Volunteer/Public Pages
import LandingPage from "@/pages/LandingPage";
import EventsPage from "@/pages/EventsPage";
import OrganizationsPage from "@/pages/OrganizationsPage";
import DetailEventPage from "@/pages/DetailEventPage";
import ProfilePage from "@/pages/volunteer/ProfilePage";
import EditProfilePage from "@/pages/volunteer/EditProfilePage";
import MyActivitiesPage from "@/pages/volunteer/MyActivitiesPage";
import ActivityDetailPage from "@/pages/volunteer/ActivityDetailPage";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import ResetPasswordPage from "@/pages/auth/ResetPassword";

// Modals
import JoinEventModal from "@/components/JoinEventModal";
import CancelJoinModal from "@/components/CancelJoinModal";
import NotFound from "@/components/fallback/NotFound";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProfilePage from "@/pages/admin/profiles/ProfilePage";
import AdminEditProfilePage from "@/pages/admin/profiles/EditProfilePage";

import AdminUser from "@/pages/admin/users/UserRead";
import AdminUserCreate from "@/pages/admin/users/UserCreate";
import AdminUserEdit from "@/pages/admin/users/UserEdit";

import AdminOrganization from "@/pages/admin/organizations/OrganizationRead";
import AdminOrganizationCreate from "@/pages/admin/organizations/OrganizationCreate";
import AdminOrganizationEdit from "@/pages/admin/organizations/OrganizationEdit";

import AdminEvent from "@/pages/admin/events/EventRead";
import AdminEventCreate from "@/pages/admin/events/EventCreate";
import AdminEventEdit from "@/pages/admin/events/EventEdit";

import AdminEventParticipant from "@/pages/admin/event-participants/EventParticipantRead";
import AdminEventParticipantCreate from "@/pages/admin/event-participants/EventParticipantCreate";
import AdminEventParticipantEdit from "@/pages/admin/event-participants/EventParticipantEdit";

import AdminLocation from "@/pages/admin/locations/LocationRead";
import AdminLocationCreate from "@/pages/admin/locations/LocationCreate";
import AdminLocationEdit from "@/pages/admin/locations/LocationEdit";

import AdminCategory from "@/pages/admin/categories/CategoryRead";
import AdminCategoryCreate from "@/pages/admin/categories/CategoryCreate";
import AdminCategoryEdit from "@/pages/admin/categories/CategoryEdit";

import AdminFeedback from "@/pages/admin/feedbacks/FeedbackRead";
import AdminFeedbackEdit from "@/pages/admin/feedbacks/FeedbackEdit";

// Organization Pages
import OrganizationsDashboard from "@/pages/organization/OrganizationDashboard";
import OrganizationProfilePage from "@/pages/organization/profiles/ProfilePage";
import OrganizationEditProfilePage from "@/pages/organization/profiles/EditProfilePage";

import OrganizationEvent from "@/pages/organization/events/EventRead";
import OrganizationEventCreate from "@/pages/organization/events/EventCreate";
import OrganizationEventEdit from "@/pages/organization/events/EventEdit";

import OrganizationEventParticipant from "@/pages/organization/event-participants/EventParticipantRead";
import EventScannerPage from "@/pages/organization/event-participants/EventScannerPage";

import OrganizationFeedback from "@/pages/organization/feedbacks/FeedbackRead";

import OrganizationLocation from "@/pages/organization/locations/LocationRead";
import OrganizationLocationCreate from "@/pages/organization/locations/LocationCreate";
import OrganizationLocationEdit from "@/pages/organization/locations/LocationEdit";
import AdminLayout from "./layout/AdminLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
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
			<ScrollToTop />
			<Routes>
				{/* PUBLIC ROUTES (bareng volunteer nanti) */}
				<Route
					element={
						<PublicRoute>
							<MainLayout />
						</PublicRoute>
					}>
					<Route path="/" element={<LandingPage />} />
					<Route path="events">
						<Route index element={<EventsPage />} />
						<Route path="details/:eventId" element={<DetailEventPage />} />
					</Route>
					<Route path="organizations" element={<OrganizationsPage />} />
				</Route>
				<Route
					path="volunteer"
					element={
						<VolunteerRoute>
							<MainLayout />
						</VolunteerRoute>
					}>
					<Route path="profile">
						<Route index element={<ProfilePage />} />
						<Route path="edit" element={<EditProfilePage />} />
					</Route>
					<Route path="my-activities">
						<Route index element={<MyActivitiesPage />} />
						<Route path=":id" element={<ActivityDetailPage />} />
					</Route>
				</Route>

				<Route
					path="forgot-password"
					element={
						<GuestRoute>
							<ForgotPasswordPage />
						</GuestRoute>
					}
				/>
				<Route
					path="reset-password"
					element={
						<GuestRoute>
							<ResetPasswordPage />
						</GuestRoute>
					}
				/>

				{/* ADMIN ROUTES */}
				<Route
					path="admin"
					element={
						<AdminRoute>
							<AdminLayout />
						</AdminRoute>
					}>
					<Route path="dashboard" element={<AdminDashboard />} />
					<Route path="profile">
						<Route index element={<AdminProfilePage />} />
						<Route path="edit" element={<AdminEditProfilePage />} />
					</Route>
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
					<Route path="categories">
						<Route index element={<AdminCategory />} />
						<Route path="create" element={<AdminCategoryCreate />} />
						<Route path="edit/:id" element={<AdminCategoryEdit />} />
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
					<Route path="profile">
						<Route index element={<OrganizationProfilePage />} />
						<Route path="edit" element={<OrganizationEditProfilePage />} />
					</Route>
					<Route path="event-participants">
						<Route index element={<OrganizationEventParticipant />} />
						<Route path="scanner/:eventId" element={<EventScannerPage />} />
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
			<CancelJoinModal />
		</>
	);
}

export default App;
