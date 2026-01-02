import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "@/components/ui/Modal";
import DynamicButton from "@/components/ui/DynamicButton";
import Card from "@/components/ui/Card";
import RatingStars from "@/components/ui/RatingStars";
import { useModalStore } from "@/stores/useAppStore";
import { useVolunteerSendFeedbackMutation } from "@/_hooks/useFeedbacks";
import { useAuthStore } from "@/_hooks/useAuth";

export default function FeedbackModal() {
	const { isFeedbackModalOpen, selectedFeedbackParticipant, closeFeedbackModal } = useModalStore();

	const [formData, setFormData] = useState({
		rating: 5,
		komentar: "",
		is_anonim: false,
	});
	const [success, setSuccess] = useState(false);

	const { isAuthenticated, isLoading, setLoading } = useAuthStore();
	const sendFeedbackMutation = useVolunteerSendFeedbackMutation();

	useEffect(() => {
		if (isFeedbackModalOpen) {
			setFormData({ rating: 5, komentar: "", is_anonim: false });
			setLoading(false);
		}
	}, [isFeedbackModalOpen, selectedFeedbackParticipant, setLoading]);

	const handleRatingChange = (value) => setFormData((s) => ({ ...s, rating: value }));
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		if (type === "checkbox") setFormData((s) => ({ ...s, [name]: checked }));
		else setFormData((s) => ({ ...s, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e?.preventDefault();
		const eventId = selectedFeedbackParticipant?.event?.id || selectedFeedbackParticipant?.event_id;
		if (!eventId) return;

		if (!isAuthenticated) {
			closeFeedbackModal();
			return;
		}

		try {
			const payload = new FormData();
			payload.append("event_id", eventId);
			payload.append("rating", String(formData.rating));
			payload.append("komentar", formData.komentar || "");
			payload.append("is_anonim", formData.is_anonim ? "1" : "0");

			await sendFeedbackMutation.mutateAsync(payload);

			setSuccess(true);
			setTimeout(() => {
				setSuccess(false);
				setFormData({ rating: 5, komentar: "", is_anonim: false });
				setLoading(false);
				closeFeedbackModal();
			}, 1200);
		} catch (err) {
			console.error("Send feedback error:", err);
		}
	};

	const handleClose = () => {
		if (!isLoading) {
			setFormData({ rating: 5, komentar: "", is_anonim: false });
			setSuccess(false);
			setLoading(false);
			closeFeedbackModal();
		}
	};

	if (!selectedFeedbackParticipant) return null;

	return (
		<Modal isOpen={isFeedbackModalOpen} onClose={handleClose} title="Kirim Feedback" size="md">
			{success ? (
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center py-8">
					<div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
						<svg
							className="w-10 h-10 text-white"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor">
							<path
								d="M20 6L9 17l-5-5"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
					<h3 className="text-2xl font-bold text-gray-900 mb-3">Feedback Terkirim</h3>
					<p className="text-gray-600 text-lg leading-relaxed">
						Terima kasih telah memberikan feedback untuk event <br />
						<span className="font-semibold text-blue-600">
							{selectedFeedbackParticipant?.event?.judul}
						</span>
					</p>
				</motion.div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-6">
					<motion.div className="p-6 rounded-xl bg-emerald-600 text-white shadow-2xl border border-emerald-400/20 relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
						<div className="relative flex items-start gap-4">
							<motion.div
								whileHover={{ rotate: 360, scale: 1.1 }}
								transition={{ duration: 0.6 }}
								className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
								⭐
							</motion.div>
							<div className="flex-1">
								<h4 className="text-xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
									Bagaimana Pengalaman Anda?
								</h4>
								<p className="text-sm text-emerald-100 leading-relaxed">
									Berikan rating dan komentar tentang event{" "}
									<strong className="text-yellow-300">
										{selectedFeedbackParticipant?.event?.judul}
									</strong>{" "}
									untuk membantu kami berkembang!
								</p>
							</div>
						</div>
					</motion.div>

					<div className="flex flex-col items-center">
						<label className="block text-sm font-medium text-gray-700 mb-2 text-center">
							Rating
						</label>
						<RatingStars
							size="xl"
							rating={formData.rating}
							interactive={true}
							showNumber={false}
							onRatingChange={handleRatingChange}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Komentar dan Saran (opsional)
						</label>
						<textarea
							name="komentar"
							value={formData.komentar}
							onChange={handleChange}
							rows={4}
							className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
							placeholder="Bagikan pengalaman atau saran... (maks 2000 karakter)"
						/>
					</div>

					<div className="flex items-center gap-2">
						<input
							id="is_anonim"
							name="is_anonim"
							type="checkbox"
							checked={formData.is_anonim}
							onChange={handleChange}
						/>
						<label htmlFor="is_anonim" className="text-sm text-gray-700">
							Kirim sebagai anonim
						</label>
					</div>

					<div className="flex justify-end gap-3">
						<DynamicButton
							type="button"
							variant="outline"
							size="sm"
							onClick={handleClose}
							disabled={isLoading}>
							Kembali
						</DynamicButton>
						<DynamicButton
							type="submit"
							variant="success"
							size="sm"
							loading={isLoading}
							disabled={isLoading}>
							{isLoading ? "Mengirim..." : "Kirim Feedback"}
						</DynamicButton>
					</div>
				</form>
			)}
		</Modal>
	);
}
