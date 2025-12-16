import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// UI Libraries
import { motion } from "framer-motion";
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";
import {
	Building2,
	MapPin,
	Mail,
	Phone,
	Globe,
	Star,
	CheckCircle,
	ArrowLeft,
	Calendar,
	Users,
	Clock,
	MessageSquare,
	Award,
	ChevronLeft,
	ChevronRight,
	CalendarDays,
	MapPinned,
	UserCheck,
	Tag,
} from "lucide-react";

// Hooks
import { useOrganizationById } from "@/_hooks/useOrganizations";
import { useDocumentTitle } from "@/_hooks/useDocumentTitle";

// Helpers
import { getImageUrl } from "@/utils";
import { formatDate, formatTime } from "@/utils/dateFormatter";

// UI Components
import DynamicButton from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import RatingStars from "@/components/ui/RatingStars";

export default function DetailOrganizationPage() {
	useDocumentTitle("Detail Organisasi");
	const { organizationId } = useParams();
	const navigate = useNavigate();
	const [eventPage, setEventPage] = useState(1);
	const eventsPerPage = 2;

	const {
		data: organizationData,
		isLoading,
		error,
	} = useOrganizationById(organizationId, eventPage, eventsPerPage);

	if (isLoading) {
		return <Skeleton.OrganizationDetail />;
	}

	if (error || !organizationData) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
				<div className="text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
						<Building2 className="w-8 h-8 text-red-600" />
					</div>
					<h2 className="text-2xl font-bold text-red-600 mb-4">Organisasi Tidak Ditemukan</h2>
					<p className="text-gray-600 mb-6">
						{error?.message || "Organisasi yang Anda cari tidak tersedia."}
					</p>
					<DynamicButton onClick={() => navigate("/organizations")} variant="primary">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Kembali ke Daftar Organisasi
					</DynamicButton>
				</div>
			</div>
		);
	}

	const {
		organization,
		events = [],
		events_pagination = {},
		feedbacks = [],
		rating,
		total_events,
		total_feedbacks,
	} = organizationData;

	// Use rating from backend directly (tidak dihitung ulang)
	const displayRating = rating || organization.rating || "0.0";
	const displayEventsCount = total_events || organization.events_count || 0;
	const displayFeedbacksCount = total_feedbacks || feedbacks.length || 0;

	const eventTotalPages = events_pagination.last_page || 1;

	const formatDateRange = (startDateStr, endDateStr) => {
		if (!startDateStr || !endDateStr) return "-";
		if (startDateStr === endDateStr) return formatDate(startDateStr);
		return `${formatDate(startDateStr)} - ${formatDate(endDateStr)}`;
	};

	// Event Pagination Handlers (Server-side)
	const handleEventNextPage = () => {
		if (eventPage < eventTotalPages) {
			setEventPage(eventPage + 1);
		}
	};

	const handleEventPrevPage = () => {
		if (eventPage > 1) {
			setEventPage(eventPage - 1);
		}
	};

	const handleEventPageClick = (pageNumber) => {
		setEventPage(pageNumber);
	};

	// Helper function to get status badge for events
	const getStatusBadge = (status) => {
		const statusConfig = {
			published: { variant: "success", text: "Terbuka" },
			draft: { variant: "warning", text: "Draft" },
			cancelled: { variant: "danger", text: "Dibatalkan" },
			completed: { variant: "secondary", text: "Selesai" },
		};
		return statusConfig[status] || statusConfig.published;
	};

	return (
		<div className="page-transition min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Back Button */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					className="mb-6 md:col-span-1 flex flex-row md:flex-col items-center md:items-end gap-2 self-start">
					<DynamicButton
						onClick={() => navigate("/organizations")}
						variant="outline"
						className="group">
						<ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
						Kembali
					</DynamicButton>
				</motion.div>

				{/* Organization Header - New Design */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="mb-8">
					<div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
						{/* Left: Logo & Banner */}
						<div className="md:col-span-5">
							<div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-emerald-400 to-teal-500 h-full min-h-[400px]">
								{/* Background Image */}
								{organization.logo && (
									<AsyncImage
										loading="lazy"
										Transition={Fade}
										src={getImageUrl(`organizations/${organization.logo}`)}
										alt={`${organization.nama} background`}
										className="absolute inset-0 w-full h-full object-cover opacity-20"
										onError={(e) => {
											e.currentTarget.style.display = "none";
										}}
									/>
								)}

								{/* Gradient Overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

								{/* Verified Badge */}
								<Badge
									variant="success"
									className="absolute top-2 right-2 text-xs backdrop-blur-sm shadow-lg">
									Bergabung sejak {formatDate(organization.created_at)}
								</Badge>

								{/* Logo at Center-Bottom */}
								<div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center">
									<div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white shadow-2xl overflow-hidden flex items-center justify-center mb-4">
										{organization.logo ? (
											<AsyncImage
												loading="lazy"
												Transition={Fade}
												src={getImageUrl(`organizations/${organization.logo}`)}
												alt={`${organization.nama} logo`}
												className="object-cover w-32 h-32"
												onError={(e) => {
													e.currentTarget.parentElement.innerHTML = `
														<div class="text-emerald-600 font-bold text-4xl">
															${String(organization.nama || "A")
																.split(" ")
																.map((s) => s[0])
																.slice(0, 2)
																.join("")}
														</div>
													`;
												}}
											/>
										) : (
											<div className="text-emerald-600 font-bold text-4xl">
												{String(organization.nama || "Anonymous")
													.split(" ")
													.map((s) => s[0])
													.slice(0, 2)
													.join("")}
											</div>
										)}
									</div>

									{/* Stats Cards Overlay */}
									<div className="grid grid-cols-3 gap-2 w-full">
										<div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 text-center">
											<div className="flex items-center justify-center mb-1">
												<Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
											</div>
											<div className="text-lg font-bold text-gray-900">{displayRating}</div>
											<div className="text-xs text-gray-600">Rating</div>
										</div>
										<div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 text-center">
											<div className="flex items-center justify-center mb-1">
												<Calendar className="w-4 h-4 text-blue-600" />
											</div>
											<div className="text-lg font-bold text-gray-900">
												{organization.events_count || 0}
											</div>
											<div className="text-xs text-gray-600">Kegiatan</div>
										</div>
										<div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 text-center">
											<div className="flex items-center justify-center mb-1">
												<MessageSquare className="w-4 h-4 text-purple-600" />
											</div>
											<div className="text-lg font-bold text-gray-900">{displayFeedbacksCount}</div>
											<div className="text-xs text-gray-600">Ulasan</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Right: Content */}
						<div className="md:col-span-7">
							{/* Organization Name & Location */}
							<div className="mb-6">
								<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 break-words">
									{organization.nama}
								</h1>
								{organization.alamat && (
									<div className="flex items-start gap-3 text-gray-600">
										<MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
										<span className="text-sm leading-relaxed break-words">
											{organization.alamat}
										</span>
									</div>
								)}
							</div>

							{/* Info Grid */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
								{/* Email */}
								{organization.email && (
									<div className="flex items-start gap-3 min-w-0">
										<Mail className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
										<div className="min-w-0 flex-1">
											<div className="text-gray-900 font-medium text-sm mb-1">Email</div>
											<a
												href={`mailto:${organization.email}`}
												className="text-emerald-600 hover:text-emerald-700 text-sm hover:underline block break-words"
												title={organization.email}>
												{organization.email}
											</a>
										</div>
									</div>
								)}

								{/* Phone */}
								{organization.telepon && (
									<div className="flex items-start gap-3 min-w-0">
										<Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
										<div className="min-w-0 flex-1">
											<div className="text-gray-900 font-medium text-sm mb-1">Telepon</div>
											<a
												href={`tel:${organization.telepon}`}
												className="text-blue-600 hover:text-blue-700 text-sm hover:underline block break-words"
												title={organization.telepon}>
												{organization.telepon}
											</a>
										</div>
									</div>
								)}

								{/* Website */}
								{organization.website && (
									<div className="flex items-start gap-3 min-w-0">
										<Globe className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
										<div className="min-w-0 flex-1">
											<div className="text-gray-900 font-medium text-sm mb-1">Website</div>
											<a
												href={
													organization.website.startsWith("http")
														? organization.website
														: `https://${organization.website}`
												}
												target="_blank"
												rel="noreferrer"
												className="text-purple-600 hover:text-purple-700 text-sm hover:underline block break-words"
												title={organization.website}>
												{organization.website.replace(/^https?:\/\//, "")}
											</a>
										</div>
									</div>
								)}

								{/* Status */}
								<div className="flex items-start gap-3">
									<Award className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
									<div>
										<div className="text-gray-900 font-medium text-sm mb-1">Status</div>
										<div className="text-sm text-gray-700">
											{organization.status_verifikasi === "verified"
												? "Organisasi Terverifikasi"
												: "Belum Terverifikasi"}
										</div>
									</div>
								</div>
							</div>

							{/* Description Section */}
							{organization.deskripsi && (
								<div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 shadow-sm">
									<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
										<Building2 className="w-5 h-5 text-emerald-600" />
										Tentang Organisasi
									</h3>
									<p className="text-gray-700 leading-relaxed">{organization.deskripsi}</p>
								</div>
							)}

							{/* Contact Actions */}
							<div className="mt-6 flex flex-wrap gap-3">
								{organization.email && (
									<a
										href={`mailto:${organization.email}`}
										className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-medium text-sm shadow-sm hover:shadow-md">
										<Mail className="w-4 h-4" />
										Kirim Email
									</a>
								)}
								{organization.telepon && (
									<a
										href={`tel:${organization.telepon}`}
										className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all font-medium text-sm shadow-sm hover:shadow-md">
										<Phone className="w-4 h-4" />
										Hubungi
									</a>
								)}
								{organization.website && (
									<a
										href={
											organization.website.startsWith("http")
												? organization.website
												: `https://${organization.website}`
										}
										target="_blank"
										rel="noreferrer"
										className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all font-medium text-sm shadow-sm hover:shadow-md">
										<Globe className="w-4 h-4" />
										Kunjungi Website
									</a>
								)}
							</div>
						</div>
					</div>
				</motion.div>

				{/* Events Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}>
					<Card className="p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
							<h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 min-w-0">
								<Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
								<span className="truncate">Kegiatan</span>
							</h2>
							{displayEventsCount > 0 && (
								<Badge variant="primary" className="text-sm flex-shrink-0 w-fit">
									{displayEventsCount} Event
								</Badge>
							)}
						</div>

						{events.length === 0 ? (
							<div className="text-center py-12">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
									<Calendar className="w-8 h-8 text-gray-400" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									Belum Ada Kegiatan Tersedia
								</h3>
								<p className="text-gray-600">
									Organisasi ini belum memiliki kegiatan. Cek kembali nanti!
								</p>
							</div>
						) : (
							<>
								<div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-6">
									{events.map((event, index) => (
										<motion.div
											onClick={() => navigate(`/events/details/${event.id}`)}
											className="group cursor-pointer bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-emerald-300 transition-all duration-300 p-3 sm:p-4">
											<div className="flex items-start gap-3 sm:gap-4">
												{/* Date Badge */}
												<div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-600 to-emerald-600 rounded-lg flex flex-col items-center justify-center text-white shadow-sm">
													<span className="text-xs font-medium">
														{new Date(event.tanggal_mulai).toLocaleDateString("id-ID", {
															month: "short",
														})}
													</span>
													<span className="text-xl sm:text-2xl font-bold">
														{new Date(event.tanggal_mulai).getDate()}
													</span>
												</div>

												{/* Event Details */}
												<div className="flex-1 min-w-0">
													{/* Title & Category */}
													<div className="flex items-start justify-between gap-2 mb-2">
														<h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors flex-1 min-w-0">
															{event.judul}
														</h3>
														{event.category && (
															<Badge
																color={event.category.warna}
																className="text-xs flex-shrink-0 whitespace-nowrap">
																{event.category.nama}
															</Badge>
														)}
													</div>

													{/* Description */}
													{event.deskripsi_singkat && (
														<p className="text-xs text-gray-600 mb-3 line-clamp-2">
															{event.deskripsi_singkat}
														</p>
													)}

													{/* Meta Info Grid */}
													<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
														{/* Time */}
														<div className="flex items-center text-gray-600 min-w-0">
															<Clock className="w-3 h-3 mr-1 text-blue-500 flex-shrink-0" />
															<span className="truncate">
																{formatTime(event.waktu_mulai)} -{" "}
																{formatTime(event.waktu_selesai, "WIB")}
															</span>
														</div>

														{/* Location */}
														{event.location && (
															<div className="flex items-center text-gray-600 min-w-0">
																<MapPinned className="w-3 h-3 mr-1 text-purple-600 flex-shrink-0" />
																<span className="truncate">{event.location.kota}</span>
															</div>
														)}

														{/* Participants */}
														<div className="flex items-center text-gray-600 min-w-0">
															<UserCheck className="w-3 h-3 mr-1 text-orange-600 flex-shrink-0" />
															<span className="truncate">
																{event.peserta_saat_ini || 0}/{event.maks_peserta} peserta
															</span>
														</div>

														{/* Rating */}
														{event.rating && parseFloat(event.rating) > 0 && (
															<div className="flex items-center text-gray-600 min-w-0">
																<Star className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400 flex-shrink-0" />
																<span className="truncate">
																	{parseFloat(event.rating).toFixed(1)} review
																</span>
															</div>
														)}

														{/* Status Badge */}
														<div className="col-span-2 sm:col-span-1">
															<Badge
																variant={getStatusBadge(event.status).variant}
																className="text-xs w-fit whitespace-nowrap">
																{getStatusBadge(event.status).text}
															</Badge>
														</div>
													</div>
												</div>
											</div>
										</motion.div>
									))}
								</div>

								{/* Event Pagination */}
								{eventTotalPages > 1 && (
									<div className="pt-4 border-t border-gray-200">
										<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
											{/* Info */}
											<div className="text-sm text-gray-600">
												Menampilkan{" "}
												<span className="font-semibold text-gray-900">
													{(eventPage - 1) * eventsPerPage + 1}
												</span>{" "}
												-{" "}
												<span className="font-semibold text-gray-900">
													{Math.min(eventPage * eventsPerPage, displayEventsCount)}
												</span>{" "}
												dari{" "}
												<span className="font-semibold text-gray-900">{displayEventsCount}</span>{" "}
												event
											</div>

											{/* Pagination Buttons */}
											<div className="flex items-center gap-2">
												{/* Previous Button */}
												<button
													onClick={handleEventPrevPage}
													disabled={eventPage === 1}
													className={`p-2 rounded-lg transition-all ${
														eventPage === 1
															? "bg-gray-100 text-gray-400 cursor-not-allowed"
															: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-emerald-500"
													}`}>
													<ChevronLeft size={20} />
												</button>

												{/* Page Numbers */}
												<div className="flex items-center gap-1">
													{Array.from({ length: eventTotalPages }, (_, i) => i + 1).map(
														(pageNumber) => {
															// Show first page, last page, current page, and pages around current
															const showPage =
																pageNumber === 1 ||
																pageNumber === eventTotalPages ||
																(pageNumber >= eventPage - 1 && pageNumber <= eventPage + 1);

															// Show ellipsis
															const showEllipsisBefore =
																pageNumber === eventPage - 2 && eventPage > 3;
															const showEllipsisAfter =
																pageNumber === eventPage + 2 && eventPage < eventTotalPages - 2;

															if (showEllipsisBefore || showEllipsisAfter) {
																return (
																	<span key={pageNumber} className="px-2 text-gray-400">
																		...
																	</span>
																);
															}

															if (!showPage) return null;

															return (
																<button
																	key={pageNumber}
																	onClick={() => handleEventPageClick(pageNumber)}
																	className={`px-4 py-2 rounded-lg font-medium transition-all ${
																		eventPage === pageNumber
																			? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
																			: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-emerald-500"
																	}`}>
																	{pageNumber}
																</button>
															);
														}
													)}
												</div>

												{/* Next Button */}
												<button
													onClick={handleEventNextPage}
													disabled={eventPage === eventTotalPages}
													className={`p-2 rounded-lg transition-all ${
														eventPage === eventTotalPages
															? "bg-gray-100 text-gray-400 cursor-not-allowed"
															: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-emerald-500"
													}`}>
													<ChevronRight size={20} />
												</button>
											</div>
										</div>
									</div>
								)}
							</>
						)}
					</Card>
				</motion.div>

				{/* Feedbacks Section */}
				{feedbacks.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}>
						<Card className="p-6 mt-7">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
									<MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
									<span>Ulasan dari Relawan</span>
								</h2>
								<Badge variant="primary" className="text-sm flex-shrink-0 w-fit">
									{displayFeedbacksCount} Feedback
								</Badge>
							</div>

							<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
								{feedbacks.map((feedback, index) => (
									<motion.div
										key={feedback.id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.3, delay: index * 0.05 }}
										className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
										<div className="flex items-start gap-3 mb-3">
											<Avatar
												fallback={feedback.is_anonim ? "Anonymous" : feedback.user?.nama}
												size="sm"
												className="flex-shrink-0"
											/>
											<div className="flex-1 min-w-0">
												<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
													<h4 className="font-semibold text-gray-900 text-sm truncate">
														{feedback.is_anonim ? "Anonymous" : feedback.user?.nama}
													</h4>
													<RatingStars
														rating={feedback.rating}
														size="sm"
														className="flex-shrink-0"
													/>
												</div>
												<p className="text-xs text-gray-500">{formatDate(feedback.created_at)}</p>
											</div>
										</div>
										{feedback.komentar && (
											<p className="text-sm text-gray-700 leading-relaxed line-clamp-3 break-words">
												{feedback.komentar}
											</p>
										)}
									</motion.div>
								))}
							</div>
						</Card>
					</motion.div>
				)}
			</div>
		</div>
	);
}
