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
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { useModalStore } from "@/stores/useAppStore";

/**
 * Modal komponen global untuk menampilkan detail lengkap sebuah event volunteer
 * Menggunakan global state management melalui useModalStore
 */
const EventDetailModal = () => {
	const {
		isDetailModalOpen,
		closeDetailModal,
		selectedEventDetail: event,
		openJoinModal,
	} = useModalStore();

	// Handle scroll lock
	useEffect(() => {
		if (isDetailModalOpen) {
			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = "15px";
		} else {
			document.body.style.overflow = "unset";
			document.body.style.paddingRight = "0px";
		}

		return () => {
			document.body.style.overflow = "unset";
			document.body.style.paddingRight = "0px";
		};
	}, [isDetailModalOpen]);

	// Handle escape key
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				closeDetailModal();
			}
		};

		if (isDetailModalOpen) {
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isDetailModalOpen, closeDetailModal]);

	if (!event) return null;

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

	const handleJoinEvent = () => {
		closeDetailModal();
		openJoinModal(event.id);
	};

	const statusBadge = getStatusBadge(event.status);
	const slotsRemaining =
		(event.maks_peserta || event.capacity) -
		(event.peserta_saat_ini || event.registered || 0);

	return (
		<AnimatePresence>
			{isDetailModalOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
						onClick={closeDetailModal}
					/>

					{/* Modal Container */}
					<div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
							onClick={(e) => e.stopPropagation()}>
							{/* Header */}
							<div className="flex items-center justify-between p-6 border-b border-gray-200">
								<div className="flex items-center gap-3">
									<Badge variant={statusBadge.variant}>
										{statusBadge.text}
									</Badge>
									<h2 className="text-xl font-bold text-gray-900">
										Detail Event
									</h2>
								</div>
								<Button variant="ghost" size="sm" onClick={closeDetailModal}>
									<X size={20} />
								</Button>
							</div>

							{/* Scrollable Content */}
							<div className="flex-1 overflow-y-auto">
								{/* Event Banner */}
								<div className="relative h-64 overflow-hidden">
									<img
										src={
											event.gambar || event.banner || "https://placehold.co/400"
										}
										alt={event.judul || event.title}
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
									<div className="absolute bottom-4 left-6 text-white">
										<h1 className="text-2xl font-bold mb-2">
											{event.judul || event.title}
										</h1>
										<div className="flex items-center gap-4 text-sm">
											<span className="flex items-center gap-1">
												<Calendar size={16} />
												{formatDate(event.tanggal_mulai || event.date)}
											</span>
											<span className="flex items-center gap-1">
												<Clock size={16} />
												{formatTime(event.waktu_mulai || event.time)} -{" "}
												{formatTime(event.waktu_selesai || event.end_time)}
											</span>
										</div>
									</div>
								</div>

								{/* Content */}
								<div className="p-6">
									{/* Description */}
									<div className="mb-6">
										<h3 className="text-lg font-semibold text-gray-900 mb-3">
											Deskripsi Event
										</h3>
										<p className="text-gray-700 leading-relaxed">
											{event.deskripsi || event.description}
										</p>
									</div>

									{/* Event Details Grid */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
										{/* Location */}
										<div className="space-y-3">
											<h4 className="font-semibold text-gray-900 flex items-center gap-2">
												<MapPin size={18} className="text-purple-600" />
												Lokasi
											</h4>
											<div className="text-gray-700">
												<div className="font-medium">
													{event.location?.nama || event.location}
												</div>
												<div className="text-sm text-gray-500">
													{event.location?.alamat || event.address}
												</div>
												{(event.location?.kota || event.city) && (
													<div className="text-sm text-gray-500">
														{event.location?.kota || event.city},{" "}
														{event.location?.provinsi || event.province}
													</div>
												)}
											</div>
										</div>

										{/* Participants */}
										<div className="space-y-3">
											<h4 className="font-semibold text-gray-900 flex items-center gap-2">
												<Users size={18} className="text-green-600" />
												Peserta
											</h4>
											<div className="text-gray-700">
												<div className="font-medium">
													{event.peserta_saat_ini || event.registered || 0} /{" "}
													{event.maks_peserta || event.capacity} orang
												</div>
												{slotsRemaining > 0 && (
													<div className="text-sm text-green-600 font-medium">
														{slotsRemaining} slot tersisa
													</div>
												)}
											</div>
										</div>

										{/* Persyaratan & Manfaat: tampil samping-samping di layar md ke atas */}
										{(event.persyaratan || event.manfaat) && (
											<div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
												{event.persyaratan && (
													<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
														<h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
															📋 Persyaratan
														</h4>
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

												{event.manfaat && (
													<div className="bg-green-50 border border-green-200 rounded-lg p-4">
														<h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
															🎁 Manfaat
														</h4>
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
															<p className="text-green-700 text-sm">
																{event.manfaat}
															</p>
														)}
													</div>
												)}
											</div>
										)}
										{event.organization && (
											<div className="border border-gray-200 rounded-lg p-4">
												<h4 className="font-semibold text-gray-900 mb-3">
													Penyelenggara
												</h4>
												<div className="flex items-center gap-3">
													<Avatar
														src={event.organization.logo}
														alt={event.organization.nama}
														size="md"
													/>
													<div>
														<div className="font-medium text-gray-900">
															{event.organization.nama}
														</div>
														<div className="text-sm text-gray-500">
															Event Organizer
														</div>
													</div>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="p-6 border-t border-gray-200 flex gap-3">
								<Button
									variant="outline"
									onClick={closeDetailModal}
									className="flex-1">
									Tutup
								</Button>
								<Button
									variant="primary"
									onClick={handleJoinEvent}
									disabled={
										event.status === "full" || event.status === "cancelled"
									}
									className="flex-1">
									{event.status === "full"
										? "Event Penuh"
										: event.status === "cancelled"
										? "Event Dibatalkan"
										: "Daftar Sekarang"}
								</Button>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
};

export default EventDetailModal;
