import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, MapPin, Map } from "lucide-react";
import DynamicButton from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EventCard from "@/components/EventCard";
import Skeleton from "@/components/ui/Skeleton";
import { useEvents } from "@/_hooks/useEvents";
import { useCategory } from "@/_hooks/useCategories";
import { useModalStore } from "@/stores/useAppStore";
import { getImageUrl } from "@/utils";
import { toInputDate } from "@/utils/dateFormatter";
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";

/**
 * Halaman Events untuk menampilkan daftar event volunteer
 * Menyediakan fitur search, filter, dan multiple view mode (grid, list, map)
 * Terintegrasi dengan URL search params untuk bookmarking dan sharing
 * Menggunakan TanStack Query + Axios untuk data fetching
 *
 * @returns {JSX.Element} Halaman daftar events dengan filtering dan search
 */
export default function EventsPage() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	// Menggunakan TanStack Query hooks untuk data fetching
	const {
		data: events = [],
		isLoading: eventsLoading,
		error: eventsError,
	} = useEvents();

	const {
		data: categories = [],
		isLoading: categoriesLoading,
		error: categoriesError,
	} = useCategory();

	const { openJoinModal } = useModalStore();

	const [filters, setFilters] = useState({
		search: searchParams.get("search") || "",
		category: searchParams.get("category") || "",
		tanggal_mulai: "",
		city: "",
	});

	const [showFilters, setShowFilters] = useState(false);
	const [viewMode, setViewMode] = useState("grid"); // grid, list, map

	const filteredEvents = useMemo(() => {
		if (!events.length) return [];
		const q = (filters.search || "").toLowerCase().trim();

		let list = events.filter((e) => e.status !== "draft");

		if (q) {
			list = list.filter((e) =>
				(
					(String(e.judul) || "") +
					" " +
					(String(e.deskripsi) || "") +
					" " +
					(String(e.location?.alamat) || "")
				)
					.toLowerCase()
					.includes(q)
			);
		}

		if (filters.category) {
			list = list.filter((e) => e.category_id?.toString() === filters.category);
		}

		if (filters.tanggal_mulai) {
			// Karena format tanggal backend stabil, cukup bandingkan versi YYYY-MM-DD saja.
			list = list.filter((e) => {
				if (!e.tanggal_mulai) return false;
				return toInputDate(e.tanggal_mulai) === filters.tanggal_mulai;
			});
		}

		if (filters.city) {
			const cityQ = filters.city.toLowerCase();
			list = list.filter((e) =>
				(String(e.location?.kota) || "").toLowerCase().includes(cityQ)
			);
		}

		return list;
	}, [
		events,
		categories,
		filters.search,
		filters.category,
		filters.tanggal_mulai,
		filters.city,
	]);

	/**
	 * Handler untuk mengubah filter dan sinkronisasi dengan URL search params
	 *
	 * @param {string} key - Key filter yang akan diubah (search, category, date, city)
	 * @param {string} value - Nilai baru untuk filter
	 */
	const handleFilterChange = (key, value) => {
		const newFilters = { ...filters, [key]: value };
		setFilters(newFilters);

		// Update URL params (only include active filters)
		const newParams = new URLSearchParams();
		Object.entries(newFilters).forEach(([k, v]) => {
			if (v) {
				newParams.set(k, v);
			}
		});
		setSearchParams(newParams);
	};

	/**
	 * Menghapus semua filter dan reset ke default state
	 * Juga membersihkan URL search params
	 */
	const clearFilters = () => {
		setFilters({
			search: "",
			category: "",
			tanggal_mulai: "",
			city: "",
		});
		setSearchParams({});
	};

	// Whether any user-applied filter is active (used to show Clear Filter button and empty-state behavior)
	const hasActiveFilters = Boolean(
		filters.search || filters.category || filters.tanggal_mulai || filters.city
	);

	/**
	 * Handler untuk membuka modal pendaftaran event
	 *
	 * @param {string|number} eventId - ID event yang akan didaftari
	 */
	const handleJoinEvent = (eventId) => {
		// find the event object in the current list and pass it to the modal
		const evt = events.find((e) => String(e.id) === String(eventId)) || null;
		openJoinModal(evt);
	};

	/**
	 * Handler untuk menampilkan detail event di modal
	 *
	 * @param {string|number} eventId - ID event yang akan ditampilkan detailnya
	 */
	const handleViewEventDetail = (eventId) => {
		navigate(`/events/details/${eventId}`);
	};

	// Get unique cities for filter
	const availableCities = [
		...new Set(events?.map((event) => event.location?.kota).filter(Boolean)),
	];

	// Helpers to determine registration availability per event
	const slotsRemainingFor = (event) =>
		(event.maks_peserta || event.capacity) -
		(event.peserta_saat_ini || event.registered || 0);

	const isRegistrationClosedFor = (event) => {
		const slots = slotsRemainingFor(event);
		const start = event.tanggal_mulai ? new Date(event.tanggal_mulai) : null;
		const now = new Date();
		// closed when cancelled, no slots, or the event date has arrived/passed
		return (
			event.status === "cancelled" || slots <= 0 || (start && now >= start)
		);
	};

	const registrationLabelFor = (event) => {
		if (event.status === "cancelled") return "Dibatalkan";
		if (slotsRemainingFor(event) <= 0) return "Penuh";
		const start = event.tanggal_mulai ? new Date(event.tanggal_mulai) : null;
		if (start && new Date() >= start) return "Pendaftaran Ditutup";
		return "Daftar";
	};

	// Error state handling
	if (eventsError || categoriesError) {
		return (
			<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center py-12">
						<h2 className="text-2xl font-bold text-red-600 mb-4">
							❌ Gagal Memuat Events
						</h2>
						<p className="text-gray-600 mb-6">
							{eventsError?.message || categoriesError?.message}
						</p>
						<DynamicButton
							onClick={() => window.location.reload()}
							variant="primary">
							Coba Lagi
						</DynamicButton>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
						Event Relawan
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
						<DynamicButton
							variant="ghost"
							onClick={() => setShowFilters(!showFilters)}
							className="flex items-center text-gray-700">
							<Filter size={16} className="mr-2" />
							Filter {showFilters ? "▲" : "▼"}
						</DynamicButton>

						<div className="flex items-center gap-2">
							{/* View Mode Toggle */}
							<div className="flex bg-gray-100 rounded-lg p-1">
								<DynamicButton
									variant={viewMode === "grid" ? "success" : "ghost"}
									size="xs"
									onClick={() => setViewMode("grid")}
									className="px-3 py-1">
									Grid
								</DynamicButton>
								<DynamicButton
									variant={viewMode === "map" ? "success" : "ghost"}
									size="xs"
									onClick={() => setViewMode("map")}
									className="px-3 py-1">
									<Map size={14} className="mr-1" />
									Peta
								</DynamicButton>
							</div>

							{hasActiveFilters && (
								<DynamicButton
									variant="outline"
									onClick={clearFilters}
									size="sm">
									Hapus Filter
								</DynamicButton>
							)}
						</div>
					</div>

					{/* Filters */}
					{showFilters && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="mt-4 pt-4 border-t border-gray-200">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
											<option key={category.id} value={category.id}>
												{category.nama}
											</option>
										))}
									</select>
								</div>

								{/* City Filter */}
								<div>
									<label className="block text-gray-900 font-semibold mb-2">
										Kota
									</label>
									<select
										value={filters.city}
										onChange={(e) => handleFilterChange("city", e.target.value)}
										className="w-full px-3 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
										<option value="">Semua Kota</option>
										{availableCities?.map((city) => (
											<option key={city} value={city}>
												{city}
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
										value={filters.tanggal_mulai}
										onChange={(e) =>
											handleFilterChange("tanggal_mulai", e.target.value)
										}
										className="w-full px-3 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>

								{/* status filter removed by design - public listing should not expose status filter */}
							</div>
						</motion.div>
					)}
				</div>

				{/* Active Filters */}
				{hasActiveFilters && (
					<div className="flex flex-wrap items-center gap-2 mb-6">
						<span className="text-gray-600 text-sm font-medium">
							Filter aktif:
						</span>
						{filters.search && (
							<Badge variant="primary">Search: "{filters.search}"</Badge>
						)}
						{filters.category && categories && (
							<Badge variant="secondary">
								{
									categories.find(
										(cat) => cat.id.toString() === filters.category
									)?.nama
								}
							</Badge>
						)}
						{filters.city && (
							<Badge variant="info">
								<MapPin size={14} className="mr-1" />
								{filters.city}
							</Badge>
						)}
						{filters.tanggal_mulai && (
							<Badge variant="warning">
								<Calendar size={14} className="mr-1" />
								{new Date(filters.tanggal_mulai).toLocaleDateString("id-ID")}
							</Badge>
						)}
					</div>
				)}

				{/* Results Count */}
				<div className="flex items-center justify-between mb-6">
					<p className="text-gray-600 font-medium">
						{eventsLoading || categoriesLoading
							? "Sedang Memuat..."
							: `${filteredEvents.length} event ditemukan`}
					</p>
				</div>

				{/* Events Display */}
				{eventsLoading || categoriesLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{Array.from({ length: 6 }).map((_, i) => (
							<Skeleton.EventCard key={i} />
						))}
					</div>
				) : filteredEvents.length > 0 ? (
					<>
						{/* Grid View */}
						{viewMode === "grid" && (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredEvents.map((event, index) => (
									<motion.div
										key={event.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0 }}
										transition={{ delay: index * 0.1 }}>
										<EventCard
											event={{
												...event,
											}}
											onJoin={handleJoinEvent}
										/>
									</motion.div>
								))}
							</div>
						)}

						{/* Map View */}
						{viewMode === "map" && (
							<div className="space-y-6">
								{/* Google Maps */}
								<div className="bg-gray-100 rounded-lg overflow-hidden shadow-inner h-96">
									<iframe
										width="100%"
										height="100%"
										style={{ border: 0 }}
										loading="lazy"
										allowFullScreen
										referrerPolicy="no-referrer-when-downgrade"
										src={`https://www.google.com/maps/embed/v1/search?key=YOUR_GOOGLE_MAPS_API_KEY&q=events+jakarta&zoom=12`}
										className="rounded-lg"
									/>
								</div>

								{/* Events List Below Map */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{filteredEvents.map((event, index) => (
										<motion.div
											key={event.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.05 }}>
											<div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
												<div className="flex gap-4">
													<AsyncImage
														loading="lazy"
														transition={Fade}
														src={getImageUrl(`events/${event.gambar}`)}
														alt={event.judul}
														className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
														onError={(e) => {
															e.target.onerror = null;
															e.target.src = "https://placehold.co/400";
														}}
													/>

													<div className="flex-1 min-w-0">
														<h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
															{event.judul}
														</h3>
														<p className="text-sm text-gray-600 line-clamp-2 mb-2">
															{event.deskripsi}
														</p>
														<div className="flex items-center text-xs text-gray-500 mb-2">
															<MapPin size={12} className="mr-1" />
															<span className="line-clamp-1">
																{event.location?.alamat}
															</span>
														</div>
														<div className="flex gap-2">
															<DynamicButton
																variant="outline"
																size="sm"
																onClick={() => handleViewEventDetail(event.id)}>
																Detail
															</DynamicButton>
															<DynamicButton
																variant="success"
																size="sm"
																onClick={() => openJoinModal(event.id, event)}
																disabled={isRegistrationClosedFor(event)}>
																{registrationLabelFor(event)}
															</DynamicButton>
														</div>
													</div>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</div>
						)}
					</>
				) : (
					<div className="text-center py-16">
						<div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-between mb-6">
							<Calendar className="text-gray-400 ml-5" size={36} />
						</div>
						<h3 className="text-2xl font-bold text-gray-900 mb-3">
							Tidak ada event ditemukan
						</h3>
						<p className="text-gray-600 mb-6 text-lg">
							Coba ubah filter pencarian atau kata kunci Anda
						</p>
						<DynamicButton variant="success" onClick={clearFilters}>
							Hapus Filter
						</DynamicButton>
					</div>
				)}
			</div>
		</div>
	);
}
