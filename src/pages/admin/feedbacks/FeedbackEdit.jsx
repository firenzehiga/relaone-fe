import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
	useAdminFeedbackById,
	useAdminFeedbacks,
	useAdminUpdateFeedbackMutation,
} from "@/_hooks/useFeedbacks";
import RatingStars from "@/components/ui/RatingStars";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import NotFound from "@/components/fallback/NotFound";
import { useAuthStore } from "@/_hooks/useAuth";
import { useForm } from "react-hook-form";

export default function AdminFeedbackEdit() {
	const { id } = useParams();
	const navigate = useNavigate();

	const updateMutation = useAdminUpdateFeedbackMutation();

	const { register, handleSubmit, reset, watch, setValue, getValues, formState } = useForm({
		defaultValues: { komentar: "", rating: 0 },
	});
	const { isLoading } = useAuthStore();

	const {
		data: showFeedback,
		isLoading: showFeedbackLoading,
		error: feedbacksError,
	} = useAdminFeedbackById(id);
	useEffect(() => {
		if (!showFeedback) return;
		// don't overwrite if user already started editing
		if (getValues("komentar")) return;
		reset({
			komentar: showFeedback.komentar || "",
			rating: Number(showFeedback.rating) || 0,
		});
	}, [showFeedback]);

	const onSubmit = (data) => {
		const payload = new FormData();
		payload.append("_method", "PUT");
		payload.append("komentar", data.komentar || "");
		payload.append("rating", String(data.rating ?? 0));

		updateMutation.mutateAsync({ id, data: payload });
	};

	if (showFeedbackLoading) return <Skeleton.FormSkeleton title="Loading..." />;
	if (feedbacksError) return <div className="text-red-600">Error: {feedbacksError.message}</div>;
	if (!showFeedback) return <NotFound />;
	return (
		<div className="w-full mx-auto p-4 sm:p-6 max-w-6xl min-h-[calc(100vh-4rem)]">
			<div className="bg-white shadow-xl rounded-lg p-4 sm:p-6">
				<header className="mb-6">
					<h1 className="text-2xl font-semibold text-gray-900">Edit Feedback</h1>
					<p className="text-sm text-gray-500 mt-1">Ubah komentar dan rating feedback.</p>
				</header>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div>
						<label htmlFor="rating" className="block text-sm font-medium text-gray-700">
							Rating <span className="text-red-500">*</span>
						</label>
						<div className="mt-2">
							<input type="hidden" id="rating" {...register("rating")} />
							<RatingStars
								rating={watch("rating")}
								maxRating={5}
								size="md"
								interactive={true}
								onRatingChange={(v) => setValue("rating", Number(v), { shouldDirty: true })}
							/>
						</div>
					</div>

					<div>
						<label htmlFor="komentar" className="block text-sm font-medium text-gray-700">
							Komentar
						</label>
						<textarea
							id="komentar"
							{...register("komentar", { required: true })}
							rows={6}
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
						<Button type="submit" variant="success" loading={isLoading} disabled={isLoading}>
							{isLoading ? "Menyimpan..." : "Simpan Feedback"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
