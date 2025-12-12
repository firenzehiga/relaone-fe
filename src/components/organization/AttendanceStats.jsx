import { Users, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

/**
 * Component untuk menampilkan statistik kehadiran event
 * Menggunakan data dari parent (tidak fetch sendiri)
 */
function AttendanceStats({ stats }) {
	if (!stats) {
		return (
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 text-center">
				<AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mx-auto mb-2" />
				<p className="text-yellow-800 text-sm sm:text-base">Data statistik tidak tersedia</p>
			</div>
		);
	}

	const statCards = [
		{
			label: "Terdaftar",
			value: stats.registered || 0,
			icon: Clock,
			color: "bg-blue-50 border-blue-200 text-blue-600",
			iconBg: "bg-blue-100",
		},
		{
			label: "Dikonfirmasi",
			value: stats.confirmed || 0,
			icon: CheckCircle,
			color: "bg-green-50 border-green-200 text-green-600",
			iconBg: "bg-green-100",
		},
		{
			label: "Hadir",
			value: stats.attended || 0,
			icon: CheckCircle,
			color: "bg-purple-50 border-purple-200 text-purple-600",
			iconBg: "bg-purple-100",
		},
		{
			label: "Tidak Hadir",
			value: stats.no_show || 0,
			icon: XCircle,
			color: "bg-yellow-50 border-yellow-200 text-yellow-600",
			iconBg: "bg-yellow-100",
		},
	];

	// Hitung persentase kehadiran dari yang dikonfirmasi (confirmed)
	// Logika: dari semua yang sudah/pernah dikonfirmasi, berapa persen yang benar-benar hadir
	// Total confirmed = confirmed saat ini + yang sudah attended (karena attended dulunya confirmed)
	const totalConfirmed = (stats.confirmed || 0) + (stats.attended || 0) + (stats.no_show || 0);
	const attendanceRate =
		totalConfirmed > 0 ? Math.round((stats.attended / totalConfirmed) * 100) : 0;

	return (
		<div className="space-y-3 sm:space-y-4">
			{/* Main Stats Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
				{statCards.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<div
							key={index}
							className={`${stat.color} border rounded-lg p-3 sm:p-4 transition-all hover:shadow-md`}>
							<div className="flex items-start justify-between">
								<div>
									<p className="text-xs sm:text-sm font-medium opacity-80 mb-1">{stat.label}</p>
									<p className="text-xl sm:text-3xl font-bold">{stat.value}</p>
								</div>
								<div className={`${stat.iconBg} rounded-lg p-1.5 sm:p-2`}>
									<Icon className="w-4 h-4 sm:w-5 sm:h-5" />
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Additional Info */}
			<div className="bg-white border border-gray-200 rounded-lg p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Users className="w-5 h-5 text-gray-600" />
						<div>
							<p className="text-sm text-gray-600">Total Peserta</p>
							<p className="text-2xl font-bold text-gray-800">{stats.total || 0}</p>
						</div>
					</div>

					<div className="text-right">
						<p className="text-sm text-gray-600 mb-1">Tingkat Kehadiran</p>
						<div className="flex items-center gap-2">
							<div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
									style={{ width: `${attendanceRate}%` }}
								/>
							</div>
							<span className="text-base sm:text-lg font-bold text-green-600">
								{attendanceRate}%
							</span>
						</div>
						<p className="text-xs text-gray-500 mt-1">
							{stats.attended || 0} hadir{" "}
							{totalConfirmed > 0 && `dari ${totalConfirmed} yang dikonfirmasi`}
						</p>
					</div>
				</div>
			</div>

			{/* Rejected & Cancelled Info */}
			{(stats.rejected > 0 || stats.cancelled > 0) && (
				<div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
					{stats.rejected > 0 && (
						<div className="bg-red-50 border border-red-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2">
							<XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
							<span className="text-red-800">
								<span className="font-semibold">{stats.rejected}</span> Ditolak
							</span>
						</div>
					)}
					{stats.cancelled > 0 && (
						<div className="bg-gray-100 border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2">
							<XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
							<span className="text-gray-800">
								<span className="font-semibold">{stats.cancelled}</span> Dibatalkan
							</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default AttendanceStats;
