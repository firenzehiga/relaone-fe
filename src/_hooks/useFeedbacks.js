import * as feedbackService from "@/_services/feedbackService";
import { useAuthStore, useUserRole } from "./useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseApiError, toQueryBuilderParams } from "@/utils";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/components/ui/Toast";

// === PUBLIC HOOKS ===
/**
 * Hook untuk mengambil data feedbacks
 * @returns {Object} Query result dengan data feedbacks
 */
export const useFeedbacks = () => {
	return useQuery({
		queryKey: ["feedbacks"],
		queryFn: async () => {
			const response = await feedbackService.getFeedbacks();
			return response;
		},
		// staleTime: 10 * 60 * 1000, // 10 minutes (categories jarang berubah)
		retry: 1,
	});
};

// === VOLUNTEER HOOKS ===

/**
 * Batalkan Join event untuk participant.
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["volunteer", "sendFeedback"]
 */
export const useVolunteerSendFeedbackMutation = () => {
	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["volunteer", "sendFeedback"],
		mutationFn: feedbackService.volunteerSendFeedback,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async (_data, variables) => {
			const eventId = variables?.event_id || variables?.id;

			// Invalidate kueri yang relevan setelah batal join
			// - detailEvent (untuk event detail page)
			// - events (list of events, to update counters)
			// - participants (participant lists used on activity pages)
			// - volunteerHistory (the volunteer's own history page)
			if (eventId) {
				queryClient.invalidateQueries({
					queryKey: ["detailEvent", eventId],
					refetchType: "active",
				});
			}

			queryClient.invalidateQueries({
				queryKey: ["events"],
				refetchType: "active",
			});

			// Invalidate participants listing and volunteer history so pages that
			// show the user's registration state update correctly.
			queryClient.invalidateQueries({ queryKey: ["participants"] });
			queryClient.invalidateQueries({ queryKey: ["volunteerHistory"] });

			// Loading will be handled by the component after animation completes
			// setLoading will be called manually in the component if needed

			// Show success toast
			// showToast({
			// 	type: "success",
			// 	title: "Terima kasih!",
			// 	message: "Feedback berhasil dikirim",
			// 	duration: 3000,
			// 	position: "top-right",
			// });
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Gagal mengirim feedback";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Send feedback error:", error);
		},
	});
};

// === ADMIN HOOKS ===
/**
 * Hook untuk mengambil data feedbacks (admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminFeedbacks = (page = 1, limit = 10, search = "") => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin"; // agar jika admin login, tidak fetch feedbacks

	const query = useQuery({
		queryKey: ["adminFeedbacks", page, limit, search],
		queryFn: async () => {
			const params = toQueryBuilderParams({ page, limit, search });

			const response = await feedbackService.adminGetFeedbacks(params);
			return response;
		},
		enabled,
		keepPreviousData: true, // Menjaga data sebelumnya saat fetching
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});

	return {
		feedbacks: query.data?.data || [],
		pagination: query.data?.pagination || {},
		isLoading: query.isLoading,
		error: query.error,
		isFetching: query.isFetching,
	};
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
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Feedback berhasil diperbarui",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Update location failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali atau Coba lagi.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
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
			queryClient.invalidateQueries(["adminFeedbacks"]);
		},
	});
};

/** Hook untuk bulk deleting feedbacks (admin) */
export const useAdminBulkDeleteFeedbacks = () => {
	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationFn: (ids) => feedbackService.adminBulkDeleteFeedbacks(ids),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries(["adminFeedbacks"]);
			setLoading(false);

			const msg =
				(data &&
					(data.message ||
						`Berhasil menghapus ${data.deleted_count ?? variables.length} feedback(s)`)) ||
				"Berhasil menghapus feedbacks";

			showToast({
				type: "success",
				title: "Berhasil!",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Delete bulk feedback failed";
			if (setError) setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali atau coba lagi.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Bulk delete feedback error:", error);
		},
	});
};

// === ORGANIZATION HOOKS ===
/**
 * Hook untuk mengambil data feedbacks (organization)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useOrgFeedbacks = (page = 1, limit = 10, search = "") => {
	const currentRole = useUserRole();
	const enabled = currentRole === "organization";

	const query = useQuery({
		queryKey: ["orgFeedbacks", page, limit, search],
		queryFn: async () => {
			const params = toQueryBuilderParams({ page, limit, search });

			const response = await feedbackService.orgGetFeedbacks(params);
			return response;
		},
		enabled,
		keepPreviousData: true, // Menjaga data sebelumnya saat fetching
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});

	return {
		feedbacks: query.data?.data || [],
		pagination: query.data?.pagination || {},
		isLoading: query.isLoading,
		error: query.error,
		isFetching: query.isFetching,
	};
};
