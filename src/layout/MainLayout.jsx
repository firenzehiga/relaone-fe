import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Layout() {
	const location = useLocation();

	// Auto scroll to top setiap pindah halaman
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

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
