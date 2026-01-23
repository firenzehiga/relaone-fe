import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/_hooks/useAuth";
import { getUserDashboard } from "./ProtectedRoute";

/**
 * Guest Route component untuk halaman yang hanya bisa diakses oleh user yang belum login
 * Contoh: login page, register page
 *
 * @param {Object} props - Props component
 * @param {React.ReactNode} props.children - Children component yang akan dirender jika belum authenticated
 * @param {string} props.redirectTo - Path untuk redirect jika sudah authenticated (default: "/")
 * @returns {React.ReactNode} Children component atau Navigate ke dashboard
 */
export default function GuestRoute({ children, redirectTo }) {
	const { isAuthenticated, user, initialized } = useAuthStore();
	const location = useLocation();

	// Wait for auth initialization to complete
	if (!initialized) {
		return null; // or <SuspenseFallback /> if you have one
	}

	// Cookie-based auth: if authenticated and user loaded, redirect to dashboard
	// No need to check token - isAuthenticated is set by API call in initializeAuth
	if (isAuthenticated && user) {
		// Cek apakah ada state.from untuk redirect ke halaman sebelumnya
		const from = location.state?.from?.pathname;

		if (from && from !== "/login" && from !== "/register") {
			return <Navigate to={from} replace />;
		}

		// Jika ada redirectTo yang spesifik
		if (redirectTo) {
			return <Navigate to={redirectTo} replace />;
		}

		// Default redirect berdasarkan role
		const userDashboard = getUserDashboard(user.role);
		return <Navigate to={userDashboard} replace />;
	}

	// Jika belum authenticated, render children (login/register page)
	return children;
}
/**
 * Helper function untuk mendapatkan dashboard URL berdasarkan user role
 *
 * @param {string} role - Role user
 * @returns {string} Dashboard URL
 */
