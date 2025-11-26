import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// UI Libraries
import { motion } from "framer-motion";
import { Search, Filter, Calendar, MapPin } from "lucide-react";

// Hooks / stores
import { useEvents } from "@/_hooks/useEvents";
import { useCategory } from "@/_hooks/useCategories";
import { useModalStore } from "@/stores/useAppStore";

// Helpers
import { toInputDate } from "@/utils/dateFormatter";

// UI Components
import DynamicButton from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import EventCard from "@/components/EventCard";
import Badge from "@/components/ui/Badge";

/**
 * Halaman Events untuk menampilkan daftar event volunteer
 * Menyediakan fitur search, filter, dan multiple view mode (grid, list, map)
 * Terintegrasi dengan URL search params untuk bookmarking dan sharing
 * @returns {JSX.Element} Halaman daftar events dengan filtering dan search
 */
export default function EventsPage() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

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

	// Apakah ada filter yang yg lagi aktif (digunakan untuk menampilkan tombol Hapus Filter dan perilaku empty-state)
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

	// Dapetin list kota unik dari semua events untuk opsi filter kota
	const availableCities = [
		...new Set(events?.map((event) => event.location?.kota).filter(Boolean)),
	];


	// Error state handling
	if (eventsError || categoriesError) {
		return (
			<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center py-12">
						<h2 className="text-2xl font-bold text-red-600 mb-4">
							Gagal Memuat Events
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

	if (eventsLoading || categoriesLoading) {
		return <Skeleton.EventsSkeleton />;
	}

	return (
		<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-4xl lg:text-5xl font-bold text-emerald-600 mb-4">
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
						{`${filteredEvents.length} event ditemukan`}
					</p>
				</div>

				{/* Events Display */}
				{filteredEvents.length > 0 ? (
					<>
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
