import {
	X,
	Calendar,
	MapPin,
	Users,
	Clock,
	Navigation,
	ExternalLink,
	Star,
	MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Modal from "@/components/ui/Modal";
import { cn } from "@/utils/cn";

/**
 * Modal komponen untuk menampilkan detail lengkap sebuah event volunteer
 * Menampilkan informasi event seperti deskripsi, lokasi, peserta, dan tombol aksi
 *
 * @returns {JSX.Element|null} Modal detail event atau null jika event tidak ada
 */
const EventDetailModal = ({ isOpen, onClose, event, onJoin }) => {
	if (!event) return null;

	/**
	 * Memformat string tanggal menjadi format Indonesia yang mudah dibaca
	 *
	 * @param {string} dateString - String tanggal dalam format apapun yang bisa di-parse Date
	 * @returns {string} Tanggal dalam format "Hari, DD Bulan YYYY" (Indonesia)
	 */
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("id-ID", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	/**
	 * Memformat string waktu dengan mengambil jam dan menit saja
	 *
	 * @param {string} timeString - String waktu dalam format HH:MM:SS atau HH:MM
	 * @returns {string} Waktu dalam format HH:MM
	 */
	const formatTime = (timeString) => {
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
	 * Generate URL Google Maps untuk melihat lokasi event
	 * Prioritas menggunakan koordinat lat/lng, jika tidak ada fallback ke alamat
	 *
	 * @returns {string} URL Google Maps untuk melihat lokasi
	 */
	const getGoogleMapsUrl = () => {
		const lat = event.location?.latitude || event.latitude;
		const lng = event.location?.longitude || event.longitude;
		if (lat && lng) {
			return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
		}
		const alamat = event.location?.alamat || event.alamat || "";
		return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
			alamat
		)}`;
	};

	/**
	 * Generate URL Google Maps untuk mendapatkan petunjuk arah ke lokasi event
	 * Prioritas menggunakan koordinat lat/lng, jika tidak ada fallback ke alamat
	 *
	 * @returns {string} URL Google Maps untuk mendapatkan petunjuk arah
	 */
	const getDirectionsUrl = () => {
		const lat = event.location?.latitude || event.latitude;
		const lng = event.location?.longitude || event.longitude;
		if (lat && lng) {
			return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
		}
		const alamat = event.location?.alamat || event.alamat || "";
		return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
			alamat
		)}`;
	};

	const slotsRemaining = event.maks_peserta - event.peserta_saat_ini;
	const statusBadge = getStatusBadge(event.status);

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl">
			<div className="mx-auto">
				{/* Header */}
				<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
					<div className="flex items-center gap-3">
						<Badge variant={statusBadge.variant}>{statusBadge.text}</Badge>
						<h2 className="text-xl font-bold text-gray-900">Detail Event</h2>
					</div>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X size={20} />
					</Button>
				</div>

				{/* Event Banner */}
				<div className="relative h-64 overflow-hidden">
					<img
						src={event.banner}
						alt={event.judul}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
					<div className="absolute bottom-4 left-6 text-white">
						<h1 className="text-2xl font-bold mb-2">{event.judul}</h1>
						<div className="flex items-center gap-4 text-sm">
							<span className="flex items-center gap-1">
								<Calendar size={16} />
								{formatDate(event.tanggal_mulai)}
							</span>
							<span className="flex items-center gap-1">
								<Clock size={16} />
								{formatTime(event.waktu_mulai)} -{" "}
								{formatTime(event.waktu_selesai)}
							</span>
						</div>
					</div>
				</div>

				<div className="p-6">
					{/* Event Info Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-6">
							{/* Description */}
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-3">
									Deskripsi Event
								</h3>
								<p className="text-gray-700 leading-relaxed">
									{event.deskripsi}
								</p>
							</div>

							{/* Requirements */}
							{event.persyaratan && (
								<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
									<h3 className="text-lg font-semibold text-amber-800 mb-3">
										📋 Persyaratan
									</h3>
									{Array.isArray(event.persyaratan) ? (
										<ul className="space-y-2">
											{event.persyaratan.map((req, index) => (
												<li
													key={index}
													className="flex items-start gap-2 text-amber-700">
													<span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
													<span className="text-sm">{req}</span>
												</li>
											))}
										</ul>
									) : (
										<p className="text-amber-700 text-sm">
											{event.persyaratan}
										</p>
									)}
								</div>
							)}

							{/* Benefits */}
							{event.manfaat && (
								<div className="bg-green-50 border border-green-200 rounded-lg p-4">
									<h3 className="text-lg font-semibold text-green-800 mb-3">
										🎁 Manfaat
									</h3>
									{Array.isArray(event.manfaat) ? (
										<ul className="space-y-2">
											{event.manfaat.map((benefit, index) => (
												<li
													key={index}
													className="flex items-start gap-2 text-green-700">
													<span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
													<span className="text-sm">{benefit}</span>
												</li>
											))}
										</ul>
									) : (
										<p className="text-green-700 text-sm">{event.manfaat}</p>
									)}
								</div>
							)}
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Organizer Info */}
							{event.organizer && (
								<div className="bg-gray-50 rounded-lg p-4">
									<h3 className="text-sm font-semibold text-gray-900 mb-3">
										Penyelenggara
									</h3>
									<div className="flex items-center gap-3">
										<Avatar
											src={event.organizer.avatar}
											fallback={event.organizer.name}
											size="md"
										/>
										<div>
											<div className="font-semibold text-gray-900">
												{event.organizer.name}
											</div>
											<div className="text-sm text-gray-600">
												Event Organizer
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Participants Info */}
							<div className="bg-blue-50 rounded-lg p-4">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm font-semibold text-gray-900">
										Peserta
									</span>
									<Users size={16} className="text-blue-600" />
								</div>
								<div className="text-2xl font-bold text-blue-600 mb-1">
									{event.peserta_saat_ini} / {event.maks_peserta}
								</div>
								<div className="text-sm text-gray-600">
									{slotsRemaining > 0
										? `${slotsRemaining} slot tersisa`
										: "Event penuh"}
								</div>
								<div className="mt-3 bg-blue-200 rounded-full h-2 overflow-hidden">
									<div
										className="bg-blue-600 h-full transition-all duration-300"
										style={{
											width: `${
												(event.peserta_saat_ini / event.maks_peserta) * 100
											}%`,
										}}></div>
								</div>
							</div>

							{/* Location Info */}
							<div className="bg-purple-50 rounded-lg p-4">
								<div className="flex items-center justify-between mb-3">
									<span className="text-sm font-semibold text-gray-900">
										Lokasi
									</span>
									<MapPin size={16} className="text-purple-600" />
								</div>
								<div className="space-y-2">
									<div className="font-semibold text-gray-900">
										{event.location?.nama ||
											event.nama_lokasi ||
											"Lokasi Belum Ditentukan"}
									</div>
									<div className="text-sm text-gray-600">
										{event.location?.alamat ||
											event.alamat ||
											"Alamat belum diatur"}
									</div>
									<div className="flex gap-2 mt-3">
										<Button
											variant="outline"
											size="sm"
											onClick={() => window.open(getGoogleMapsUrl(), "_blank")}
											className="flex-1 flex items-center justify-center gap-1 text-xs">
											<ExternalLink size={12} />
											Lihat
										</Button>
										<Button
											variant="primary"
											size="sm"
											onClick={() => window.open(getDirectionsUrl(), "_blank")}
											className="flex-1 flex items-center justify-center gap-1 text-xs">
											<Navigation size={12} />
											Rute
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* Location Map */}
					{(event.location?.latitude || event.latitude) &&
						(event.location?.longitude || event.longitude) && (
							<div className="mb-8">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									📍 Peta Lokasi
								</h3>
								<div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg h-80 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
									<div className="text-center z-10">
										<div className="bg-white rounded-full p-4 shadow-lg mb-4 inline-flex">
											<MapPin size={36} className="text-blue-600" />
										</div>
										<h4 className="text-xl font-semibold text-gray-900 mb-2">
											{event.location?.nama ||
												event.nama_lokasi ||
												"Lokasi Event"}
										</h4>
										<p className="text-gray-600 mb-1">
											{event.location?.alamat ||
												event.alamat ||
												"Alamat belum diatur"}
										</p>
										<p className="text-sm text-gray-500 mb-4">
											{event.location?.latitude || event.latitude},{" "}
											{event.location?.longitude || event.longitude}
										</p>
										<div className="flex gap-3 justify-center">
											<Button
												variant="primary"
												onClick={() =>
													window.open(getGoogleMapsUrl(), "_blank")
												}
												className="flex items-center gap-2">
												<ExternalLink size={16} />
												Buka di Google Maps
											</Button>
											<Button
												variant="outline"
												onClick={() =>
													window.open(getDirectionsUrl(), "_blank")
												}
												className="flex items-center gap-2">
												<Navigation size={16} />
												Petunjuk Arah
											</Button>
										</div>
									</div>

									{/* Background pattern */}
									<div className="absolute inset-0 opacity-10">
										<div className="absolute top-4 left-4 w-3 h-3 bg-blue-400 rounded-full"></div>
										<div className="absolute top-8 right-12 w-2 h-2 bg-purple-400 rounded-full"></div>
										<div className="absolute bottom-12 left-16 w-2.5 h-2.5 bg-blue-400 rounded-full"></div>
										<div className="absolute bottom-6 right-6 w-3 h-3 bg-purple-400 rounded-full"></div>
										<div className="absolute top-1/2 left-8 w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
										<div className="absolute top-1/3 right-8 w-1.5 h-1.5 bg-purple-300 rounded-full"></div>
									</div>
								</div>
							</div>
						)}{" "}
					{/* Action Buttons */}
					<div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 flex gap-3">
						<Button variant="outline" onClick={onClose} className="flex-1">
							Tutup
						</Button>
						<Button
							variant="primary"
							onClick={() => onJoin?.(event.id)}
							disabled={event.status === "full" || event.status === "cancelled"}
							className="flex-1">
							{event.status === "full"
								? "Event Penuh"
								: event.status === "cancelled"
								? "Event Dibatalkan"
								: "Daftar Sekarang"}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default EventDetailModal;
