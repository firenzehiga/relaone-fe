import { getImageUrl } from "@/utils";
import { Clock, UserCheck, AlertCircle } from "lucide-react";

/**
 * Component untuk menampilkan daftar volunteer yang baru check-in
 * Menerima data dari parent (tidak fetch sendiri)
 */
function RecentCheckIns({ checkIns = [], isLoading }) {
	if (isLoading) {
		return (
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
					<Clock className="w-5 h-5 text-blue-600" />
					Check-in Terbaru
				</h3>
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
							<div className="w-12 h-12 bg-gray-200 rounded-full" />
							<div className="flex-1 space-y-2">
								<div className="h-4 bg-gray-200 rounded w-3/4" />
								<div className="h-3 bg-gray-200 rounded w-1/2" />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
					<Clock className="w-5 h-5 text-blue-600" />
					Check-in Terbaru
				</h3>
				<span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
					Live
				</span>
			</div>

			{checkIns.length === 0 ? (
				<div className="text-center py-8">
					<UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
					<p className="text-gray-500">Belum ada volunteer yang check-in</p>
					<p className="text-sm text-gray-400 mt-1">
						Daftar akan muncul saat volunteer mulai scan QR
					</p>
				</div>
			) : (
				<div className="space-y-2 max-h-[500px] overflow-y-auto">
					{checkIns.map((item, index) => (
						<div
							key={item.id}
							className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
								index === 0
									? "bg-green-50 border-green-200 animate-pulse"
									: "bg-gray-50 border-gray-200 hover:bg-gray-100"
							}`}>
							<img
								src={
									getImageUrl(`foto_profil/${item.volunteer?.foto}`) ||
									"/default-avatar.png"
								}
								alt={item.volunteer?.nama}
								className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
							/>
							<div className="flex-1 min-w-0">
								<p className="font-medium text-gray-800 truncate">
									{item.volunteer?.nama}
								</p>
								<p className="text-sm text-gray-600 truncate">
									{item.volunteer?.email}
								</p>
								<div className="flex items-center gap-2 mt-1">
									<Clock className="w-3 h-3 text-gray-400" />
									<p className="text-xs text-gray-500">
										{item.waktu_relatif || item.tanggal_hadir}
									</p>
								</div>
							</div>
							{index === 0 && (
								<div className="flex-shrink-0">
									<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
										Baru
									</span>
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{checkIns.length > 0 && (
				<div className="mt-4 pt-4 border-t border-gray-200 text-center">
					<p className="text-xs text-gray-500">
						Menampilkan {checkIns.length} check-in terakhir
					</p>
				</div>
			)}
		</div>
	);
}

export default RecentCheckIns;
