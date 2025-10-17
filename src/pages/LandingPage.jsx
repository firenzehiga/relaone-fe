import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	ArrowRight,
	Calendar,
	Users,
	Heart,
	Search,
	Leaf,
	BookOpen,
	Stethoscope,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EventCard from "@/components/EventCard";
import Skeleton from "@/components/ui/Skeleton";
import { useEvents } from "@/hooks/useEvents";
import { useModalStore } from "@/stores/useAppStore";

const LandingPage = () => {
	const navigate = useNavigate();
	const { data: events, isLoading: eventsLoading } = useEvents({
		status: "published",
	});
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
				totalVolunteers: 1240,
				totalOrganizations: 18,
			});
		}, 1000);
	}, []);

	const features = [
		{
			icon: Search,
			title: "Temukan Event",
			description:
				"Cari dan ikuti berbagai kegiatan sosial yang sesuai dengan minat dan passion Anda.",
		},
		{
			icon: Users,
			title: "Bergabung Komunitas",
			description:
				"Bertemu dengan sesama volunteer dan bangun jaringan untuk kegiatan sosial yang berkelanjutan.",
		},
		{
			icon: Heart,
			title: "Berbagi Kebaikan",
			description:
				"Kontribusi nyata untuk masyarakat dan rasakan kepuasan membantu sesama.",
		},
	];

	const categories = [
		{
			name: "Lingkungan",
			icon: Leaf,
			color: "text-green-400",
			bgColor: "bg-green-400/10",
			description: "Aksi peduli lingkungan",
		},
		{
			name: "Pendidikan",
			icon: BookOpen,
			color: "text-blue-400",
			bgColor: "bg-blue-400/10",
			description: "Edukasi dan pembelajaran",
		},
		{
			name: "Kesehatan",
			icon: Stethoscope,
			color: "text-red-400",
			bgColor: "bg-red-400/10",
			description: "Layanan kesehatan",
		},
	];

	const featuredEvents =
		events?.filter((event) => event.status === "published").slice(0, 3) || [];

	const handleJoinEvent = (eventId) => {
		openJoinModal(eventId);
	};

	const handleViewEventDetail = (eventId) => {
		navigate(`/events/${eventId}`);
	};

	return (
		<div className="w-full overflow-x-hidden">
			{/* Hero Section */}
			<section className="relative w-full min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
				<div className="absolute inset-0 w-full">
					<div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
					<div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
					<div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
				</div>
				<div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							className="flex flex-col justify-center">
							<h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
								Bergabung dalam
								<span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
									Aksi Sosial
								</span>
								yang Bermakna
							</h1>
							<p className="text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 leading-relaxed">
								Platform yang menghubungkan para volunteer dengan organisasi
								untuk berbagai kegiatan sosial. Mari bersama-sama membuat
								perubahan positif untuk masyarakat.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Button
									size="lg"
									variant="primary"
									onClick={() => navigate("/events")}
									className="group">
									Lihat Event
									<ArrowRight
										size={20}
										className="ml-2 group-hover:translate-x-1 transition-transform"
									/>
								</Button>
								<Button
									size="lg"
									variant="outline"
									onClick={() => navigate("/register")}>
									Buat Event
								</Button>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="relative">
							<div className="relative">
								<img
									src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=600&fit=crop"
									alt="Volunteer activities"
									className="rounded-2xl shadow-2xl"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="w-full py-16 bg-gradient-to-r from-blue-600 to-purple-600">
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{ label: "Event Aktif", value: stats.totalEvents, suffix: "+" },
							{
								label: "Volunteer Terdaftar",
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
								className="text-center group">
								<div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
									{stat.value}
									{stat.suffix}
								</div>
								<div className="text-blue-100 font-medium">{stat.label}</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="w-full py-20 bg-gradient-to-br from-gray-50 to-blue-50">
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
							Mengapa Memilih VolunteerHub?
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Platform terpercaya untuk menghubungkan volunteer dengan kegiatan
							sosial yang bermakna
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="group">
								<Card className="text-center h-full group-hover:scale-105 transition-transform duration-300">
									<div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
										<feature.icon className="text-white" size={28} />
									</div>
									<h3 className="text-xl font-bold text-gray-900 mb-4">
										{feature.title}
									</h3>
									<p className="text-gray-600 leading-relaxed">
										{feature.description}
									</p>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

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
						{categories.map((category, index) => (
							<motion.div
								key={category.name}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.1 }}
								whileHover={{ scale: 1.05 }}
								className="cursor-pointer"
								onClick={() =>
									navigate(`/events?category=${category.name.toLowerCase()}`)
								}>
								<Card className="text-center">
									<div
										className={`mx-auto w-16 h-16 ${category.bgColor} rounded-full flex items-center justify-center mb-6`}>
										<category.icon className={category.color} size={32} />
									</div>
									<h3 className="text-xl font-semibold text-white mb-2">
										{category.name}
									</h3>
									<p className="text-gray-400">{category.description}</p>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Featured Events */}
			<section className="w-full py-20 bg-gradient-to-br from-gray-50 to-blue-50">
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between mb-12">
						<div>
							<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
								Event Terbaru
							</h2>
							<p className="text-xl text-gray-600">
								Kegiatan sosial yang sedang dibuka untuk pendaftaran
							</p>
						</div>
						<Button variant="outline" onClick={() => navigate("/events")}>
							Lihat Semua
							<ArrowRight size={16} className="ml-2" />
						</Button>
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
									transition={{ delay: index * 0.1 }}>
									<EventCard
										event={event}
										onJoin={handleJoinEvent}
										onViewDetail={handleViewEventDetail}
									/>
								</motion.div>
							))}
						</div>
					)}
				</div>
			</section>

			{/* CTA Section */}
			<section className="w-full py-20 bg-gradient-to-r from-blue-600 to-purple-600">
				<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}>
						<h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
							Siap Memulai Perjalanan Volunteer Anda?
						</h2>
						<p className="text-xl text-blue-100 mb-8 leading-relaxed">
							Bergabunglah dengan ribuan volunteer lainnya dan mari bersama-sama
							membuat perubahan positif untuk masyarakat.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								size="lg"
								variant="secondary"
								onClick={() => navigate("/register")}>
								Daftar Sekarang
							</Button>
							<Button
								size="lg"
								variant="secondary"
								className="border-white text-black hover:bg-white hover:text-blue-600"
								onClick={() => navigate("/events")}>
								Jelajahi Event
							</Button>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default LandingPage;
