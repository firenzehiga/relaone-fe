import * as feedbackService from "@/_services/feedbackService";
import { useAuthStore, useUserRole } from "./useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseApiError } from "@/utils";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// === ADMIN HOOKS ===
/**
 * Hook untuk mengambil data feedbacks (admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminFeedbacks = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin"; // agar jika admin login, tidak fetch feedbacks

	return useQuery({
		queryKey: ["adminFeedbacks"],
		queryFn: async () => {
			const response = await feedbackService.adminGetFeedbacks();
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Hook untuk mengambil data feedback berdasarkan ID (admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminFeedbackById = (id) => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin" && !!id;

	return useQuery({
		queryKey: ["adminFeedbacks", id],
		queryFn: async () => {
			const response = await feedbackService.adminGetFeedbackById(id);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Update feedback (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @param {Object} variables - Parameter update
 * @param {string|number} variables.feedbackId - ID feedback
 * @param {Object} variables.data - Data feedback baru
 * @invalidates ["feedbacks"]
 */
export const useAdminUpdateFeedbackMutation = () => {
	const navigate = useNavigate();

	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["adminFeedbacks", "update"],
		mutationFn: ({ id, data }) => feedbackService.adminUpdateFeedback(id, data),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async (_, id) => {
			await queryClient.invalidateQueries(["adminFeedbacks"]);
			navigate("/admin/feedbacks");

			setLoading(false);
			toast.success("Feedback berhasil diperbarui", { duration: 2000 });
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Update location failed";
			setError(msg);
			toast.error(msg, { duration: 4000 });
			console.error("Update location error:", error);
		},
	});
};

/**
 * Hapus feedback (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["adminFeedbacks"]
 * @optimisticUpdate Cache ["adminFeedbacks"] langsung difilter
 */
export const useAdminDeleteFeedbackMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: feedbackService.adminDeleteFeedback,
		onSuccess: (_, id) => {
			queryClient.setQueryData(["adminFeedbacks"], (oldData) =>
				oldData.filter((feedback) => feedback.id !== id)
			);
			queryClient.invalidateQueries(["adminFeedbacks"]);
		},
	});
};

// === ORGANIZATION HOOKS ===
/**
 * Hook untuk mengambil data feedbacks (organization)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useOrgFeedbacks = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "organization";

	return useQuery({
		queryKey: ["orgFeedbacks"],
		queryFn: async () => {
			const response = await feedbackService.orgGetFeedbacks();
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};
