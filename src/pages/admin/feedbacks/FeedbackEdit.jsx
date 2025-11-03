import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
	useAdminFeedbackById,
	useAdminFeedbacks,
	useAdminUpdateFeedbackMutation,
} from "@/_hooks/useFeedbacks";
import RatingStars from "@/components/ui/RatingStars";
import Skeleton from "@/components/ui/Skeleton";
import { parseApiError } from "@/utils";
import Button from "@/components/ui/Button";
import NotFound from "@/components/fallback/NotFound";
import { useAuthStore } from "@/_hooks/useAuth";

export default function AdminFeedbackEdit() {
	const { id } = useParams();
	const navigate = useNavigate();
	const isDirty = useRef(false); // untuk melacak apakah form telah diubah, biar pas udah edit gak ketimpa data lama yang dijalanin useeffect lagi

	const {
		data: feedbacks = [],
		isLoading: feedbacksLoading,
		error: feedbacksError,
	} = useAdminFeedbacks();
	const updateMutation = useAdminUpdateFeedbackMutation();

	const [formData, setFormData] = useState({ komentar: "", rating: 0 });
	const { isLoading } = useAuthStore();

	const { data: showFeedback, isLoading: showFeedbackLoading } =
		useAdminFeedbackById(id);
	useEffect(() => {
		if (!showFeedback) return;
		setFormData((prev) => {
			// don't overwrite if user already started editing
			if (prev.komentar) return prev;
			return {
				komentar: showFeedback.komentar || "",
				rating: Number(showFeedback.rating) || 0,
			};
		});
	}, [showFeedback]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		isDirty.current = true;
		setFormData((s) => ({ ...s, [name]: value }));
	};

	const handleRatingChange = (value) => {
		isDirty.current = true;
		setFormData((s) => ({ ...s, rating: Number(value) }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const payload = new FormData();
		payload.append("_method", "PUT");
		payload.append("komentar", formData.komentar);
		payload.append("rating", String(formData.rating));

		updateMutation.mutateAsync({ id, data: payload });

		isDirty.current = false;
	};

	if (showFeedbackLoading) return <Skeleton.FormSkeleton title="Loading..." />;
	if (feedbacksError)
		return <div className="text-red-600">Error: {feedbacksError.message}</div>;
	if (!showFeedback) return <NotFound />;
	return (
		<div className="max-w-6xl mx-auto p-6">
			<div
				className="bg-white shadow-lg rounded-lg p-6"
				style={{ minHeight: 475, width: 900 }}>
				<header className="mb-6">
					<h1 className="text-2xl font-semibold text-gray-900">
						Edit Feedback
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Ubah komentar dan rating feedback.
					</p>
				</header>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Rating
						</label>
						<div className="mt-2">
							<RatingStars
								rating={formData.rating}
								maxRating={5}
								size="md"
								interactive={true}
								onRatingChange={handleRatingChange}
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Komentar
						</label>
						<textarea
							name="komentar"
							value={formData.komentar}
							onChange={handleChange}
							rows={6}
							required
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="Tulis komentar..."
						/>
					</div>

					<div className="flex items-center justify-end gap-3">
						<Button
							type="button"
							disabled={isLoading}
							variant="outline"
							onClick={() => navigate("/admin/feedbacks")}>
							Batal
						</Button>
						<Button
							type="submit"
							variant="success"
							loading={isLoading}
							disabled={isLoading}>
							{isLoading ? "Menyimpan..." : "Simpan Feedback"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
