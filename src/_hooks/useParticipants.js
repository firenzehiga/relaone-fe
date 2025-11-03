import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as eventParticipantService from "@/_services/eventParticipantService";
import { useAuthStore, useUserRole } from "./useAuth";
import { useNavigate } from "react-router-dom";
import { parseApiError } from "@/utils";
import toast from "react-hot-toast";

/** PUBLIC HOOKS
 *
 * Hook untuk mengambil data event participants
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useParticipants = (params = {}) => {
	const currentRole = useUserRole();
	const enabled = currentRole !== "admin" && currentRole !== "organization"; // supaya kalo admin login, ga fetch events

	return useQuery({
		queryKey: ["participants", params],
		queryFn: async () => {
			const response = await eventParticipantService.getParticipants(params);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 100,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/** VOLUNTEER HOOKS
 * Join event sebagai participant.
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["participants"]
 */
export const useVolunteerJoinEventMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: eventParticipantService.volunteerJoinEvent,
		// onSuccess gets (data, variables)
		onSuccess: async (_data, variables) => {
			const eventId = variables?.id;
			console.log("Invalidating queries after joining event:", eventId);
			if (eventId) {
				// sesuaikan key dengan useEventById (mis. ["detailEvent", id])
				await queryClient.invalidateQueries(["detailEvent", eventId]);
			}
			queryClient.invalidateQueries(["participants"]);
			queryClient.invalidateQueries(["adminParticipants"]);
			queryClient.invalidateQueries(["events"]);
			queryClient.invalidateQueries(["adminEvents"]);
		},
	});
};

/** ADMIN HOOKS
 *
 * Hook untuk mengambil data event participants hanya untuk admin
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminParticipants = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";

	return useQuery({
		queryKey: ["adminParticipants"],
		queryFn: async () => {
			const response = await eventParticipantService.adminGetParticipants();
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Ambil detail participant berdasarkan ID.
 *
 * @param {string|number} participantId - ID participant
 * @returns {UseQueryResult<Object>} Data detail participant
 */
export const useAdminParticipantById = (id) => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin" && !!id;
	return useQuery({
		queryKey: ["adminParticipants", id],
		queryFn: async () => {
			const response = await eventParticipantService.adminGetParticipantById(
				id
			);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Buat participant baru (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["participants"]
 */
export const useAdminCreateParticipantMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["adminParticipants", "create"],
		mutationFn: eventParticipantService.adminCreateParticipant,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries(["adminParticipants"]);
			navigate("/admin/event-participants");
			setLoading(false);
			toast.success("Participant berhasil dibuat", { duration: 2000 });
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Create location failed";
			setError(msg);
			toast.error(msg, { duration: 4000 });
			console.error("Create location error:", error);
		},
	});
};

/**
 * Update participant (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @param {Object} variables - Parameter update
 * @param {string|number} variables.participantId - ID participant
 * @param {Object} variables.payload - Data participant baru
 */
export const useAdminUpdateParticipantMutation = () => {
	const navigate = useNavigate();

	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["adminParticipants", "update"],
		mutationFn: ({ id, data }) =>
			eventParticipantService.adminUpdateParticipant(id, data),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async (_, id) => {
			await queryClient.invalidateQueries(["adminParticipants"]);
			queryClient.invalidateQueries(["adminParticipants", id]);
			navigate("/admin/event-participants");

			setLoading(false);
			toast.success("Participant berhasil diperbarui", { duration: 2000 });
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Update participant failed";
			setError(msg);
			toast.error(msg, { duration: 4000 });
			console.error("Update participant error:", error);
		},
	});
};

/**
 * Hapus participant (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["adminParticipants"]
 * @optimisticUpdate Cache ["adminParticipants"] langsung difilter
 */
export const useAdminDeleteParticipantMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: eventParticipantService.adminDeleteParticipant,
		onSuccess: (_, id) => {
			queryClient.setQueryData(["adminParticipants"], (oldData) =>
				oldData.filter((participant) => participant.id !== id)
			);
			queryClient.invalidateQueries(["adminParticipants"]);
		},
	});
};

/** ORGANIZATION HOOKS
 *
 * Hook untuk mengambil data event participants hanya untuk organization
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useOrgParticipants = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "organization";

	return useQuery({
		queryKey: ["orgParticipants"],
		queryFn: async () => {
			const response = await eventParticipantService.orgGetParticipants();
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};
