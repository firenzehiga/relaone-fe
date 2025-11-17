import { Calendar, MapPin, Users, Clock, X } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import DynamicButton from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { useEventById } from "@/_hooks/useEvents";
import { useParams, useNavigate } from "react-router-dom";
import { useModalStore } from "@/stores/useAppStore";
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";
import { getImageUrl } from "@/utils";

/**
 * Halaman detail event (full page) yang menggantikan modal.
 */
export default function DetailEventPage() {
	const { eventId } = useParams();
	const navigate = useNavigate();
	const {
		data: event = null,
		isLoading,
		isFetching,
		error,
	} = useEventById(eventId);
	const { openJoinModal } = useModalStore();

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("id-ID", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	const formatTime = (timeString) => {
		if (!timeString) return "00:00";
		return timeString.slice(0, 5);
	};

	const getStatusBadge = (status) => {
		const statusConfig = {
			published: { variant: "success", text: "Terbuka" },
			draft: { variant: "warning", text: "Draft" },
			cancelled: { variant: "danger", text: "Dibatalkan" },
			full: { variant: "secondary", text: "Penuh" },
		};
		return statusConfig[status] || statusConfig.published;
	};

	if (isLoading || (isFetching && String(event?.id) !== String(eventId))) {
		return <Skeleton.Detail />;
	}

	if (error || !event) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div>Event tidak ditemukan.</div>
			</div>
		);
	}

	/**
	 * Handler untuk membuka modal pendaftaran event
	 *
	 * tidak usah pakai event id
	 */
	const handleJoinEvent = () => {
		openJoinModal(event);
	};

	const statusBadge = getStatusBadge(event.status);
	const slotsRemaining = event.maks_peserta - (event.peserta_saat_ini || 0);
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
		<div className="min-h-screen bg-white">
			<div className="max-w-7xl mx-auto p-6">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
					{/* Left: Image */}
					<div className="md:col-span-5">
						<div className="rounded-lg overflow-hidden shadow-lg h-full">
							<AsyncImage
								loading="lazy"
								transition={Fade}
								src={getImageUrl(`events/${event.gambar}`)}
								alt={event.judul}
								className="w-full h-76 md:h-[640px] object-cover"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "https://placehold.co/400";
								}}
							/>
						</div>
					</div>

					{/* Right: Content */}
					<div className="md:col-span-7">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
							<div className="md:col-span-2">
								<Badge variant={statusBadge.variant}>{statusBadge.text}</Badge>
								<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
									{event.judul || event.title}
								</h1>

								<div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
									<span className="flex items-center gap-2">
										<Calendar size={16} />
										{formatDate(event.tanggal_mulai || event.date)}
									</span>
									<span className="flex items-center gap-2">
										<Clock size={16} />
										{formatTime(event.waktu_mulai || event.time)} -{" "}
										{formatTime(event.waktu_selesai || event.end_time)}
									</span>
								</div>
							</div>

							<div className="md:col-span-1 flex flex-col items-end gap-2 self-start">
								<DynamicButton
									variant="ghost"
									size="sm"
									disa
									onClick={() => navigate("/events")}>
									Kembali
								</DynamicButton>
								<DynamicButton
									variant="success"
									onClick={handleJoinEvent}
									disabled={registrationClosed}>
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

						<div className="mt-6 text-gray-700">
							<h3 className="text-lg font-semibold text-gray-900 mb-3">
								Deskripsi Event
							</h3>
							<p className="leading-relaxed">
								{event.deskripsi || event.description}
							</p>
						</div>

						<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
									<MapPin size={18} className="text-purple-600" /> Lokasi
								</h4>
								<div className="text-gray-700">
									<div className="font-medium">
										{event.location?.nama || event.location}
									</div>
									<div className="text-sm text-gray-500">
										{event.location?.alamat || event.address}
									</div>
									{(event.location?.kota || event.city) && (
										<div className="text-sm text-gray-500 mt-1">
											{event.location?.kota || event.city},{" "}
											{event.location?.provinsi || event.province}
										</div>
									)}
								</div>
							</div>

							<div>
								<h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
									<Users size={18} className="text-green-600" /> Peserta
								</h4>
								<div className="text-gray-700">
									<div className="font-medium">
										{event.peserta_saat_ini || 0} /{" "}
										{event.maks_peserta } orang
									</div>
									{slotsRemaining > 0 && (
										<div className="text-sm text-green-600 font-medium">
											{slotsRemaining} slot tersisa
										</div>
									)}
								</div>
							</div>
						</div>

						{(event.persyaratan || event.manfaat) && (
							<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
								{event.persyaratan && (
									<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
										<h4 className="font-semibold text-amber-800 mb-3">
											📋 Persyaratan
										</h4>
										{Array.isArray(event.persyaratan) ? (
											<ul className="space-y-2">
												{event.persyaratan.map((req, i) => (
													<li key={i} className="text-amber-700 text-sm">
														• {req}
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

								{event.manfaat && (
									<div className="bg-green-50 border border-green-200 rounded-lg p-4">
										<h4 className="font-semibold text-green-800 mb-3">
											🎁 Manfaat
										</h4>
										{Array.isArray(event.manfaat) ? (
											<ul className="space-y-2">
												{event.manfaat.map((benefit, i) => (
													<li key={i} className="text-green-700 text-sm">
														• {benefit}
													</li>
												))}
											</ul>
										) : (
											<p className="text-green-700 text-sm">{event.manfaat}</p>
										)}
									</div>
								)}
							</div>
						)}

						{event.organization && (
							<div className="mt-8 border border-gray-200 rounded-lg p-4 flex items-center gap-4">
								<Avatar
									src={getImageUrl(`organizations/${event.organization.logo}`)}
									alt={event.organization.nama}
									size="md"
									fallback={event.organization.nama}
								/>
								<div>
									<div className="font-medium text-gray-900">
										{event.organization.nama}
									</div>
									<div className="text-sm text-gray-500">Event Organizer</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
