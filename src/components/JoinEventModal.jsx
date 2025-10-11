import { useState } from "react";
import { motion } from "framer-motion";
import {
	Check,
	AlertCircle,
	Calendar,
	MapPin,
	Users,
	Clock,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useModalStore } from "@/store";
import { useEvent, useJoinEvent } from "@/hooks/useEvents";

/**
 * Modal untuk join event volunteer
 * Menggunakan TanStack Query untuk fetch event detail dan join mutation
 * Menampilkan form untuk notes dan agreement sebelum join
 *
 * @returns {JSX.Element} Modal untuk pendaftaran event
 */
const JoinEventModal = () => {
	const { isJoinModalOpen, closeJoinModal, selectedEventId } = useModalStore();

	// Menggunakan TanStack Query untuk fetch event detail
	const { data: event, isLoading: eventLoading } = useEvent(selectedEventId);
	const joinEventMutation = useJoinEvent();

	const [notes, setNotes] = useState("");
	const [agreed, setAgreed] = useState(false);
	const [success, setSuccess] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	/**
	 * Handler untuk submit form join event
	 * Menggunakan mutation untuk mengirim data ke API
	 */
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!agreed || !selectedEventId) return;

		setIsSubmitting(true);

		joinEventMutation.mutate(
			{
				eventId: selectedEventId,
				userData: {
					notes: notes.trim(),
					agreed: true,
					joinedAt: new Date().toISOString(),
				},
			},
			{
				onSuccess: () => {
					setIsSubmitting(false);
					setSuccess(true);

					// Close modal after success animation
					setTimeout(() => {
						setSuccess(false);
						setNotes("");
						setAgreed(false);
						closeJoinModal();
					}, 2000);
				},
				onError: (error) => {
					console.error("Failed to join event:", error);
					setIsSubmitting(false);
					// Handle error (bisa tambah toast notification)
				},
			}
		);
	};

	/**
	 * Handler untuk menutup modal dan reset form
	 */
	const handleClose = () => {
		if (!joinEventMutation.isPending && !isSubmitting) {
			setNotes("");
			setAgreed(false);
			setSuccess(false);
			closeJoinModal();
		}
	};

	// Loading state saat fetch event detail
	if (eventLoading) {
		return (
			<Modal isOpen={isJoinModalOpen} onClose={handleClose} size="lg">
				<div className="text-center py-8">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Memuat detail event...</p>
				</div>
			</Modal>
		);
	}

	if (!event) return null;

	const MotionDiv = motion.div;

	return (
		<Modal
			isOpen={isJoinModalOpen}
			onClose={handleClose}
			title="Daftar Event Volunteer"
			size="lg">
			{success ? (
				<MotionDiv
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center py-8">
					<div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
						<Check className="text-white" size={36} />
					</div>
					<h3 className="text-2xl font-bold text-gray-900 mb-3">
						Pendaftaran Berhasil! 🎉
					</h3>
					<p className="text-gray-600 text-lg leading-relaxed">
						Anda telah berhasil mendaftar untuk event <br />
						<span className="font-semibold text-blue-600">"{event.title}"</span>
					</p>
					<div className="mt-6 p-4 bg-blue-50 rounded-lg">
						<p className="text-sm text-blue-800">
							📧 Email konfirmasi akan dikirim ke alamat email Anda
						</p>
					</div>
				</MotionDiv>
			) : (
				<div className="space-y-6">
					{/* Event Preview Card */}
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
						<div className="flex items-start gap-4">
							<img
								src={event.banner}
								alt={event.title}
								className="w-24 h-24 object-cover rounded-lg shadow-md flex-shrink-0"
							/>
							<div className="flex-1 min-w-0">
								<h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-2">
									{event.title}
								</h3>
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										<Calendar
											size={16}
											className="mr-2 text-blue-500 flex-shrink-0"
										/>
										<span className="font-medium">
											{new Date(event.date).toLocaleDateString("id-ID", {
												day: "numeric",
												month: "long",
												year: "numeric",
											})}
										</span>
									</div>
									<div className="flex items-center text-gray-700 text-sm">
										<Clock
											size={16}
											className="mr-2 text-purple-500 flex-shrink-0"
										/>
										<span className="font-medium">
											{event.time} - {event.end_time}
										</span>
									</div>
									<div className="flex items-center text-gray-700 text-sm">
										<MapPin
											size={16}
											className="mr-2 text-green-500 flex-shrink-0"
										/>
										<span className="font-medium line-clamp-1">
											{event.location}
										</span>
									</div>
									<div className="flex items-center text-gray-700 text-sm">
										<Users
											size={16}
											className="mr-2 text-orange-500 flex-shrink-0"
										/>
										<span className="font-medium">
											{event.registered} / {event.capacity} peserta
										</span>
										<Badge variant="success" className="ml-2">
											{event.capacity - event.registered} slot tersisa
										</Badge>
									</div>
								</div>
							</div>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Requirements */}
						{event.requirements && event.requirements.length > 0 && (
							<div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
								<h4 className="font-bold text-amber-800 mb-3 flex items-center">
									<AlertCircle size={20} className="mr-2" />
									Persyaratan Event
								</h4>
								<ul className="space-y-2">
									{event.requirements.map((req, index) => (
										<li
											key={index}
											className="flex items-start text-amber-700 text-sm">
											<span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full mr-3 mt-2 flex-shrink-0" />
											{req}
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Notes */}
						<div>
							<label className="block text-gray-900 font-semibold mb-3">
								Catatan & Motivasi
								<span className="text-gray-500 font-normal text-sm ml-1">
									(Opsional)
								</span>
							</label>
							<textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
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
									className="mt-1 w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
								/>
								<label
									htmlFor="agreement"
									className="text-sm text-gray-700 leading-relaxed">
									<span className="font-semibold">Saya setuju untuk:</span>
									<ul className="mt-2 space-y-1 text-gray-600">
										<li>
											• Mengikuti event ini dan memahami semua persyaratan
										</li>
										<li>• Berkomitmen hadir tepat waktu sesuai jadwal</li>
										<li>
											• Mengikuti seluruh rangkaian kegiatan hingga selesai
										</li>
										<li>• Mematuhi protokol dan aturan yang berlaku</li>
									</ul>
								</label>
							</div>
						</div>

						{/* Actions */}
						<div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
							<Button
								type="button"
								variant="outline"
								onClick={handleClose}
								disabled={joinEventMutation.isPending || isSubmitting}
								className="flex-1 order-2 sm:order-1">
								Batal
							</Button>
							<Button
								type="submit"
								variant="primary"
								disabled={
									!agreed || joinEventMutation.isPending || isSubmitting
								}
								loading={joinEventMutation.isPending || isSubmitting}
								className="flex-1 order-1 sm:order-2">
								{joinEventMutation.isPending || isSubmitting
									? "Mendaftarkan..."
									: "✨ Daftar Sekarang"}
							</Button>
						</div>
					</form>
				</div>
			)}
		</Modal>
	);
};

export default JoinEventModal;
