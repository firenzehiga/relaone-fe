import { useEffect, useState } from "react";
import { useAuthStore, useProfile } from "@/hooks/useAuth";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

/**
 * Auth Initializer component untuk menginisialisasi auth state saat app dimuat
 * Component ini akan:
 * 1. Cek apakah ada token di localStorage
 * 2. Jika ada, fetch user profile untuk memverifikasi token
 * 3. Update auth state sesuai hasil verifikasi
 * 4. Tunggu sampai proses selesai sebelum render children (mencegah flash)
 *
 * @param {Object} props - Props component
 * @param {React.ReactNode} props.children - Children component
 * @returns {React.ReactNode} Children component setelah auth state terinisialisasi
 */
export default function AuthInitializer({ children }) {
	const { token, isAuthenticated, setAuth, clearAuth, user } = useAuthStore();
	const { data: profileData, isError, isLoading } = useProfile();

	// State untuk tracking apakah inisialisasi sudah selesai
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		// Jika tidak ada token, langsung set initialized
		if (!token || !isAuthenticated) {
			setIsInitialized(true);
			return;
		}

		// Jika ada token tapi profile fetch error, clear auth dan set initialized
		if (token && isAuthenticated && isError) {
			clearAuth();
			setIsInitialized(true);
			return;
		}

		// Jika profile berhasil di-fetch dan belum ada user di store, update user di store
		if (profileData && !user) {
			setAuth(profileData, token);
			setIsInitialized(true);
			return;
		}

		// Jika sudah ada user di store, langsung set initialized
		if (user) {
			setIsInitialized(true);
			return;
		}

		// Jika masih loading profile dan ada token, tunggu
		if (isLoading && token) {
			return;
		}
	}, [
		profileData,
		isError,
		token,
		isAuthenticated,
		setAuth,
		clearAuth,
		user,
		isLoading,
	]);

	// Tampilkan loading sampai inisialisasi selesai
	if (!isInitialized) {
		return (
			<>
				<Header />
				<div className="min-h-screen flex items-center justify-center bg-gray-50">
					<div className="flex flex-col items-center space-y-4">
						<div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
						<p className="text-gray-600 text-sm">menginisialisasi...</p>
					</div>
				</div>
				<Footer />
			</>
		);
	}

	// Render children setelah auth state terinisialisasi
	return children;
}
