import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/_hooks/useAuth";

/**
 * Protected Route component untuk melindungi halaman yang memerlukan authentication
 *
 * @param {Object} props - Props component
 * @param {React.ReactNode} props.children - Children component yang akan dirender jika authenticated
 * @param {string[]} props.allowedRoles - Array role yang diizinkan mengakses route ini
 * @param {string} props.redirectTo - Path untuk redirect jika tidak authenticated (default: "/login")
 * @returns {React.ReactNode} Children component atau Navigate ke login page
 */
export default function ProtectedRoute({ children, allowedRoles = [], redirectTo = "/login" }) {
	const { isAuthenticated, user, token } = useAuthStore();
	const location = useLocation();

	// Apakah kita mengizinkan guest/public? (gunakan string kosong "" untuk publik)
	const allowGuest = allowedRoles.includes("");

	// Jika guest diizinkan dan user belum login, izinkan akses publik
	if (allowGuest && (!token || !isAuthenticated)) {
		return children;
	}

	// Jika tidak ada token atau belum authenticated => redirect ke login
	if (!token || !isAuthenticated) {
		return <Navigate to={redirectTo} replace />;
	}

	// Jika ada token tapi user belum dimuat, kita tidak lagi menampilkan
	// loading di sini — treat missing `user` sebagai tidak authenticated
	// sehingga route akan redirect ke login. Ini menyederhanakan perilaku
	// dan mencegah tampilan yang jarang terlihat menjadi membingungkan.
	if (token && isAuthenticated && !user) {
		return <Navigate to={redirectTo} replace />;
	}

	// Jika ada pembatasan role dan user role tidak sesuai
	// Abaikan nilai kosong saat melakukan pengecekan role (string kosong = publik)
	const roleChecks = allowedRoles.filter((allowedRole) => Boolean(allowedRole));
	if (roleChecks.length > 0 && user && !roleChecks.includes(user.role)) {
		// Redirect ke dashboard sesuai role user
		const userDashboard = getUserDashboard(user.role);
		return <Navigate to={userDashboard} replace />;
	}

	// Jika semua validasi lolos, render children
	return children;
}

/**
 * Helper function untuk mendapatkan dashboard URL berdasarkan user role
 *
 * @param {string} role - Role user
 * @returns {string} Dashboard URL
 */

/**
 * Component untuk melindungi route admin saja
 */
export function AdminRoute({ children }) {
	return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
}

/**
 * Component untuk melindungi route organization saja
 */
export function OrganizationRoute({ children }) {
	return <ProtectedRoute allowedRoles={["organization"]}>{children}</ProtectedRoute>;
}

/**
 * Component untuk melindungi route volunteer saja
 */
export function VolunteerRoute({ children }) {
	return <ProtectedRoute allowedRoles={["volunteer"]}>{children}</ProtectedRoute>;
}

/**
 * Component untuk melindungi route volunteer saja
 */
export function PublicRoute({ children }) {
	return <ProtectedRoute allowedRoles={["volunteer", ""]}>{children}</ProtectedRoute>;
}

/**
 * Component untuk route yang bisa diakses admin dan organization
 */
export function AdminOrganizationRoute({ children }) {
	return <ProtectedRoute allowedRoles={["admin", "organization"]}>{children}</ProtectedRoute>;
}

/**
 * Local helper to obtain dashboard path per role (kept local to avoid extra files)
 */
export function getUserDashboard(role) {
	switch (role) {
		case "admin":
			return "/admin/dashboard";
		case "organization":
			return "/organization/dashboard";
		case "volunteer":
		default:
			return "/";
	}
}
