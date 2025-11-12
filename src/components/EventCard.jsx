import {
	Calendar,
	MapPin,
	Users,
	Navigation,
	ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import DynamicButton from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import {
	cn,
	formatDate,
	formatTime,
	getImageUrl,
	getGoogleMapsUrl,
	getDirectionsUrl,
	getStaticMapUrl,
} from "@/utils";
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";
/**
 * Komponen EventCard untuk menampilkan informasi singkat suatu event volunteer
 * Menampilkan informasi seperti judul, tanggal, lokasi, peserta, dan tombol aksi
 */
export default function EventCard({
	event,
	onJoin,
	className,
	showOrganizer = false,
}) {
	if (!event) return null;

	const navigate = useNavigate();

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

	// Note: category color will now come from `event.category?.warna` (hex)
	// and be passed directly to the `Badge` component as a `color` prop.

	const statusBadge = getStatusBadge(event.status);
	const slotsRemaining =
		(event.maks_peserta || event.capacity) -
		(event.peserta_saat_ini || event.registered || 0);

	// Alur penutupan pendaftaran:
	// - event cancelled  -> closed
	// - no slots remaining -> closed
	// - event date has already arrived (registration closed on or after start date)
	const isCancelled = event.status === "cancelled";
	const isFull = slotsRemaining <= 0;
	const eventStart = event.tanggal_mulai ? new Date(event.tanggal_mulai) : null;
	const now = new Date();
	const isStartedOrPast = eventStart ? now >= eventStart : false;
	const registrationClosed = isCancelled || isFull || isStartedOrPast;

	return (
		<div
			className={cn(
				"bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg transition-transform duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10",
				className
			)}>
			{/* Event Banner */}
			<div className="relative h-48 overflow-hidden">
				<Link
					to={`/events/details/${event.id}`}
					aria-label={`Lihat detail event ${event.judul}`}>
					<AsyncImage
						loading="lazy"
						transition={Fade}
						src={getImageUrl(`events/${event.gambar}`)}
						alt={event.judul}
						className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
					<div className="absolute top-3 left-3">
						<Badge variant={statusBadge.variant}>{statusBadge.text}</Badge>
					</div>
					<div className="absolute top-3 right-3">
						<Badge color={event.category?.warna}>
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

				<p className="text-gray-600 text-sm mb-4 line-clamp-1 leading-relaxed">
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
								<DynamicButton
									variant="outline"
									size="xs"
									onClick={() => window.open(getGoogleMapsUrl(event), "_blank")}
									className="flex items-center gap-1 text-xs px-2 py-1">
									<ExternalLink size={12} />
									Lihat di Maps
								</DynamicButton>
								<DynamicButton
									variant="success"
									size="xs"
									onClick={() => window.open(getDirectionsUrl(event), "_blank")}
									className="flex items-center gap-1 text-xs px-2 py-1">
									<Navigation size={12} />
									Petunjuk Arah
								</DynamicButton>
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
						{isFull && (
							<span className="text-red-600 ml-2 font-bold text-xs bg-red-50 px-2 py-1 rounded-full">
								batas terpenuhi
							</span>
						)}
					</div>
				</div>

				{/* Organizer */}
				{showOrganizer && event.organization && (
					<div className="flex items-center mb-6 pb-4 border-b border-gray-100">
						<Avatar
							src={event.organization.logo}
							fallback={event.organization.nama}
							size="sm"
						/>
						<span className="text-gray-700 text-sm ml-3 font-semibold">
							oleh {event.organization.nama}
						</span>
					</div>
				)}

				{/* Tombol Action */}
				<div className="flex gap-3">
					<DynamicButton
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={() => {
							navigate(`/events/details/${event.id}`);
						}}>
						Detail
					</DynamicButton>
					<DynamicButton
						variant={
							isCancelled || isFull || isStartedOrPast ? "outline" : "success"
						}
						size="sm"
						className="flex-1"
						disabled={registrationClosed}
						onClick={() => onJoin?.(event.id)}>
						{isCancelled
							? "Dibatalkan"
							: isFull
							? "Penuh"
							: isStartedOrPast
							? "Pendaftaran Ditutup"
							: "Daftar"}
					</DynamicButton>
				</div>
			</div>
		</div>
	);
}
