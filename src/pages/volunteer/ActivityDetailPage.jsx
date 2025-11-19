import { useParams, useNavigate } from "react-router-dom";

// UI Libraries
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";
import { motion } from "framer-motion";
import {
	ArrowLeft,
	Calendar,
	MapPin,
	Building2,
	Clock,
	User,
	Mail,
	Phone,
	CheckCircle,
	XCircle,
	AlertCircle,
	Navigation,
	Ban,
	Flame,
} from "lucide-react";

// Hooks / stores
import { userVolunteerHistoryById } from "@/_hooks/useParticipants";
import { useModalStore } from "@/stores/useAppStore";

// Helpers
import { getImageUrl } from "@/utils";
import { formatDate, formatTime } from "@/utils/dateFormatter";

// UI Components
import QrCodeDisplay from "@/components/volunteer/QrCodeDisplay";
import DynamicButton from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function ActivityDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data, isLoading, error } = userVolunteerHistoryById(id);

	if (isLoading) {
		return <Skeleton.ActivityDetailSkeleton />;
	}

	if (error || !data) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex justify-center items-center">
				<div className="text-center">
					<div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
						<AlertCircle className="text-red-600" size={48} />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-3">Aktivitas Tidak Ditemukan</h2>
					<p className="text-gray-600 text-lg mb-6">
						Maaf, aktivitas yang Anda cari tidak dapat ditemukan
					</p>
					<DynamicButton variant="success" to="/volunteer/my-activities">
						<ArrowLeft size={18} className="mr-2" />
						Kembali ke Aktivitas
					</DynamicButton>
				</div>
			</div>
		);
	}

	const getStatusConfig = (status) => {
		const configs = {
			registered: {
				label: "Menunggu Konfirmasi",
				variant: "warning",
				icon: "⏳",
				description: "Pendaftaran Anda sedang diproses oleh organizer",
			},
			confirmed: {
				label: "Dikonfirmasi",
				variant: "info",
				icon: "✓",
				description: "Pendaftaran Anda telah dikonfirmasi. Siap-siap ikut event!",
			},
			attended: {
				label: "Hadir",
				variant: "success",
				icon: "✅",
				description: "Anda telah hadir di event ini",
			},
			rejected: {
				label: "Ditolak",
				variant: "danger",
				icon: "❌",
				description: "Pendaftaran Anda ditolak oleh organizer",
			},
			no_show: {
				label: "Tidak Hadir",
				variant: "danger",
				icon: "⚠️",
				description: "Anda tidak hadir meskipun sudah dikonfirmasi",
			},
			cancelled: {
				label: "Dibatalkan",
				variant: "default",
				icon: "🚫",
				description: "Pendaftaran telah dibatalkan",
			},
		};
		return configs[status] || configs.registered;
	};

	const getTimelineConfig = (timeline) => {
		const configs = {
			upcoming: {
				label: "Akan Datang",
				Icon: Calendar,
				color: "text-blue-600",
				bg: "bg-blue-100",
			},
			ongoing: {
				label: "Sedang Berlangsung",
				Icon: Flame,
				color: "text-orange-600",
				bg: "bg-orange-100",
			},
			finished: {
				label: "Selesai",
				Icon: CheckCircle,
				color: "text-blue-600",
				bg: "bg-blue-100",
			},
		};
		return configs[timeline] || configs.upcoming;
	};

	const getStatusIcon = (status) => {
		const icons = {
			registered: Clock,
			confirmed: CheckCircle,
			attended: CheckCircle,
			rejected: XCircle,
			no_show: AlertCircle,
			cancelled: Ban,
		};
		return icons[status] || Clock;
	};

	const statusConfig = getStatusConfig(data.status);
	const timelineConfig = getTimelineConfig(data.timeline_status);
	const StatusIcon = getStatusIcon(data.status);

	return (
		<div className="page-transition min-h-screen py-8 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<DynamicButton
							variant="ghost"
							size="sm"
							onClick={() => navigate("/volunteer/my-activities")}
							className="p-2">
							<ArrowLeft size={20} />
						</DynamicButton>
						<h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
							Detail Aktivitas
						</h1>
					</div>
					<p className="text-lg text-gray-600 ml-12">Informasi lengkap partisipasi event Anda</p>
				</div>
				{/* Status Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					{/* Participation Status */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.1 }}>
						<Card className="p-6 bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
							<div className="flex items-center gap-4 mb-3">
								<div className={`p-3 rounded-xl ${timelineConfig.bg}`}>
									<StatusIcon
										size={28}
										className={
											statusConfig.variant === "success"
												? "text-green-600"
												: statusConfig.variant === "danger"
												? "text-red-600"
												: statusConfig.variant === "warning"
												? "text-amber-600"
												: "text-blue-600"
										}
									/>
								</div>
								<div className="flex-1">
									<p className="text-sm text-gray-600 mb-2 font-medium">Status Partisipasi</p>
									<Badge variant={statusConfig.variant} className="text-sm">
										{statusConfig.label}
									</Badge>
								</div>
							</div>
							<p className="text-sm text-gray-600 leading-relaxed">{statusConfig.description}</p>
						</Card>
					</motion.div>

					{/* Event Timeline */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}>
						<Card className="p-6 bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
							<div className="flex items-center gap-4 mb-3">
								<div className={`p-3 rounded-xl ${timelineConfig.bg}`}>
									<timelineConfig.Icon size={28} className={timelineConfig.color} />
								</div>
								<div className="flex-1">
									<p className="text-sm text-gray-600 mb-2 font-medium">Status Event</p>
									<span
										className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${timelineConfig.bg} ${timelineConfig.color}`}>
										{timelineConfig.label}
									</span>
								</div>
							</div>
							<p className="text-sm text-gray-600 leading-relaxed">
								{data.timeline_status === "upcoming" && "Event belum dimulai"}
								{data.timeline_status === "ongoing" && "Event sedang berlangsung"}
								{data.timeline_status === "finished" && "Event telah selesai"}
							</p>
						</Card>
					</motion.div>
				</div>

				{/* Event Banner */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}>
					<Card className="mb-8 overflow-hidden p-0 shadow-lg">
						<div className="relative h-64 md:h-96 overflow-hidden">
							<AsyncImage
								loading="lazy"
								transition={Fade}
								src={getImageUrl(`events/${data.event?.gambar}`)}
								alt={data.event?.judul || "Event"}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

							{/* Overlay Info */}
							<div className="absolute bottom-0 left-0 right-0 p-6 text-white">
								<div className="flex items-center gap-2 mb-2">
									{data.event?.category && (
										<Badge color={data.event.category.warna}>{data.event.category.nama}</Badge>
									)}
									<Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
								</div>
							</div>
						</div>
					</Card>
				</motion.div>

				{/* Event Info */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}>
					<Card className="mb-8 p-8 bg-white border border-gray-200 shadow-lg">
						<div className="mb-6">
							<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
								{data.event?.judul}
							</h2>
						</div>

						{data.event?.deskripsi && (
							<div className="mb-8">
								<h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
									<div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
									Deskripsi Event
								</h3>
								<p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
									{data.event.deskripsi}
								</p>
							</div>
						)}

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Organization Info */}
							{data.event?.organization && (
								<div>
									<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
										<Building2 size={20} className="text-emerald-600" />
										Organizer
									</h3>
									<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
										{data.event.organization.logo ? (
											<AsyncImage
												loading="lazy"
												transition={Fade}
												src={getImageUrl(`organizations/${data.event.organization.logo}`)}
												alt={data.event.organization.nama}
												className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
											/>
										) : (
											<div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
												<Building2 size={28} className="text-emerald-600" />
											</div>
										)}
										<div className="flex-1">
											<p className="font-bold text-gray-900 text-base">
												{data.event.organization.nama}
											</p>
											{data.event.organization.rating &&
												parseFloat(data.event.organization.rating) > 0 && (
													<div className="flex items-center gap-1 text-yellow-500 mt-1">
														<span>⭐</span>
														<span className="text-sm font-semibold">
															{parseFloat(data.event.organization.rating).toFixed(1)}
														</span>
													</div>
												)}
										</div>
									</div>
								</div>
							)}

							{/* Location Info */}
							{data.event?.location && (
								<div>
									<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
										<MapPin size={20} className="text-emerald-600" />
										Lokasi
									</h3>
									<div className="p-4 bg-gray-50 rounded-xl">
										<p className="font-bold text-gray-900 mb-2 text-base">
											{data.event.location.nama}
										</p>
										<p className="text-sm text-gray-600 mb-1">{data.event.location.alamat}</p>
										<p className="text-sm text-gray-600">
											{data.event.location.kota}, {data.event.location.provinsi}
										</p>
									</div>
								</div>
							)}

							{/* Date Info */}
							<div>
								<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
									<Calendar size={20} className="text-emerald-600" />
									Waktu Event
								</h3>
								<div className="space-y-3">
									<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
										<Clock size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
										<div>
											<p className="font-semibold text-gray-900 text-sm">Tanggal Mulai</p>
											<p className="text-gray-700">{formatDate(data.event?.tanggal_mulai)}</p>
											{data.event?.waktu_mulai && (
												<p className="text-sm text-gray-600">
													{formatTime(data.event.waktu_mulai)} WIB
												</p>
											)}
										</div>
									</div>
									<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
										<Clock size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
										<div>
											<p className="font-semibold text-gray-900 text-sm">Tanggal Selesai</p>
											<p className="text-gray-700">{formatDate(data.event?.tanggal_selesai)}</p>
											{data.event?.waktu_selesai && (
												<p className="text-sm text-gray-600">
													{formatTime(data.event.waktu_selesai)} WIB
												</p>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* Contact Info */}
							{data.event?.creator && (
								<div>
									<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
										<User size={20} className="text-emerald-600" />
										Kontak Person
									</h3>
									<div className="space-y-2">
										<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
											<User size={16} className="text-gray-500 flex-shrink-0" />
											<div>
												<p className="text-sm text-gray-600">Nama</p>
												<p className="font-semibold text-gray-900">{data.event.creator.nama}</p>
											</div>
										</div>
										<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
											<Mail size={16} className="text-gray-500 flex-shrink-0" />
											<div>
												<p className="text-sm text-gray-600">Email</p>
												<p className="font-semibold text-gray-900 text-sm">
													{data.event.creator.email}
												</p>
											</div>
										</div>
										{data.event?.telepon_kontak && (
											<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
												<Phone size={16} className="text-gray-500 flex-shrink-0" />
												<div>
													<p className="text-sm text-gray-600">Telepon</p>
													<p className="font-semibold text-gray-900">{data.event.telepon_kontak}</p>
												</div>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					</Card>
				</motion.div>

				{/* Participation Timeline */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}>
					<Card className="mb-8 p-8 bg-white border border-gray-200 shadow-lg">
						<h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
							<div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
							Timeline Partisipasi
						</h3>
						<div className="space-y-6">
							{/* Registration */}
							{data.tanggal_daftar && (
								<div className="flex gap-4">
									<div className="flex flex-col items-center">
										<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
											<Clock size={24} className="text-blue-600" />
										</div>
										{(data.tanggal_konfirmasi || data.tanggal_hadir) && (
											<div className="flex-1 w-1 bg-gradient-to-b from-blue-300 to-green-300 mt-2"></div>
										)}
									</div>
									<div className="flex-1 pb-6">
										<p className="font-bold text-gray-900 text-base mb-1">Pendaftaran</p>
										<p className="text-sm text-emerald-600 font-semibold mb-2">
											{formatDate(data.tanggal_daftar)}
										</p>
										<p className="text-sm text-gray-600 leading-relaxed">
											Anda mendaftar untuk event ini
										</p>
									</div>
								</div>
							)}

							{/* Confirmation */}
							{data.tanggal_konfirmasi && (
								<div className="flex gap-4">
									<div className="flex flex-col items-center">
										<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
											<CheckCircle size={24} className="text-green-600" />
										</div>
										{data.tanggal_hadir && (
											<div className="flex-1 w-1 bg-gradient-to-b from-green-300 to-green-500 mt-2"></div>
										)}
									</div>
									<div className="flex-1 pb-6">
										<p className="font-bold text-gray-900 text-base mb-1">Dikonfirmasi</p>
										<p className="text-sm text-emerald-600 font-semibold mb-2">
											{formatDate(data.tanggal_konfirmasi)}
										</p>
										<p className="text-sm text-gray-600 leading-relaxed">
											Pendaftaran Anda dikonfirmasi oleh organizer
										</p>
									</div>
								</div>
							)}

							{/* Attendance */}
							{data.tanggal_hadir && (
								<div className="flex gap-4">
									<div className="flex flex-col items-center">
										<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
											<CheckCircle size={24} className="text-green-600" />
										</div>
									</div>
									<div className="flex-1">
										<p className="font-bold text-gray-900 text-base mb-1">Hadir</p>
										<p className="text-sm text-emerald-600 font-semibold mb-2">
											{formatDate(data.tanggal_hadir)}
										</p>
										<p className="text-sm text-gray-600 leading-relaxed">
											Anda telah check-in di event ini
										</p>
									</div>
								</div>
							)}
						</div>
					</Card>
				</motion.div>

				{/* QR Code - Tampil jika sudah dikonfirmasi */}
				{data.status === "confirmed" && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}>
						<Card className="mb-8 p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-lg">
							<h3 className="text-xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
								<CheckCircle size={24} className="text-emerald-600" />
								QR Code Kehadiran
							</h3>
							<QrCodeDisplay participationId={data.id} eventData={data.event} />
							<p className="text-sm text-gray-700 text-center mt-6 font-medium">
								Tunjukkan QR code ini kepada organizer untuk check-in
							</p>
						</Card>
					</motion.div>
				)}

				{/* Notes */}
				{data.catatan && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7 }}>
						<Card className="p-6 bg-amber-50 border-2 border-amber-200 shadow-lg mb-8">
							<div className="flex gap-4">
								<AlertCircle size={24} className="text-amber-600 flex-shrink-0 mt-1" />
								<div className="flex-1">
									<h3 className="font-bold text-gray-900 mb-2 text-base">Catatan</h3>
									<p className="text-gray-700 leading-relaxed">{data.catatan}</p>
								</div>
							</div>
						</Card>
					</motion.div>
				)}

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
					className="flex flex-col sm:flex-row gap-4">
					<DynamicButton
						variant="outline"
						size="lg"
						className="flex-1"
						onClick={() => navigate("/volunteer/my-activities")}>
						<ArrowLeft size={18} className="mr-2" />
						Kembali ke Aktivitas
					</DynamicButton>

					{data.status === "registered" && (
						<DynamicButton
							variant="danger"
							size="lg"
							className="flex-1"
							onClick={() => {
								const { openCancelModal } = useModalStore.getState();
								openCancelModal(data);
							}}>
							<Ban size={18} className="mr-2" />
							Batalkan Pendaftaran
						</DynamicButton>
					)}

					{data.status === "confirmed" && data.event?.location?.latitude && (
						<DynamicButton
							variant="success"
							size="lg"
							className="flex-1"
							onClick={() => {
								const url = `https://www.google.com/maps/dir/?api=1&destination=${data.event.location.latitude},${data.event.location.longitude}`;
								window.open(url, "_blank");
							}}>
							<Navigation size={18} className="mr-2" />
							Petunjuk Arah
						</DynamicButton>
					)}
				</motion.div>
			</div>
		</div>
	);
}
