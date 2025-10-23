import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, MapPin, Map } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EventCard from "@/components/EventCard";
import Skeleton from "@/components/ui/Skeleton";
import { useEvents } from "@/_hooks/useEvents";
import { useCategory } from "@/_hooks/useCategories";
import { useModalStore } from "@/stores/useAppStore";

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
		data: events,
		isLoading: eventsLoading,
		error: eventsError,
	} = useEvents();

	const { data: categories, isLoading: categoriesLoading } = useCategory();

	const { openJoinModal } = useModalStore();

	const [filters, setFilters] = useState({
		search: searchParams.get("search") || "",
		category: searchParams.get("category") || "",
		status: "published",
		tanggal_mulai: "",
		city: "",
	});

	const [filteredEvents, setFilteredEvents] = useState([]);
	const [showFilters, setShowFilters] = useState(false);
	const [viewMode, setViewMode] = useState("grid"); // grid, list, map

	/**
	 * Effect untuk melakukan filtering events berdasarkan kriteria yang dipilih
	 * Dijalankan setiap kali data events atau filter berubah
	 */
	useEffect(() => {
		if (!events) return;

		let filtered = events.filter((event) => event.status === filters.status);

		if (filters.search) {
			filtered = filtered.filter(
				(event) =>
					event.judul.toLowerCase().includes(filters.search.toLowerCase()) ||
					event.deskripsi
						.toLowerCase()
						.includes(filters.search.toLowerCase()) ||
					event.location.alamat
						.toLowerCase()
						.includes(filters.search.toLowerCase())
			);
		}

		if (filters.category) {
			const category = categories?.find(
				(cat) =>
					cat.nama.toLowerCase() === filters.category.toLowerCase() ||
					cat.id.toString() === filters.category
			);
			if (category) {
				filtered = filtered.filter(
					(event) => event.category_id === category.id
				);
			}
		}

		if (filters.tanggal_mulai) {
			filtered = filtered.filter(
				(event) => event.tanggal_mulai === filters.tanggal_mulai
			);
		}

		if (filters.city) {
			filtered = filtered.filter((event) =>
				event.location?.kota.toLowerCase().includes(filters.city.toLowerCase())
			);
		}

		setFilteredEvents(filtered);
	}, [events, categories, filters]);

	/**
	 * Handler untuk mengubah filter dan sinkronisasi dengan URL search params
	 *
	 * @param {string} key - Key filter yang akan diubah (search, category, date, city)
	 * @param {string} value - Nilai baru untuk filter
	 */
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

	/**
	 * Menghapus semua filter dan reset ke default state
	 * Juga membersihkan URL search params
	 */
	const clearFilters = () => {
		setFilters({
			search: "",
			category: "",
			status: "published",
			tanggal_mulai: "",
			city: "",
		});
		setSearchParams({});
	};

	/**
	 * Handler untuk membuka modal pendaftaran event
	 * Menggunakan TanStack Query mutation untuk join event
	 *
	 * @param {string|number} eventId - ID event yang akan didaftari
	 */
	const handleJoinEvent = async (eventId) => {
		try {
			// Bisa langsung join atau buka modal tergantung flow yang diinginkan
			openJoinModal(eventId);

			// Alternatif: langsung join tanpa modal
			// await joinEventMutation.mutateAsync({
			//   eventId,
			//   userData: { notes: "Interested to join!" }
			// });
		} catch (error) {
			console.error("Failed to join event:", error);
			// Handle error (bisa tambah toast notification)
		}
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

	// Error state handling
	if (eventsError) {
		return (
			<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center py-12">
						<h2 className="text-2xl font-bold text-red-600 mb-4">
							❌ Gagal Memuat Events
						</h2>
						<p className="text-gray-600 mb-6">
							{eventsError.message ||
								"Terjadi kesalahan saat mengambil data events"}
						</p>
						<Button onClick={() => window.location.reload()} variant="primary">
							Coba Lagi
						</Button>
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
					<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
						Event Volunteer
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

						<div className="flex items-center gap-2">
							{/* View Mode Toggle */}
							<div className="flex bg-gray-100 rounded-lg p-1">
								<Button
									variant={viewMode === "grid" ? "success" : "ghost"}
									size="xs"
									onClick={() => setViewMode("grid")}
									className="px-3 py-1">
									Grid
								</Button>
								<Button
									variant={viewMode === "map" ? "success" : "ghost"}
									size="xs"
									onClick={() => setViewMode("map")}
									className="px-3 py-1">
									<Map size={14} className="mr-1" />
									Peta
								</Button>
							</div>

							{(filters.category || filters.date || filters.city) && (
								<Button variant="outline" onClick={clearFilters} size="sm">
									Hapus Filter
								</Button>
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
						</motion.div>
					)}
				</div>

				{/* Active Filters */}
				{(filters.category || filters.search || filters.tanggal_mulai) && (
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
						{eventsLoading
							? "Memuat..."
							: `${filteredEvents.length} event ditemukan`}
					</p>
				</div>

				{/* Events Display */}
				{eventsLoading ? (
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
										transition={{ delay: index * 0.1 }}>
										<EventCard
											event={{
												...event,
												category: categories?.find(
													(cat) => cat.id === event.category_id
												),
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
													<img
														src={event.gambar || "/api/placeholder/80/80"}
														alt={event.judul}
														className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
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
															<Button
																variant="outline"
																size="xs"
																onClick={() => handleViewEventDetail(event.id)}>
																Detail
															</Button>
															<Button
																variant="primary"
																size="xs"
																onClick={() => handleJoinEvent(event.id)}
																disabled={event.status === "full"}>
																{event.status === "full" ? "Penuh" : "Daftar"}
															</Button>
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
						<Button variant="success" onClick={clearFilters}>
							Hapus Filter
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
