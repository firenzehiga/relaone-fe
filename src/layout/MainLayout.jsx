import { Outlet, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MainLayout() {
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
			<Header />
			<Outlet />
			<Footer />
		</div>
	);
}
