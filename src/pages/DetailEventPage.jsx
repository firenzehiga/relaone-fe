import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Calendar, MapPin, Users, Clock, CalendarX, Gift, NotepadText } from "lucide-react";
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";

import { useEventById } from "@/_hooks/useEvents";
import { useModalStore } from "@/stores/useAppStore";
import { useDocumentTitle } from "@/_hooks/useDocumentTitle";

import { getImageUrl } from "@/utils";
import { formatTime, formatDate } from "@/utils/dateFormatter";

import DynamicButton from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
/**
 * Halaman detail event (full page) yang menggantikan modal.
 */
export default function DetailEventPage() {
	useDocumentTitle("Detail Event Page");

	const { eventId } = useParams();
	const navigate = useNavigate();
	const { data: event = null, isLoading, isFetching, error } = useEventById(eventId);

	useEffect(() => {
		if (!isLoading && event) {
			import('@/utils/perfRoute').then((m) => m.endRouteTimer('detail-event-page', '(DETAIL EVENT)'));
		}
	}, [isLoading, event]);
	const { openJoinModal } = useModalStore();

	const formatDateRange = (startDateStr, endDateStr) => {
		if (!startDateStr || !endDateStr) return "-";
		if (startDateStr === endDateStr) return formatDate(startDateStr);
		return `${formatDate(startDateStr)} - ${formatDate(endDateStr)}`;
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

	const isCancelled = event.status === "cancelled";
	const isFull = slotsRemaining <= 0;
	const eventStart = new Date(event.tanggal_mulai);
	const eventEnd = new Date(`${event.tanggal_selesai}T${event.waktu_selesai}`); // gabungan tanggal & waktu mulai contoh Tue Nov 18 2025 20:28:00 GMT+0700 (Western Indonesia Time)event.tanggal_selesai);
	const registrationEnd = new Date(event.batas_pendaftaran);
	registrationEnd.setHours(23, 59, 59, 999); // set ke akhir hari batas pendaftaran

	const now = new Date();
	const isRegistrationClosed = now >= registrationEnd;
	const isStarted = now >= eventStart || event.status === "ongoing";
	const isFinished = now >= eventEnd || event.status === "completed";

	const isRegistrationEnded = isCancelled || isFull || isStarted || isRegistrationClosed;

	// Alur penutupan tombol pendaftaran:
	// - event cancelled  -> ditutup
	// - event full       -> ditutup
	// - event started    -> ditutup
	// - event registration closed -> ditutup
	//
	let actionLabel = "Daftar";
	if (isCancelled) actionLabel = "Dibatalkan";
	else if (isFull) actionLabel = "Penuh";
	else if (isFinished) actionLabel = "Sudah Selesai";
	else if (isStarted) actionLabel = "Sudah Dimulai";
	else if (isRegistrationClosed) actionLabel = "Pendaftaran Ditutup";
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
								className="w-full h-72 md:h-[640px] object-cover"
							/>
						</div>
					</div>

					{/* Right: Content */}
					<div className="md:col-span-7">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
							<div className="lg:col-span-2">
								<Badge variant={statusBadge.variant}>{statusBadge.text}</Badge>
								<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{event.judul}</h1>

								<div className="mt-4 grid grid-cols-1 sm:grid-cols-1 gap-3">
									{/* Tanggal Pelaksanaan */}
									<div className="flex items-start gap-3">
										<Calendar size={18} className="text-emerald-600 mt-1" />
										<div>
											<div className="text-gray-600 font-medium text-sm">Tanggal Pelaksanaan</div>
											<div className="text-gray-600 text-sm">
												{formatDateRange(event.tanggal_mulai, event.tanggal_selesai)}
											</div>
										</div>
									</div>

									{/* Waktu Pelaksanaan */}
									<div className="flex items-start gap-3 sm:col-span-2">
										<Clock size={18} className="text-blue-600 mt-1" />
										<div>
											<div className="text-gray-600 font-medium text-sm">Waktu Pelaksanaan</div>
											<div className="text-gray-600 text-sm">
												{formatTime(event.waktu_mulai)} - {formatTime(event.waktu_selesai, "WIB")}
											</div>
										</div>
									</div>

									{/* Batas Pendaftaran */}
									<div className="flex items-start gap-3 sm:col-span-2">
										<CalendarX size={18} className="text-red-600 mt-1" />
										<div>
											<div className="text-gray-600 font-medium text-sm">Batas pendaftaran</div>
											<div className="text-gray-600 text-sm">
												{formatDate(event.batas_pendaftaran)}
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="md:col-span-1 flex flex-row md:flex-col items-center md:items-end gap-2 self-start">
								<DynamicButton
									variant="outline"
									size="sm"
									className="w-full md:w-auto"
									onClick={() => navigate("/events")}>
									Kembali
								</DynamicButton>
								<DynamicButton
									variant="success"
									onClick={handleJoinEvent}
									disabled={isRegistrationEnded}
									className="w-full md:w-auto">
									{actionLabel}
								</DynamicButton>
							</div>
						</div>

						<div className="mt-6 text-gray-700">
							<h3 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi Event</h3>
							<p className="leading-relaxed">{event.deskripsi}</p>
						</div>

						<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
									<MapPin size={18} className="text-purple-600" /> Lokasi
								</h4>
								<div className="text-gray-700">
									<div className="font-medium">{event.location?.nama}</div>
									<div className="text-sm text-gray-500">{event.location?.alamat}</div>
									{event.location?.kota && (
										<div className="text-sm text-gray-500 mt-1">
											{event.location?.kota}, {event.location?.provinsi}
										</div>
									)}
								</div>
							</div>

							<div>
								<h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
									<Users size={18} className="text-orange-600" /> Peserta
								</h4>
								<div className="text-gray-700">
									<div className="font-medium">
										{event.peserta_saat_ini || 0} / {event.maks_peserta} orang
									</div>
									{slotsRemaining > 0 && (
										<div className="text-sm text-green-600 font-medium">
											{slotsRemaining} slot tersisa
										</div>
									)}
								</div>
							</div>
						</div>

						{(event.persyaratan.length > 0 || event.manfaat.length > 0) && (
							<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
								{event.persyaratan && (
									<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
										<h4 className="font-semibold text-amber-800 mb-3 flex items-center">
											<NotepadText className="w-5 h-5 mr-2" /> Persyaratan
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
											<p className="text-amber-700 text-sm">{event.persyaratan}</p>
										)}
									</div>
								)}

								{event.manfaat && (
									<div className="bg-green-50 border border-green-200 rounded-lg p-4">
										<h4 className="font-semibold text-green-800 mb-3 flex items-center">
											<Gift className="w-5 h-5 mr-2" /> Manfaat
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
									<div className="font-medium text-gray-900">{event.organization.nama}</div>
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
