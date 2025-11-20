import { Routes, Route } from "react-router-dom";

// Layout Components
import MainLayout from "@/layout/MainLayout";
import AdminLayout from "@/layout/AdminLayout";

// Auth Components
import GuestRoute from "@/components/auth/GuestRoute";
import ProtectedRoute, {
	AdminRoute,
	OrganizationRoute,
	PublicRoute,
	VolunteerRoute,
} from "@/components/auth/ProtectedRoute";
import React, { lazy, Suspense } from "react";

// Volunteer/Public Pages
import LandingPage from "@/pages/LandingPage";
import EventsPage from "@/pages/EventsPage";
import OrganizationsPage from "@/pages/OrganizationsPage";
import AboutPage from "@/pages/AboutPage";
const { PrivacyPolicyPage, TermsOfServicePage } = {
	PrivacyPolicyPage: lazy(() =>
		import("./pages/PrivacyTerms").then((m) => ({ default: m.PrivacyPolicyPage }))
	),
	TermsOfServicePage: lazy(() =>
		import("./pages/PrivacyTerms").then((m) => ({ default: m.TermsOfServicePage }))
	),
};

// Volunteer
const DetailEventPage = lazy(() => import("@/pages/DetailEventPage"));
const ProfilePage = lazy(() => import("@/pages/volunteer/ProfilePage"));
const EditProfilePage = lazy(() => import("@/pages/volunteer/EditProfilePage"));
const MyActivitiesPage = lazy(() => import("@/pages/volunteer/MyActivitiesPage"));
const ActivityDetailPage = lazy(() => import("@/pages/volunteer/ActivityDetailPage"));

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPassword"));
const ChangePasswordPage = lazy(() => import("@/pages/auth/ChangePasswordPage"));

// Modals
import JoinEventModal from "@/components/JoinEventModal";
import CancelJoinModal from "@/components/CancelJoinModal";
import FeedbackModal from "@/components/FeedbackModal";
const NotFound = lazy(() => import("@/components/fallback/NotFound"));

// Admin Pages
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminProfilePage = lazy(() => import("@/pages/admin/profiles/ProfilePage"));
const AdminEditProfilePage = lazy(() => import("@/pages/admin/profiles/EditProfilePage"));

const AdminUser = lazy(() => import("@/pages/admin/users/UserRead"));
const AdminUserCreate = lazy(() => import("@/pages/admin/users/UserCreate"));
const AdminUserEdit = lazy(() => import("@/pages/admin/users/UserEdit"));

const AdminOrganization = lazy(() => import("@/pages/admin/organizations/OrganizationRead"));
const AdminOrganizationCreate = lazy(() =>
	import("@/pages/admin/organizations/OrganizationCreate")
);
const AdminOrganizationEdit = lazy(() => import("@/pages/admin/organizations/OrganizationEdit"));

const AdminEvent = lazy(() => import("@/pages/admin/events/EventRead"));
const AdminEventCreate = lazy(() => import("@/pages/admin/events/EventCreate"));
const AdminEventEdit = lazy(() => import("@/pages/admin/events/EventEdit"));

const AdminEventParticipant = lazy(() =>
	import("@/pages/admin/event-participants/EventParticipantRead")
);
const AdminEventParticipantCreate = lazy(() =>
	import("@/pages/admin/event-participants/EventParticipantCreate")
);
const AdminEventParticipantEdit = lazy(() =>
	import("@/pages/admin/event-participants/EventParticipantEdit")
);

const AdminLocation = lazy(() => import("@/pages/admin/locations/LocationRead"));
const AdminLocationCreate = lazy(() => import("@/pages/admin/locations/LocationCreate"));
const AdminLocationEdit = lazy(() => import("@/pages/admin/locations/LocationEdit"));

const AdminCategory = lazy(() => import("@/pages/admin/categories/CategoryRead"));
const AdminCategoryCreate = lazy(() => import("@/pages/admin/categories/CategoryCreate"));
const AdminCategoryEdit = lazy(() => import("@/pages/admin/categories/CategoryEdit"));

const AdminFeedback = lazy(() => import("@/pages/admin/feedbacks/FeedbackRead"));
const AdminFeedbackEdit = lazy(() => import("@/pages/admin/feedbacks/FeedbackEdit"));

// Organization Pages
const OrganizationsDashboard = lazy(() => import("@/pages/organization/OrganizationDashboard"));
const OrganizationProfilePage = lazy(() => import("@/pages/organization/profiles/ProfilePage"));
const OrganizationEditProfilePage = lazy(() =>
	import("@/pages/organization/profiles/EditProfilePage")
);

const OrganizationEvent = lazy(() => import("@/pages/organization/events/EventRead"));
const OrganizationEventCreate = lazy(() => import("@/pages/organization/events/EventCreate"));
const OrganizationEventEdit = lazy(() => import("@/pages/organization/events/EventEdit"));

const OrganizationEventParticipant = lazy(() =>
	import("@/pages/organization/event-participants/EventParticipantRead")
);
const EventScannerPage = lazy(() =>
	import("@/pages/organization/event-participants/EventScannerPage")
);

const OrganizationFeedback = lazy(() => import("@/pages/organization/feedbacks/FeedbackRead"));

const OrganizationLocation = lazy(() => import("@/pages/organization/locations/LocationRead"));
const OrganizationLocationCreate = lazy(() =>
	import("@/pages/organization/locations/LocationCreate")
);
const OrganizationLocationEdit = lazy(() => import("@/pages/organization/locations/LocationEdit"));

import { ScrollToTop } from "@/components/common/ScrollToTop";
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
			<Suspense fallback={<div></div>}>
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
						<Route path="about-us" element={<AboutPage />} />
					</Route>
					<Route path="privacy-policy" element={<PrivacyPolicyPage />} />
					<Route path="terms-of-service" element={<TermsOfServicePage />} />
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
					{/* Change Password - shared protected page for all authenticated roles */}
					<Route
						element={
							<ProtectedRoute allowedRoles={["admin", "organization", "volunteer"]}>
								<MainLayout />
							</ProtectedRoute>
						}>
						<Route path="change-password" element={<ChangePasswordPage />} />
					</Route>
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
			</Suspense>

			{/* Global Modals */}
			<JoinEventModal />
			<CancelJoinModal />
			<FeedbackModal />
		</>
	);
}

export default App;
