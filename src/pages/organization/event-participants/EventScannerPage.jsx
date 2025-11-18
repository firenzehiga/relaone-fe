import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, QrCode as QrCodeIcon } from "lucide-react";
import QrScanner from "@/components/organization/QrScanner";
import AttendanceStats from "@/components/organization/AttendanceStats";
import RecentCheckIns from "@/components/organization/RecentCheckIns";
import {
	useOrgParticipants,
	useOrgRecentCheckIns,
	useOrgAttendanceStats,
} from "@/_hooks/useParticipants";
import { formatTime } from "@/utils/dateFormatter";
import Skeleton from "@/components/ui/Skeleton";

/**
 * Halaman Scanner QR untuk check-in volunteer di event
 * Organization scan QR volunteer untuk mencatat kehadiran
 */
export default function EventScannerPage() {
	const { eventId } = useParams();

	// Get attendance statistics dari API
	const {
		data: statsResponse,
		isLoading: isLoadingStats,
		refetch: refetchStats,
	} = useOrgAttendanceStats(eventId);

	// Get recent check-ins dari endpoint
	const {
		data: recentCheckIns = [],
		isLoading: isLoadingRecent,
		refetch: refetchRecent,
	} = useOrgRecentCheckIns(eventId);

	// Get participants untuk event info saja
	const { data: participants = [], isLoading: isLoadingParticipants } =
		useOrgParticipants();

	// Extract stats dari response API
	const stats = statsResponse?.statistics || {
		registered: 0,
		confirmed: 0,
		attended: 0,
		rejected: 0,
		cancelled: 0,
		no_show: 0,
		total: 0,
	};

	// Get event info dari stats response atau fallback ke participants
	const eventInfo = useMemo(() => {
		// Prioritas dari stats API response
		if (statsResponse?.event) {
			return statsResponse.event;
		}
		// Fallback dari participants
		const eventParticipant = participants.find(
			(p) => p.event?.id === parseInt(eventId)
		);
		return eventParticipant?.event || null;
	}, [statsResponse, participants, eventId]);

	const eventStatus = useMemo(() => {
		if (!eventInfo?.tanggal_mulai || !eventInfo?.tanggal_selesai)
			return "unknown";

		const today = new Date();

		const startDate = new Date(
			`${eventInfo.tanggal_mulai}T${eventInfo.waktu_mulai}`
		);

		const endDate = new Date(eventInfo.tanggal_selesai);
		endDate.setHours(23, 59, 59, 999); // artinya sampai akhir hari

		if (startDate > today) return "upcoming";
		if (startDate <= today && endDate >= today) return "ongoing";
		if (endDate < today) return "completed";

		return "unknown";
	}, [eventInfo]);

	// Callback saat scan berhasil - refetch data
	const handleScanSuccess = (data) => {
		// Refetch stats & recent check-ins
		// refetchStats();
		// refetchRecent();
	};

	// Callback saat scan error
	const handleScanError = (error) => {
		console.error("Scan error:", error);
	};

	const isLoading = isLoadingStats || isLoadingRecent || isLoadingParticipants;

	if (isLoading) {
		return <Skeleton.LoadingEventScanner />;
	}
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-4 sm:mb-6">
					<Link
						to="/organization/event-participants"
						className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors text-sm">
						<ArrowLeft className="w-4 h-4" />
						<span className="font-medium">Kembali ke Daftar Participants</span>
					</Link>

					<div
						className={`rounded-lg shadow-sm border p-4 sm:p-6 ${
							eventStatus === "ongoing"
								? "bg-white border-gray-200"
								: eventStatus === "completed"
								? "bg-gray-50 border-gray-300"
								: "bg-yellow-50 border-yellow-200"
						}`}>
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
							<div className="flex items-center gap-3 w-full sm:w-auto">
								<div
									className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
										eventStatus === "ongoing"
											? "bg-gradient-to-br from-blue-500 to-indigo-600"
											: eventStatus === "completed"
											? "bg-gradient-to-br from-gray-400 to-gray-500"
											: "bg-gradient-to-br from-yellow-500 to-orange-500"
									}`}>
									<QrCodeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
								</div>
								<div className="flex-1 min-w-0">
									<h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
										Scanner Check-in Event
									</h1>
									<p
										className={`text-xs sm:text-sm mt-1 truncate ${
											eventStatus === "ongoing"
												? "text-gray-600"
												: eventStatus === "completed"
												? "text-gray-500"
												: "text-yellow-700"
										}`}>
										{eventInfo?.judul}
									</p>
								</div>
							</div>
							<div className="w-full sm:w-auto">
								{eventStatus === "upcoming" && (
									<span className="inline-flex items-center justify-center w-full sm:w-auto px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
										🕐 Belum Mulai
									</span>
								)}
								{eventStatus === "ongoing" && (
									<span className="inline-flex items-center justify-center w-full sm:w-auto px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
										🕒 Sedang Berlangsung
									</span>
								)}
								{eventStatus === "completed" && (
									<span className="inline-flex items-center justify-center w-full sm:w-auto px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-700 border border-green-200">
										✅ Sudah Selesai
									</span>
								)}
							</div>
						</div>

						{/* Warning banner for non-ongoing events */}
						{eventStatus !== "ongoing" && (
							<div
								className={`mt-4 p-3 rounded-lg border text-xs sm:text-sm ${
									eventStatus === "completed"
										? "bg-gray-100 border-gray-300 text-gray-700"
										: "bg-yellow-100 border-yellow-300 text-yellow-800"
								}`}>
								{eventStatus === "completed" ? (
									<>⚠️ Event sudah selesai. Scanner tidak dapat digunakan.</>
								) : (
									<>
										⚠️ Event belum dimulai. Scanner akan aktif saat event
										berlangsung.
									</>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Attendance Statistics */}
				<div className="mb-4 sm:mb-6">
					<AttendanceStats stats={stats} />
				</div>

				{/* Main Content - Scanner & Recent Check-ins */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
					{/* QR Scanner */}
					<div>
						{eventStatus === "ongoing" ? (
							<QrScanner eventId={eventId} />
						) : (
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
								<div className="text-center">
									<QrCodeIcon
										className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${
											eventStatus === "completed"
												? "text-gray-300"
												: "text-yellow-300"
										}`}
									/>
									<h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
										Scanner Tidak Tersedia
									</h3>
									<p className="text-xs sm:text-sm text-gray-500 mb-4">
										{eventStatus === "completed"
											? "Event sudah selesai. Scanner QR tidak dapat digunakan lagi."
											: "Event belum dimulai. Scanner akan aktif saat event berlangsung."}
									</p>
									{eventInfo && (
										<div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
											<p className="font-medium mb-1">Jadwal Event:</p>
											<p className="text-xs sm:text-sm">
												{new Date(eventInfo.tanggal_mulai).toLocaleDateString(
													"id-ID",
													{
														day: "numeric",
														month: "long",
														year: "numeric",
													}
												)}{" "}
												-{" "}
												{new Date(eventInfo.tanggal_selesai).toLocaleDateString(
													"id-ID",
													{
														day: "numeric",
														month: "long",
														year: "numeric",
													}
												)}
											</p>

											<p className="font-medium mt-2 mb-1">Waktu Event:</p>
											<p className="text-xs sm:text-sm">
												{formatTime(eventInfo.waktu_mulai)} -{" "}
												{formatTime(eventInfo.waktu_selesai, "WIB")}
											</p>
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Recent Check-ins List */}
					<div>
						<RecentCheckIns checkIns={recentCheckIns} />
					</div>
				</div>

				{/* Info Box */}
				<div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
					<h3 className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">
						💡 Tips Penggunaan Scanner:
					</h3>
					<ul className="text-xs sm:text-sm text-blue-800 space-y-1 list-disc list-inside">
						<li>Pastikan pencahayaan cukup untuk hasil scan yang optimal</li>
						<li>
							Minta volunteer menunjukkan QR Code dengan jelas di layar HP atau
							print-out
						</li>
						<li>
							Statistik dan daftar check-in akan otomatis refresh secara
							realtime
						</li>
						<li>Volunteer hanya bisa check-in jika status sudah "Confirmed"</li>
						<li>Setiap volunteer hanya bisa check-in satu kali per event</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
