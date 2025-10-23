import {
	Calendar,
	MapPin,
	Users,
	Clock,
	Navigation,
	ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/utils/cn";

/**
 * Komponen EventCard untuk menampilkan informasi singkat suatu event volunteer
 * Menampilkan informasi seperti judul, tanggal, lokasi, peserta, dan tombol aksi
 */
export default function EventCard({
	event,
	onJoin,
	className,
	showOrganizer = true,
	showMap = false,
}) {
	if (!event) return null;

	const navigate = useNavigate();

	/**
	 * Memformat string tanggal menjadi format Indonesia yang lebih ringkas
	 *
	 * @param {string} dateString - String tanggal dalam format apapun yang bisa di-parse Date
	 * @returns {string} Tanggal dalam format "DD MMM YYYY"
	 */
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	/**
	 * Memformat string waktu dengan mengambil jam dan menit saja
	 * Menangani case dimana timeString bisa undefined/null
	 *
	 * @param {string} timeString - String waktu dalam format HH:MM:SS atau HH:MM
	 * @returns {string} Waktu dalam format HH:MM
	 */
	const formatTime = (timeString) => {
		if (!timeString) return "00:00";
		return timeString.slice(0, 5);
	};

	/**
	 * Mendapatkan konfigurasi badge berdasarkan status event
	 *
	 * @param {string} status - Status event (published, draft, cancelled, full)
	 * @returns {Object} Object dengan variant dan text untuk badge
	 * @returns {string} returns.variant - Variant warna badge
	 * @returns {string} returns.text - Text yang ditampilkan pada badge
	 */
	const getStatusBadge = (status) => {
		const statusConfig = {
			published: { variant: "success", text: "Terbuka" },
			draft: { variant: "warning", text: "Draft" },
			cancelled: { variant: "danger", text: "Dibatalkan" },
			full: { variant: "secondary", text: "Penuh" },
		};

		return statusConfig[status] || statusConfig.published;
	};

	/**
	 * Mendapatkan warna badge berdasarkan kategori event
	 *
	 * @param {number} categoryId - ID kategori event
	 * @returns {string} Variant warna untuk badge kategori
	 */
	const getCategoryColor = (categoryId) => {
		const colors = {
			1: "success", // Environment
			2: "primary", // Education
			3: "danger", // Health
			4: "secondary", // Social
			5: "warning", // Youth
			6: "primary", // Technology
		};
		return colors[categoryId] || "default";
	};

	/**
	 * Generate URL Google Maps untuk melihat lokasi event
	 * Prioritas menggunakan koordinat lat/lng, jika tidak ada fallback ke alamat
	 *
	 * @returns {string} URL Google Maps untuk melihat lokasi
	 */
	const getGoogleMapsUrl = () => {
		if (event.location?.latitude && event.location?.longitude) {
			return `https://www.google.com/maps/search/?api=1&query=${event.location.latitude},${event.location.longitude}`;
		}
		if (event.latitude && event.longitude) {
			return `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`;
		}
		return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
			event.location?.alamat || event.address
		)}`;
	};

	/**
	 * Generate URL Google Maps untuk mendapatkan petunjuk arah ke lokasi event
	 * Prioritas menggunakan koordinat lat/lng, jika tidak ada fallback ke alamat
	 *
	 * @returns {string} URL Google Maps untuk mendapatkan petunjuk arah
	 */
	const getDirectionsUrl = () => {
		if (event.location?.latitude && event.location?.longitude) {
			return `https://www.google.com/maps/dir/?api=1&destination=${event.location.latitude},${event.location.longitude}`;
		}
		if (event.latitude && event.longitude) {
			return `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`;
		}
		return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
			event.location?.alamat || event.address
		)}`;
	};

	const getStaticMapUrl = () => {
		const lat = event.location?.latitude || event.latitude;
		const lng = event.location?.longitude || event.longitude;

		if (!lat || !lng) return null;

		const zoom = event.map_zoom_level || 15;
		return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=400x200&maptype=roadmap&markers=color:red%7Clabel:E%7C${lat},${lng}&key=YOUR_GOOGLE_MAPS_API_KEY`;
	};

	const statusBadge = getStatusBadge(event.status);
	const slotsRemaining =
		(event.maks_peserta || event.capacity) -
		(event.peserta_saat_ini || event.registered || 0);

	return (
		<motion.div
			whileHover={{ y: -6, scale: 1.02 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className={cn(
				"bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:shadow-emerald-500/10",
				className
			)}>
			{/* Event Banner */}
			<div className="relative h-48 overflow-hidden">
				<Link
					to={`/events/details/${event.id}`}
					aria-label={`Lihat detail event ${event.judul}`}>
					<img
						src={event.gambar || "https://placehold.co/400"}
						alt={event.judul}
						className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = "https://placehold.co/400";
						}}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
					<div className="absolute top-3 left-3">
						<Badge variant={statusBadge.variant}>{statusBadge.text}</Badge>
					</div>
					<div className="absolute top-3 right-3">
						<Badge variant={getCategoryColor(event.category_id)}>
							{event.category?.nama || "undefined"}
						</Badge>
					</div>
				</Link>
			</div>

			{/* Event Content */}
			<div className="p-6">
				<h3 className="font-bold text-gray-900 text-md mb-3 line-clamp-2 leading-tight">
					{event.judul}
				</h3>

				<p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
					{event.deskripsi}
				</p>

				{/* Event Details */}
				<div className="space-y-3 mb-6">
					<div className="flex items-center text-gray-700 text-sm">
						<Calendar
							size={16}
							className="mr-3 text-emerald-600 flex-shrink-0"
						/>
						<span className="font-semibold">
							{formatDate(event.tanggal_mulai)} •{" "}
							{formatTime(event.waktu_mulai)} -{" "}
							{formatTime(event.waktu_selesai)}
						</span>
					</div>

					<div className="flex items-start text-gray-700 text-sm">
						<MapPin
							size={16}
							className="mr-3 text-emerald-600 flex-shrink-0 mt-0.5"
						/>
						<div className="flex-1">
							<div className="font-semibold mb-1">{event.location?.nama}</div>
							<div className="text-gray-500 text-xs line-clamp-2">
								{event.location?.alamat}
							</div>
							{event.location?.kota && event.location?.provinsi && (
								<div className="text-gray-500 text-xs mt-1">
									{event.location?.kota}, {event.location?.provinsi}
								</div>
							)}
							<div className="flex gap-2 mt-2">
								<Button
									variant="outline"
									size="xs"
									onClick={() => window.open(getGoogleMapsUrl(), "_blank")}
									className="flex items-center gap-1 text-xs px-2 py-1">
									<ExternalLink size={12} />
									Lihat di Maps
								</Button>
								<Button
									variant="success"
									size="xs"
									onClick={() => window.open(getDirectionsUrl(), "_blank")}
									className="flex items-center gap-1 text-xs px-2 py-1">
									<Navigation size={12} />
									Petunjuk Arah
								</Button>
							</div>
						</div>
					</div>

					<div className="flex items-center text-gray-700 text-sm">
						<Users size={16} className="mr-3 text-green-600 flex-shrink-0" />
						<span className="font-semibold">
							{event.peserta_saat_ini || 0} / {event.maks_peserta} peserta
						</span>
						{slotsRemaining > 0 && (
							<span className="text-green-700 ml-2 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">
								{slotsRemaining} slot tersisa
							</span>
						)}
					</div>
				</div>

				{/* Location Info & Map Preview */}
				{showMap && event.latitude && event.longitude && (
					<div className="mb-6">
						<div className="bg-gradient-to-br from-emerald-50 to-emerald-50 rounded-lg h-48 flex flex-col items-center justify-center relative overflow-hidden">
							<div className="text-center z-10">
								<div className="bg-white rounded-full p-3 shadow-sm mb-3 inline-flex">
									<MapPin size={28} className="text-emerald-600" />
								</div>
								<h4 className="font-semibold text-gray-900 mb-1">
									{event.location}
								</h4>
								<p className="text-sm text-gray-600 mb-3">
									{event.latitude}, {event.longitude}
								</p>
								<div className="flex gap-2 justify-center">
									<Button
										variant="success"
										size="sm"
										onClick={() => window.open(getGoogleMapsUrl(), "_blank")}
										className="flex items-center gap-1">
										<ExternalLink size={14} />
										Buka di Maps
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => window.open(getDirectionsUrl(), "_blank")}
										className="flex items-center gap-1">
										<Navigation size={14} />
										Petunjuk Arah
									</Button>
								</div>
							</div>

							{/* Background pattern */}
							<div className="absolute inset-0 opacity-10">
								<div className="absolute top-2 left-2 w-2 h-2 bg-emerald-400 rounded-full"></div>
								<div className="absolute top-4 right-6 w-1 h-1 bg-emerald-400 rounded-full"></div>
								<div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
								<div className="absolute bottom-3 right-3 w-2 h-2 bg-emerald-400 rounded-full"></div>
							</div>
						</div>
					</div>
				)}

				{/* Organizer */}
				{showOrganizer && event.organizer && (
					<div className="flex items-center mb-6 pb-4 border-b border-gray-100">
						<Avatar
							src={event.organizer.avatar}
							fallback={event.organizer.name}
							size="sm"
						/>
						<span className="text-gray-700 text-sm ml-3 font-semibold">
							oleh {event.organizer.name}
						</span>
					</div>
				)}

				{/* Tombol Action */}
				<div className="flex gap-3">
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={() => {
							navigate(`/events/details/${event.id}`);
						}}>
						Detail
					</Button>
					<Button
						variant="success"
						size="sm"
						className="flex-1"
						disabled={event.status === "full" || event.status === "cancelled"}
						onClick={() => onJoin?.(event.id)}>
						{event.status === "full" ? "Penuh" : "Daftar"}
					</Button>
				</div>
			</div>
		</motion.div>
	);
}
