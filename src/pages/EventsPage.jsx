import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, MapPin } from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EventCard from "../components/EventCard";
import Skeleton from "../components/ui/Skeleton";
import { useMockData } from "../hooks/useMockData";
import { useModalStore } from "../store";

const EventsPage = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { data: events, loading: eventsLoading } = useMockData("events", 800);
	const { data: categories } = useMockData("categories", 300);
	const { openJoinModal } = useModalStore();

	const [filters, setFilters] = useState({
		search: searchParams.get("search") || "",
		category: searchParams.get("category") || "",
		status: "published",
		date: "",
	});

	const [filteredEvents, setFilteredEvents] = useState([]);
	const [showFilters, setShowFilters] = useState(false);

	// Filter events when data or filters change
	useEffect(() => {
		if (!events) return;

		let filtered = events.filter((event) => event.status === filters.status);

		if (filters.search) {
			filtered = filtered.filter(
				(event) =>
					event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
					event.description
						.toLowerCase()
						.includes(filters.search.toLowerCase()) ||
					event.location.toLowerCase().includes(filters.search.toLowerCase())
			);
		}

		if (filters.category) {
			const category = categories?.find(
				(cat) =>
					cat.name.toLowerCase() === filters.category.toLowerCase() ||
					cat.slug === filters.category.toLowerCase()
			);
			if (category) {
				filtered = filtered.filter(
					(event) => event.category_id === category.id
				);
			}
		}

		if (filters.date) {
			filtered = filtered.filter((event) => event.date === filters.date);
		}

		setFilteredEvents(filtered);
	}, [events, categories, filters]);

	const handleFilterChange = (key, value) => {
		const newFilters = { ...filters, [key]: value };
		setFilters(newFilters);

		// Update URL params
		const newParams = new URLSearchParams();
		Object.entries(newFilters).forEach(([k, v]) => {
			if (v && k !== "status") {
				newParams.set(k, v);
			}
		});
		setSearchParams(newParams);
	};

	const clearFilters = () => {
		setFilters({
			search: "",
			category: "",
			status: "published",
			date: "",
		});
		setSearchParams({});
	};

	const handleJoinEvent = (eventId) => {
		openJoinModal(eventId);
	};

	const handleViewEventDetail = (eventId) => {
		navigate(`/events/${eventId}`);
	};

	const MotionDiv = motion.div;

	return (
		<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
						Event Volunteer 🌟
					</h1>
					<p className="text-xl text-gray-600">
						Temukan berbagai kegiatan sosial yang dapat Anda ikuti
					</p>
				</div>

				{/* Search and Filters */}
				<div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-lg">
					{/* Search Bar */}
					<div className="mb-4">
						<div className="relative">
							<Search
								className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
								size={20}
							/>
							<input
								type="text"
								placeholder="Cari event berdasarkan nama, deskripsi, atau lokasi..."
								value={filters.search}
								onChange={(e) => handleFilterChange("search", e.target.value)}
								className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							/>
						</div>
					</div>

					{/* Filter Toggle */}
					<div className="flex items-center justify-between">
						<Button
							variant="ghost"
							onClick={() => setShowFilters(!showFilters)}
							className="flex items-center text-gray-700">
							<Filter size={16} className="mr-2" />
							Filter {showFilters ? "▲" : "▼"}
						</Button>

						{(filters.category || filters.date) && (
							<Button variant="outline" onClick={clearFilters} size="sm">
								Hapus Filter
							</Button>
						)}
					</div>

					{/* Filters */}
					{showFilters && (
						<MotionDiv
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="mt-4 pt-4 border-t border-gray-200">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{/* Category Filter */}
								<div>
									<label className="block text-gray-900 font-semibold mb-2">
										Kategori
									</label>
									<select
										value={filters.category}
										onChange={(e) =>
											handleFilterChange("category", e.target.value)
										}
										className="w-full px-3 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
										<option value="">Semua Kategori</option>
										{categories?.map((category) => (
											<option key={category.id} value={category.slug}>
												{category.name}
											</option>
										))}
									</select>
								</div>

								{/* Date Filter */}
								<div>
									<label className="block text-gray-900 font-semibold mb-2">
										Tanggal
									</label>
									<input
										type="date"
										value={filters.date}
										onChange={(e) => handleFilterChange("date", e.target.value)}
										className="w-full px-3 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>

								{/* Status Filter */}
								<div>
									<label className="block text-gray-900 font-semibold mb-2">
										Status
									</label>
									<select
										value={filters.status}
										onChange={(e) =>
											handleFilterChange("status", e.target.value)
										}
										className="w-full px-3 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
										<option value="published">Terbuka</option>
										<option value="full">Penuh</option>
										<option value="draft">Draft</option>
										<option value="cancelled">Dibatalkan</option>
									</select>
								</div>
							</div>
						</MotionDiv>
					)}
				</div>

				{/* Active Filters */}
				{(filters.category || filters.search || filters.date) && (
					<div className="flex flex-wrap items-center gap-2 mb-6">
						<span className="text-gray-600 text-sm font-medium">
							Filter aktif:
						</span>
						{filters.search && (
							<Badge variant="primary">Search: "{filters.search}"</Badge>
						)}
						{filters.category && categories && (
							<Badge variant="secondary">
								{categories.find((cat) => cat.slug === filters.category)?.name}
							</Badge>
						)}
						{filters.date && (
							<Badge variant="warning">
								<Calendar size={14} className="mr-1" />
								{new Date(filters.date).toLocaleDateString("id-ID")}
							</Badge>
						)}
					</div>
				)}

				{/* Results Count */}
				<div className="flex items-center justify-between mb-6">
					<p className="text-gray-600 font-medium">
						{eventsLoading
							? "Memuat..."
							: `${filteredEvents.length} event ditemukan`}
					</p>
				</div>

				{/* Events Grid */}
				{eventsLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{Array.from({ length: 6 }).map((_, i) => (
							<Skeleton.EventCard key={i} />
						))}
					</div>
				) : filteredEvents.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredEvents.map((event, index) => (
							<MotionDiv
								key={event.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}>
								<EventCard
									event={{
										...event,
										category: categories?.find(
											(cat) => cat.id === event.category_id
										),
									}}
									onJoin={handleJoinEvent}
									onViewDetail={handleViewEventDetail}
								/>
							</MotionDiv>
						))}
					</div>
				) : (
					<div className="text-center py-16">
						<div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
							<Calendar className="text-gray-400" size={36} />
						</div>
						<h3 className="text-2xl font-bold text-gray-900 mb-3">
							Tidak ada event ditemukan
						</h3>
						<p className="text-gray-600 mb-6 text-lg">
							Coba ubah filter pencarian atau kata kunci Anda
						</p>
						<Button variant="primary" onClick={clearFilters}>
							Hapus Filter
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default EventsPage;
