import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, QrCode as QrCodeIcon } from "lucide-react";
import QrScanner from "@/components/organization/QrScanner";
import AttendanceStats from "@/components/organization/AttendanceStats";
import RecentCheckIns from "@/components/organization/RecentCheckIns";
import { useOrgParticipants } from "@/_hooks/useParticipants";
import { getRelativeTime } from "@/utils/dateFormatter";

/**
 * Halaman Scanner QR untuk check-in volunteer di event
 * Organization scan QR volunteer untuk mencatat kehadiran
 */
export default function EventScannerPage() {
	const { eventId } = useParams();
	const [refreshKey, setRefreshKey] = useState(0);

	// Get participants data from hook
	const { data: participants = [], isLoading, refetch } = useOrgParticipants();

	// Filter participants untuk event ini dan hitung stats
	const stats = useMemo(() => {
		const eventParticipants = participants.filter(
			(p) => p.event?.id === parseInt(eventId)
		);

		return {
			registered: eventParticipants.filter((p) => p.status === "registered")
				.length,
			confirmed: eventParticipants.filter((p) => p.status === "confirmed")
				.length,
			attended: eventParticipants.filter((p) => p.status === "attended").length,
			rejected: eventParticipants.filter((p) => p.status === "rejected").length,
			cancelled: eventParticipants.filter((p) => p.status === "cancelled")
				.length,
			no_show: eventParticipants.filter((p) => p.status === "no_show").length,
			total: eventParticipants.length,
		};
	}, [participants, eventId]);

	// Recent check-ins (20 terakhir yang attended)
	const recentCheckIns = useMemo(() => {
		return participants
			.filter(
				(p) => p.event?.id === parseInt(eventId) && p.status === "attended"
			)
			.sort((a, b) => {
				const dateA = new Date(a.tanggal_hadir || a.updated_at);
				const dateB = new Date(b.tanggal_hadir || b.updated_at);
				return dateB - dateA;
			})
			.slice(0, 20)
			.map((p) => ({
				id: p.id,
				volunteer: {
					id: p.user?.id,
					nama: p.user?.nama,
					email: p.user?.email,
					foto: p.user?.foto_profil,
				},
				tanggal_hadir: p.tanggal_hadir || p.updated_at,
				waktu_relatif: getRelativeTime(p.tanggal_hadir || p.updated_at),
			}));
	}, [participants, eventId, getRelativeTime]);

	// Callback saat scan berhasil - refetch data
	const handleScanSuccess = (data) => {
		// Refetch participants data untuk update stats & recent
		refetch();
		setRefreshKey((prev) => prev + 1);
	};

	// Callback saat scan error
	const handleScanError = (error) => {
		console.error("Scan error:", error);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6">
					<Link
						to="/organization/event-participants"
						className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
						<ArrowLeft className="w-4 h-4" />
						<span className="text-sm font-medium">
							Kembali ke Daftar Participants
						</span>
					</Link>

					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
								<QrCodeIcon className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									Scanner Check-in Event
								</h1>
								<p className="text-gray-600 text-sm mt-1">
									Scan QR Code volunteer untuk mencatat kehadiran secara
									realtime
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Attendance Statistics */}
				<div className="mb-6">
					<AttendanceStats stats={stats} isLoading={isLoading} />
				</div>

				{/* Main Content - Scanner & Recent Check-ins */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* QR Scanner */}
					<div>
						<QrScanner
							eventId={eventId}
							onScanSuccess={handleScanSuccess}
							onScanError={handleScanError}
						/>
					</div>

					{/* Recent Check-ins List */}
					<div>
						<RecentCheckIns checkIns={recentCheckIns} isLoading={isLoading} />
					</div>
				</div>

				{/* Info Box */}
				<div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
					<h3 className="text-sm font-semibold text-blue-900 mb-2">
						💡 Tips Penggunaan Scanner:
					</h3>
					<ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
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
