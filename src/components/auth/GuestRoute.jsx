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

	// Cek token di localStorage secara langsung untuk validasi cepat
	const token = localStorage.getItem("authToken");

	// Jika store belum di-initialized, tunggu agar tidak memutuskan redirect
	// secara prematur (ini mencegah redirect loops saat app meng-verifikasi token)
	if (!initialized) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="flex flex-col items-center space-y-4">
					<div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
					<p className="text-gray-600 text-sm">Checking authentication...</p>
				</div>
			</div>
		);
	}

	// Jika sudah authenticated, ada user, dan token masih ada di storage,
	// redirect ke dashboard sesuai role. Memastikan token hadir mencegah
	// mutual redirect ketika store masih menandakan authenticated tetapi
	// `authToken` sudah dihapus (mis. oleh user/manual), yang menyebabkan
	// loop antara ProtectedRoute -> /login dan GuestRoute -> / (dashboard).
	if (isAuthenticated && user && token) {
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
