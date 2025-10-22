import { Outlet, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
	useAuthStore,
	isPathAllowedForRole,
	getUserDashboard,
} from "@/hooks/useAuth";

export default function MainLayout() {
	const location = useLocation();

	const { isAuthenticated, user } = useAuthStore();
	const token = localStorage.getItem("authToken");

	// Auto scroll to top setiap pindah halaman
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	// Jika user sudah login dan tidak diizinkan melihat halaman publik ini -> redirect
	// selalu cek variable roleAllowed di auth.js apakah url terdaftar
	if (isAuthenticated && user) {
		const path = location.pathname;
		const allowed = isPathAllowedForRole(user.role, path);
		if (!allowed) {
			return <Navigate to={getUserDashboard(user.role)} replace />;
		}
	}

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
			<Header />
			<main className="flex-1">
				<AnimatePresence mode="wait">
					<Outlet />
				</AnimatePresence>
			</main>
			<Footer />
		</div>
	);
}
