import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Calendar, MapPin, Users, Clock, NotepadText, Gift } from "lucide-react";
import Modal from "@/components/ui/Modal";
import DynamicButton from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/_hooks/useAuth";
import { useVolunteerJoinEventMutation } from "@/_hooks/useParticipants";
import { getImageUrl } from "@/utils";
import { useEventById } from "@/_hooks/useEvents";
import { useModalStore } from "@/stores/useAppStore";
import { AsyncImage } from "loadable-image";
import { formatDate, formatTime } from "@/utils/dateFormatter";
import { showToast } from "../ui/Toast";

/**
 * Modal untuk join event volunteer
 * Menampilkan form untuk notes dan agreement sebelum join
 *
 * @returns {JSX.Element} Modal untuk pendaftaran event
 */
export default function JoinEventModal() {
	const navigate = useNavigate();
	const location = useLocation();
	const { isAuthenticated, user } = useAuthStore();
	// read modal state + selected event directly from store
	const { isJoinModalOpen, closeJoinModal, selectedEventDetail: event } = useModalStore();
	const [agreed, setAgreed] = useState(false);
	const [success, setSuccess] = useState(false);

	const { isLoading, setLoading } = useAuthStore();

	const joinMutation = useVolunteerJoinEventMutation(); // mutation hook untuk join event

	// fetch fresh detail only when modal is open; use store event as initialData
	const { data: freshEvent } = useEventById(event?.id);

	// pakai freshEvent jika sudah ada, fallback ke store event
	const participantsFromEvent = freshEvent?.participants ?? event?.participants ?? [];
	const alreadyRegistered =
		!!user?.id && participantsFromEvent.some((p) => Number(p.user_id) === Number(user.id));

	const [formData, setFormData] = useState({
		catatan: "",
	});

	// Reset loading state saat modal dibuka
	useEffect(() => {
		if (isJoinModalOpen) {
			setLoading(false);
		}
	}, [isJoinModalOpen, setLoading]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((s) => ({ ...s, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!agreed || !event?.id) return;

		let startTime = null; // untuk menghitung durasi, juga dipakai di catch

		if (!isAuthenticated) {
			closeJoinModal();
			showToast({
				type: "warning",
				title: "Anda belum login",
				message: "Silakan login atau daftar akun terlebih dahulu untuk mendaftar event",
				duration: 3000,
				position: "top-right",
			});
			navigate("/login", { state: { from: location }, replace: true });
			return;
		}

		try {
			const payload = {
				event_id: event.id,
				catatan: formData.catatan || "",
			};

			// Catat waktu mulai request untuk monitoring response time
			startTime =
				typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();

			// Tunggu join selesai
			await joinMutation.mutateAsync(payload);

			// Hitung durasi
			const endTime =
				typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
			const durationMs = Math.round(endTime - startTime);
			const formatDuration = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${ms} ms`);

			// Log sebagai kalimat panjang menggunakan huruf kapital
			if (import.meta.env && import.meta.env.DEV) {
				console.log(
					`[PERFORMANCE] PENDAFTARAN UNTUK EVENT "${
						event.judul || event.title || event.id
					}" OLEH PENGGUNA ${user?.id || "-"} TELAH BERHASIL DAN SELESAI DALAM ${formatDuration(
						durationMs
					)}. TERIMA KASIH ATAS PARTISIPASINYA.`
				);
			}

			// Langsung tampilkan success animation setelah request berhasil
			setSuccess(true);

			// Tutup modal setelah animasi sukses singkat
			setTimeout(() => {
				setSuccess(false);
				setAgreed(false);
				setFormData({ catatan: "" });
				setLoading(false); // Reset loading state sebelum tutup modal
				closeJoinModal();
			}, 11500);
		} catch (err) {
			// Jika request gagal, log juga durasi (jika tersedia)
			const endTime =
				typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
			const durationMs = startTime ? Math.round(endTime - startTime) : null;
			const formatDuration = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${ms} ms`);
			if (durationMs !== null) {
				if (import.meta.env && import.meta.env.DEV) {
					console.log(
						`[PERFORMANCE] PENDAFTARAN UNTUK EVENT "${
							event.judul || event.title || event.id
						}" OLEH PENGGUNA ${user?.id || "-"} GAGAL SETELAH ${formatDuration(
							durationMs
						)}. SILAKAN COBA LAGI NANTI.`
					);
				}
			} else {
				if (import.meta.env && import.meta.env.DEV) {
					console.log(
						`[PERFORMANCE] PENDAFTARAN UNTUK EVENT "${
							event.judul || event.title || event.id
						}" OLEH PENGGUNA ${user?.id || "-"} GAGAL. SILAKAN COBA KEMBALI.`
					);
				}
			}
			// Error handling sudah dilakukan di hook, tetap log error ke console
			console.error("Join event error:", err);
		}
	};
	const handleClose = () => {
		if (!isLoading) {
			setAgreed(false);
			setSuccess(false);
			setFormData({ catatan: "" });
			setLoading(false); // Pastikan loading state direset
			closeJoinModal();
		}
	};
	// If no event passed, render nothing
	if (!event) return null;

	return (
		<Modal isOpen={isJoinModalOpen} onClose={handleClose} title="Daftar Event Volunteer" size="xl">
			{success ? (
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center py-8">
					<div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
						<Check className="text-white" size={36} />
					</div>
					<h3 className="text-2xl font-bold text-gray-900 mb-3">Pendaftaran Berhasil! 🎉</h3>
					<p className="text-gray-600 text-lg leading-relaxed">
						Anda telah berhasil mendaftar untuk event <br />
						<span className="font-semibold text-blue-600">"{event.judul || event.title}"</span>
					</p>
					<div className="mt-6 p-4 bg-blue-50 rounded-lg">
						<p className="text-sm text-blue-800">
							📧 Email konfirmasi akan dikirim ke alamat email Anda
						</p>
					</div>
				</motion.div>
			) : (
				<div className="space-y-6">
					{/* Event Preview Card */}
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
						<div className="flex items-start gap-4">
							<AsyncImage
								src={getImageUrl(`events/${event.gambar}`) || "https://placehold.co/400"}
								alt={event.judul}
								className="w-24 h-24 object-cover rounded-lg shadow-md flex-shrink-0"
							/>
							<div className="flex-1 min-w-0">
								<h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-2">{event.judul}</h3>
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										<Calendar size={16} className="mr-2 text-emerald-600 flex-shrink-0" />
										<span className="font-medium">{formatDate(event.tanggal_mulai)}</span>
									</div>
									<div className="flex items-center text-gray-700 text-sm">
										<Clock size={16} className="mr-2 text-blue-600 flex-shrink-0" />
										<span className="font-medium">
											{formatTime(event.waktu_mulai)} - {formatTime(event.waktu_selesai, "WIB")}
										</span>
									</div>
									<div className="flex items-center text-gray-700 text-sm">
										<MapPin size={16} className="mr-2 text-purple-600 flex-shrink-0" />
										<span className="font-medium line-clamp-1">{event.location?.nama}</span>
									</div>
									<div className="flex items-center text-gray-700 text-sm">
										<Users size={16} className="mr-2 text-orange-500 flex-shrink-0" />
										<span className="font-medium">
											{event.peserta_saat_ini || 0} / {event.maks_peserta} peserta
										</span>
										<Badge variant="success" className="ml-2">
											{event.maks_peserta - (event.peserta_saat_ini || 0)} slot tersisa
										</Badge>
									</div>
								</div>
							</div>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{(event.persyaratan.length > 0 || event.manfaat.length > 0) && (
							<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Requirements */}
								{event.persyaratan && (
									<div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
										<h4 className="font-bold text-amber-800 mb-3 flex items-center">
											<NotepadText className="w-5 h-5 mr-2" /> Persyaratan
										</h4>
										<div className="text-amber-700 text-sm leading-relaxed">
											{Array.isArray(event.persyaratan) ? (
												<ul className="space-y-2">
													{event.persyaratan.map((req, index) => (
														<li key={index} className="flex items-start gap-2">
															<span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
															<span>{req}</span>
														</li>
													))}
												</ul>
											) : (
												<div className="whitespace-pre-line">{event.persyaratan}</div>
											)}
										</div>
									</div>
								)}
								{event.manfaat && (
									<div className="bg-green-50 border border-green-200 rounded-xl p-5">
										<h4 className="font-bold text-green-800 mb-3 flex items-center">
											<Gift className="w-5 h-5 mr-2" /> Manfaat
										</h4>
										<div className="text-green-700 text-sm leading-relaxed">
											{Array.isArray(event.manfaat) ? (
												<ul className="space-y-2">
													{event.manfaat.map((benefit, index) => (
														<li key={index} className="flex items-start gap-2">
															<span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
															<span>{benefit}</span>
														</li>
													))}
												</ul>
											) : (
												<div className="whitespace-pre-line">{event.manfaat}</div>
											)}
										</div>
									</div>
								)}
							</div>
						)}

						{/* Notes */}
						<div>
							<label className="block text-gray-900 font-semibold mb-3">Catatan & Motivasi</label>
							<textarea
								name="catatan"
								value={formData.catatan}
								onChange={handleChange}
								placeholder="Ceritakan pengalaman relevan atau motivasi Anda untuk mengikuti event ini..."
								className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
								rows={4}
							/>
						</div>

						{/* Agreement */}
						<div className="bg-gray-50 rounded-xl p-5">
							<div className="flex items-start space-x-3">
								<input
									type="checkbox"
									id="agreement"
									checked={agreed}
									onChange={(e) => setAgreed(e.target.checked)}
									className="mt-1 w-5 h-5 text-emerald-600 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
								/>
								<label htmlFor="agreement" className="text-sm text-gray-700 leading-relaxed">
									<span className="font-semibold">Saya setuju untuk:</span>
									<ul className="mt-2 space-y-1 text-gray-600">
										<li>• Mengikuti event ini dan memahami semua persyaratan</li>
										<li>• Berkomitmen hadir tepat waktu sesuai jadwal</li>
										<li>• Mengikuti seluruh rangkaian kegiatan hingga selesai</li>
										<li>• Mematuhi protokol dan aturan yang berlaku</li>
									</ul>
								</label>
							</div>
						</div>

						{/* Actions */}
						<div className="flex flex-col sm:flex-row gap-3 pt-4 border-gray-100">
							<DynamicButton
								type="button"
								variant="outline"
								onClick={handleClose}
								disabled={isLoading && !alreadyRegistered}
								className="flex-1 order-2 sm:order-1">
								Batal
							</DynamicButton>
							<DynamicButton
								type="submit"
								variant={alreadyRegistered ? "outline" : "success"}
								disabled={alreadyRegistered || !agreed || (isLoading && !alreadyRegistered)}
								loading={isLoading && !alreadyRegistered}
								className="flex-1 order-1 sm:order-2">
								{alreadyRegistered
									? "Sudah Daftar"
									: isLoading
									? "Mendaftarkan..."
									: "✨ Daftar Sekarang"}
							</DynamicButton>
						</div>
					</form>
				</div>
			)}
		</Modal>
	);
}
