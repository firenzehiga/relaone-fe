import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import DynamicButton from "@/components/ui/DynamicButton";
import Card from "@/components/ui/Card";
import { useModalStore } from "@/stores/useAppStore";
import { useVolunteerCancelJoinMutation } from "@/_hooks/useParticipants";
import { useAuthStore } from "@/_hooks/useAuth";

/**
 * Modal untuk cancel join event volunteer
 * Menampilkan form untuk notes sebagai catatan pembatalan
 *
 * @returns {JSX.Element} Modal untuk pembatalan pendaftaran event
 */
export default function CancelJoinModal() {
	const { isCancelModalOpen, selectedCancelParticipant, closeCancelModal } = useModalStore();

	const [formData, setFormData] = useState({ catatan: "" });
	const [success, setSuccess] = useState(false);

	const { isAuthenticated, user, isLoading, setLoading } = useAuthStore();
	const cancelMutation = useVolunteerCancelJoinMutation();

	useEffect(() => {
		if (isCancelModalOpen) {
			setFormData({ catatan: selectedCancelParticipant?.catatan || "" });
			setLoading(false);
		}
	}, [isCancelModalOpen, selectedCancelParticipant, setLoading]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((s) => ({ ...s, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e?.preventDefault();
		const eventId = selectedCancelParticipant?.event?.id || selectedCancelParticipant?.event_id;
		if (!eventId) return;

		if (!isAuthenticated) {
			closeCancelModal();
			return;
		}

		try {
			const payload = {
				event_id: eventId,
				catatan: formData.catatan || "",
			};

			await cancelMutation.mutateAsync(payload);

			setSuccess(true);
			setTimeout(() => {
				setSuccess(false);
				setFormData({ catatan: "" });
				setLoading(false);
				closeCancelModal();
			}, 1200);
		} catch (err) {
			console.error("Cancel join error:", err);
		}
	};

	const handleClose = () => {
		if (!isLoading) {
			setFormData({ catatan: "" });
			setSuccess(false);
			setLoading(false);
			closeCancelModal();
		}
	};

	if (!selectedCancelParticipant) return null;

	return (
		<Modal isOpen={isCancelModalOpen} onClose={handleClose} title="Batalkan Pendaftaran" size="md">
			{/* Warning banner: informs user this action may affect acceptance rates */}
			<div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-300 rounded-md flex items-start gap-3">
				<AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
				<div className="text-sm text-amber-800">
					Tindakan ini dapat memengaruhi tingkat penerimaan pendaftaran kamu pada event lain.
					Pastikan kamu yakin sebelum melanjutkan.
				</div>
			</div>

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
					<h3 className="text-2xl font-bold text-gray-900 mb-3">Pembatalan Berhasil</h3>
					<p className="text-gray-600 text-lg leading-relaxed">
						Pendaftaran untuk event <br />
						<span className="font-semibold text-blue-600">
							{selectedCancelParticipant?.event?.judul}
						</span>
					</p>
				</motion.div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-6">
					<p className="text-sm text-gray-700 mb-2">
						Kamu akan membatalkan pendaftaran untuk event{" "}
						<strong>{selectedCancelParticipant?.event?.judul}</strong>.
					</p>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Alasan Pembatalan
						</label>
						<textarea
							name="catatan"
							value={formData.catatan}
							onChange={handleChange}
							rows={4}
							required
							className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
							placeholder="Opsional: alasan pembatalan atau catatan... (maks 1000 karakter)"
						/>
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
							variant="danger"
							size="sm"
							loading={isLoading}
							disabled={isLoading}>
							{isLoading ? "Membatalkan..." : "Ya, batalkan"}
						</DynamicButton>
					</div>
				</form>
			)}
		</Modal>
	);
}
