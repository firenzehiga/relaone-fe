import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// UI Libraries
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart, Search, Users } from "lucide-react";
import * as Lucide from "lucide-react";

// Hooks / stores
import { useEvents } from "@/_hooks/useEvents";
import { useCategory } from "@/_hooks/useCategories";
import { useModalStore } from "@/stores/useAppStore";
import { useDocumentTitle } from "@/_hooks/utils/useDocumentTitle";

// UI Components
import DynamicButton from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CountUp from "@/components/ui/CountUp";
import Skeleton from "@/components/ui/Skeleton";

// Feature components / pages
import Hero from "@/components/Hero";
import VideoShowcase from "@/components/VideoShowcase";
import EventCard from "@/components/EventCard";

export default function LandingPage() {
	useDocumentTitle("Home Page");

	const navigate = useNavigate();
	const { data: events = [], isLoading: eventsLoading } = useEvents();

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

	const features = [
		{
			icon: Search,
			title: "Temukan Kegiatan Sosial",
			description:
				"Cari dan ikuti berbagai kegiatan sosial yang sesuai dengan minat dan passion Anda.",
		},
		{
			icon: Users,
			title: "Bergabung Komunitas",
			description:
				"Bertemu dengan sesama relawan dan bangun jaringan untuk kegiatan sosial yang berkelanjutan.",
		},
		{
			icon: Heart,
			title: "Berbagi Kebaikan",
			description: "Kontribusi nyata untuk masyarakat dan rasakan kepuasan membantu sesama.",
		},
	];

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

	const handleViewEventDetail = (eventId) => {
		navigate(`/events/details/${eventId}`);
	};

	return (
		<AnimatePresence mode="wait">
			<div className="w-full overflow-x-hidden">
				{/* Hero Section */}
				<Hero />
				{/* Stats Section */}
				<section className="w-full py-16 bg-gradient-to-r from-emerald-600 to-emerald-600">
					<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{[
								{ label: "Kegiatan Dibuat ", value: stats.totalEvents, suffix: "+" },
								{
									label: "Relawan Terdaftar",
									value: stats.totalVolunteers,
									suffix: "+",
								},
								{
									label: "Organisasi Partner",
									value: stats.totalOrganizations,
									suffix: "+",
								},
							].map((stat, index) => (
								<motion.div
									key={stat.label}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									exit={{ opacity: 0 }}
									className="text-center group">
									<div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
										<CountUp
											from={0}
											to={stat.value}
											duration={1.2}
											separator="."
											className="inline"
										/>
										<span className="ml-1 inline">{stat.suffix}</span>
									</div>
									<div className="text-emerald-100 font-medium">{stat.label}</div>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="w-full py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
					<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
								Mengapa Memilih Rela
								<span className="text-emerald-600">O</span>ne?
							</h2>
							<p className="text-xl text-gray-600 max-w-3xl mx-auto">
								Platform terpercaya untuk menghubungkan relawan dengan kegiatan sosial yang bermakna
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{features.map((feature, index) => (
								<motion.div
									key={feature.title}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									exit={{ opacity: 0 }}
									className="group">
									<Card className="text-center h-full group-hover:scale-105 transition-transform ease-out duration-300">
										<div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
											<feature.icon className="text-white" size={28} />
										</div>
										<h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
										<p className="text-gray-600 leading-relaxed">{feature.description}</p>
									</Card>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* Video Showcase Section */}
				<VideoShowcase />

				{/* Categories Section */}
				<section className="w-full py-20 bg-white">
					<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
								Kategori Kegiatan
							</h2>
							<p className="text-xl text-gray-600">
								Beragam jenis kegiatan sosial yang dapat Anda ikuti
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{categories.slice(0, 3).map((category, index) => {
								// pakai Lucide untuk mendapatkan icon berdasarkan nama string
								const Icon = Lucide[category.icon];
								return (
									<motion.div
										key={category.id}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: index * 0.1 }}
										exit={{ opacity: 0 }}
										className="cursor-pointer"
										onClick={() => navigate(`/events?category=${category.id}`)}>
										<Card className="text-center hover:scale-105 transition-transform ease-out duration-300">
											<div
												className={`mx-auto w-16 h-16  rounded-full flex items-center justify-center mb-6`}
												style={{ backgroundColor: `${category.warna}20` }}>
												{Icon ? <Icon style={{ color: category.warna }} size={32} /> : null}
											</div>
											<h3 className="text-xl font-semibold text-gray-500 mb-2">{category.nama}</h3>
											<p className="text-gray-400">{category.deskripsi}</p>
										</Card>
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>

				{/* Featured Events */}
				<section className="w-full py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
					<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between mb-12">
							<div>
								<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
									Kegiatan Terbaru
								</h2>
								<p className="text-xl text-gray-600">
									Kegiatan sosial yang sedang dibuka untuk pendaftaran
								</p>
							</div>
							<DynamicButton variant="outline" onClick={() => navigate("/events")}>
								Lihat Semua
								<ArrowRight size={16} className="ml-2" />
							</DynamicButton>
						</div>

						{eventsLoading ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{Array.from({ length: 3 }).map((_, i) => (
									<Skeleton.EventCard key={i} />
								))}
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{featuredEvents.map((event, index) => (
									<motion.div
										key={event.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0 }}
										transition={{ delay: index * 0.1 }}>
										<EventCard event={event} onJoin={handleJoinEvent} />
									</motion.div>
								))}
							</div>
						)}
					</div>
				</section>

				{/* CTA Section */}
				<section className="w-full py-20 bg-gradient-to-r from-emerald-600 to-emerald-600">
					<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.8 }}>
							<h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
								Siap Memulai Perjalanan Volunteer Anda?
							</h2>
							<p className="text-xl text-emerald-100 mb-8 leading-relaxed">
								Bergabunglah dengan ribuan relawan lainnya dan mari bersama-sama membuat perubahan
								positif untuk masyarakat.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<DynamicButton
									size="lg"
									variant="secondary"
									className="border-white text-black hover:bg-white hover:text-emerald-600"
									onClick={() => navigate("/events")}>
									Jelajahi Kegiatan
								</DynamicButton>
							</div>
						</motion.div>
					</div>
				</section>
			</div>
		</AnimatePresence>
	);
}
