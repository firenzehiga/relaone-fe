import {
	Calendar,
	MapPin,
	Building2,
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
	Ban,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import DynamicButton from "@/components/ui/Button";
import { getImageUrl, formatDate, formatTime } from "@/utils";
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";

export default function ActivityCard({ data, onClick }) {
	const getStatusBadge = (status) => {
		const badges = {
			registered: {
				label: "Menunggu Konfirmasi",
				variant: "warning",
			},
			confirmed: {
				label: "Dikonfirmasi",
				variant: "info",
			},
			attended: {
				label: "Hadir",
				variant: "success",
			},
			rejected: {
				label: "Ditolak",
				variant: "danger",
			},
			no_show: {
				label: "Tidak Hadir",
				variant: "danger",
			},
			cancelled: {
				label: "Dibatalkan",
				variant: "default",
			},
		};

		return badges[status] || badges.registered;
	};

	const statusBadge = getStatusBadge(data.status);

	return (
		<Card
			className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg transition-transform duration-500 ease-out hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer group"
			onClick={onClick}>
			<div className="flex flex-col md:flex-row gap-0">
				{/* Event Image */}
				<div className="md:w-64 h-48 md:h-auto flex-shrink-0 overflow-hidden relative">
					<AsyncImage
						loading="lazy"
						transition={Fade}
						src={getImageUrl(`events/${data.event?.gambar}`)}
						alt={data.event?.judul || "Event"}
						className="w-full h-full object-cover transition-transform duration-300"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

					{/* Status Badge on Image */}
					<div className="absolute top-3 left-3">
						<Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
					</div>

					{/* Category Badge on Image */}
					{data.event?.category && (
						<div className="absolute top-3 right-3">
							<Badge color={data.event.category.warna}>
								{data.event.category.nama}
							</Badge>
						</div>
					)}
				</div>

				{/* Event Info */}
				<div className="flex-1 min-w-0 p-6">
					<h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-emerald-600 transition">
						{data.event?.judul}
					</h3>

					{data.event?.deskripsi_singkat && (
						<p className="text-gray-600 text-sm mb-4 line-clamp-2">
							{data.event.deskripsi_singkat}
						</p>
					)}

					<div className="space-y-3 mb-4">
						{/* Organization */}
						{data.event?.organization && (
							<div className="flex items-center text-gray-700 text-sm">
								<Building2
									size={16}
									className="mr-3 text-emerald-600 flex-shrink-0"
								/>
								<span className="font-semibold">
									{data.event.organization.nama}
								</span>
								{data.event.organization.rating &&
									parseFloat(data.event.organization.rating) > 0 && (
										<span className="flex items-center gap-1 text-yellow-500 ml-2">
											<span>⭐</span>
											<span className="text-xs">
												{parseFloat(data.event.organization.rating).toFixed(1)}
											</span>
										</span>
									)}
							</div>
						)}

						{/* Location */}
						{data.event?.location && (
							<div className="flex items-center text-gray-700 text-sm">
								<MapPin
									size={16}
									className="mr-3 text-emerald-600 flex-shrink-0"
								/>
								<span>
									{data.event.location.kota}, {data.event.location.provinsi}
								</span>
							</div>
						)}

						{/* Event Date & Time */}
						{data.event?.tanggal_mulai && (
							<div className="flex items-center text-gray-700 text-sm">
								<Calendar
									size={16}
									className="mr-3 text-emerald-600 flex-shrink-0"
								/>
								<div>
									<span className="font-semibold">
										{formatDate(data.event.tanggal_mulai)}
									</span>
									{data.event?.waktu_mulai && (
										<span className="text-gray-600 ml-2">
											• {formatTime(data.event.waktu_mulai)} -{" "}
											{formatTime(data.event.waktu_selesai)}
										</span>
									)}
								</div>
							</div>
						)}

						{/* Registration Date */}
						{data.tanggal_daftar && (
							<div className="flex items-center text-gray-600 text-xs">
								<Clock size={14} className="mr-2 text-gray-400 flex-shrink-0" />
								<span>Terdaftar: {formatDate(data.tanggal_daftar)}</span>
							</div>
						)}

						{/* Confirmation Date */}
						{data.tanggal_konfirmasi && data.status === "confirmed" && (
							<div className="flex items-center text-green-600 text-xs">
								<CheckCircle size={14} className="mr-2 flex-shrink-0" />
								<span>Dikonfirmasi: {formatDate(data.tanggal_konfirmasi)}</span>
							</div>
						)}

						{/* Attendance Date */}
						{data.tanggal_hadir && data.status === "attended" && (
							<div className="flex items-center text-green-600 text-xs">
								<CheckCircle size={14} className="mr-2 flex-shrink-0" />
								<span>Hadir: {formatDate(data.tanggal_hadir)}</span>
							</div>
						)}
					</div>

					{/* Notes */}
					{data.catatan && (
						<div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm mb-4">
							<div className="flex gap-2">
								<AlertCircle
									size={16}
									className="text-amber-600 flex-shrink-0 mt-0.5"
								/>
								<p className="text-amber-800 flex-1 text-xs leading-relaxed">
									{data.catatan}
								</p>
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex gap-3 mt-4">
						<DynamicButton
							variant="success"
							size="sm"
							className="flex-1 sm:flex-none"
							onClick={(e) => {
								e.stopPropagation();
								onClick?.();
							}}>
							Lihat Detail
						</DynamicButton>

						{data.status === "registered" && (
							<DynamicButton
								variant="outline"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									// TODO: Add cancel functionality
									console.log("Cancel registration");
								}}>
								<Ban size={14} className="mr-1" />
								Batalkan
							</DynamicButton>
						)}
					</div>
				</div>
			</div>
		</Card>
	);
}
