import * as feedbackService from "@/_services/feedbackService";
import { useUserRole } from "./useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
