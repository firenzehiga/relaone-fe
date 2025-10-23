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

// Organization pages
import OrganizationsDashboard from "@/pages/organization/OrganizationDashboard";

import EventParticipantRead from "@/pages/organization/event-participants/EventParticipantReadPage";
import EventParticipantCreate from "@/pages/organization/event-participants/EventParticipantCreatePage";

import EventRead from "@/pages/organization/events/EventReadPage";
import EventCreate from "@/pages/organization/events/eventCreatePage";

import FeedbackRead from "@/pages/organization/feedbacks/FeedbackReadPage";
import FeedbackCreate from "@/pages/organization/feedbacks/FeedbackCreatePage";

import LocationRead from "@/pages/organization/locations/LocationReadPage";
import LocationCreate from "@/pages/organization/locations/LocationCreatePage";

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
          }
        >
          <Route
            path="dashboard"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Admin Dashboard
                  </h1>
                </div>
              </div>
            }
          />
          <Route path="events">
            <Route index element={<div>Admin Event List</div>} />
            <Route path="create" element={<div>Admin Event Create</div>} />
          </Route>
        </Route>
        {/* ORGANIZATION ROUTES */}
        <Route
          path="organization"
          element={
            <OrganizationRoute>
              <MainLayout />
            </OrganizationRoute>
          }
        >
          <Route path="dashboard" element={<OrganizationsDashboard />} />

          <Route path="event-participants">
            <Route index element={<EventParticipantRead />} />
            <Route path="create" element={<EventParticipantCreate />} />
          </Route>

          <Route path="events">
            <Route index element={<EventRead />} />
            <Route path="create" element={<EventCreate />} />
          </Route>

          <Route path="feedbacks">
            <Route index element={<FeedbackRead />} />
            <Route path="create" element={<FeedbackCreate />} />
          </Route>

          <Route path="locations">
            <Route index element={<LocationRead />} />
            <Route path="create" element={<LocationCreate />} />
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
