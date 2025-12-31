import { lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// UI Libraries
import { AnimatePresence } from "framer-motion";

// Hooks / stores
import { useEvents } from "@/_hooks/useEvents";
import { useCategory } from "@/_hooks/useCategories";
import { useModalStore } from "@/stores/useAppStore";
import { useDocumentTitle } from "@/_hooks/utils/useDocumentTitle";

// Feature components / pages
import Hero from "@/components/Hero";
const VideoShowcase = lazy(() => import("@/components/VideoShowcase"));
const StatsSection = lazy(() => import("@/components/landing/StatsSection"));
const FeaturesSection = lazy(() => import("@/components/landing/FeaturesSection"));
const FeaturedEventsSection = lazy(() => import("@/components/landing/FeaturedEventsSection"));
const CTASection = lazy(() => import("@/components/landing/CTASection"));
const CategoriesSection = lazy(() => import("@/components/landing/CategoriesSection"));

export default function LandingPage() {
	useDocumentTitle("Mari Bersama-sama Membuat Perubahan Positif");
	const navigate = useNavigate();
	const { events, isLoading: eventsLoading } = useEvents();

	const {
		data: categories = [],
		isLoading: categoriesLoading,
		error: categoriesError,
	} = useCategory();

	const { openJoinModal } = useModalStore();

	const [stats, setStats] = useState({
		totalEvents: 0,
		totalVolunteers: 0,
		totalOrganizations: 0,
	});

	useEffect(() => {
		// Simulate stats calculation
		setTimeout(() => {
			setStats({
				totalEvents: 47,
				totalVolunteers: 1250,
				totalOrganizations: 18,
			});
		}, 500);
	}, [setStats]);

	const featuredEvents = events?.filter((event) => event.status === "published").slice(0, 3) || [];

	/**
	 * Handler untuk membuka modal pendaftaran event
	 *
	 * @param {string|number} eventId - ID event yang akan didaftari
	 */
	const handleJoinEvent = (eventId) => {
		const evt = events.find((e) => String(e.id) === String(eventId)) || null;
		openJoinModal(evt);
	};

	return (
		<AnimatePresence mode="wait">
			<div className="w-full overflow-x-hidden">
				{/* Hero Section */}
				<Hero />
				<StatsSection stats={stats} />
				{/* Features Section */}
				<FeaturesSection />
				{/* Video Showcase Section */}
				<VideoShowcase />
				{/* Categories Section */}
				<CategoriesSection categories={categories} />
				{/* Featured Events */}
				<FeaturedEventsSection
					eventsLoading={eventsLoading}
					featuredEvents={featuredEvents}
					onJoin={handleJoinEvent}
				/>
				{/* Call to Action Section */}
				<CTASection />
			</div>
		</AnimatePresence>
	);
}
