import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as eventService from "@/services/eventService";

/**
 * Hook untuk mengambil data events
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useEvents = (
	params = {},
	{ role, enabled: optEnabled = true } = {}
) => {
	const enabled = optEnabled && role !== "admin";

	return useQuery({
		queryKey: ["events", params],
		queryFn: async () => {
			const response = await eventService.getEvents(params);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Ambil detail event berdasarkan ID.
 *
 * @param {string|number} eventId - ID event
 * @returns {UseQueryResult<Object>} Data detail event
 */
export const useEventById = (id) => {
	return useQuery({
		queryKey: ["events", id],
		queryFn: async () => {
			const response = await eventService.getEventById(id);
			return response;
		},
		enabled: !!id,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Buat event baru (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["events"]
 */
export const useCreateEventMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: eventService.createEvent,
		onSuccess: () => {
			queryClient.invalidateQueries(["events"]);
		},
	});
};

/**
 * Update event (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @param {Object} variables - Parameter update
 * @param {string|number} variables.eventId - ID event
 * @param {Object} variables.payload - Data event baru
 * @invalidates ["events"]
 */
export const useUpdateEventMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ eventId, payload }) =>
			eventService.updateEvent(eventId, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries(["formEventPackages"]);
			queryClient.invalidateQueries(["events"]);
		},
	});
};

/**
 * Hapus event (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["mentorEvents"]
 * @optimisticUpdate Cache ["adminEvents"] langsung difilter
 */
export const useDeleteEventMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: eventService.deleteEvent,
		onSuccess: (_, id) => {
			queryClient.setQueryData(["adminEvents"], (oldData) =>
				oldData.filter((event) => event.id !== id)
			);
			queryClient.invalidateQueries(["mentorEvents"]);
		},
	});
};
