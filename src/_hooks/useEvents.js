import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as eventService from "@/_services/eventService";
import { useUserRole } from "./useAuth";

// === PUBLIC HOOKS ===
/**
 * Hook untuk mengambil data events
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useEvents = (params = {}) => {
	const currentRole = useUserRole();
	const enabled = currentRole !== "admin" && currentRole !== "organization"; // supaya kalo admin login, ga fetch events

	return useQuery({
		queryKey: ["events"],
		queryFn: async () => {
			const response = await eventService.getEvents(params);
			return response;
		},
		enabled,
		// staleTime: 1 * 60 * 1000,
		// cacheTime: 5 * 60 * 1000,
		// retry: 1,
	});
};

/**
 * Ambil detail event berdasarkan ID.
 *
 * @param {string|number} eventId - ID event
 * @returns {UseQueryResult<Object>} Data detail event
 */
export const useEventById = (id) => {
	const currentRole = useUserRole();
	const enabled =
		currentRole !== "admin" && currentRole !== "organization" && !!id; // supaya kalo admin login, ga fetch events

	return useQuery({
		queryKey: ["detailEvent", id],
		queryFn: async () => {
			const response = await eventService.getEventById(id);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

// === ADMIN HOOKS ===
/**
 * Hook untuk mengambil data events (admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminEvents = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin"; // supaya kalo admin login, ga fetch events

	return useQuery({
		queryKey: ["adminEvents"],
		queryFn: async () => {
			const response = await eventService.adminGetEvents();
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Hook untuk mengambil data events berdasarkan ID (admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminEventById = (id) => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin" && !!id;

	return useQuery({
		queryKey: ["adminEvents", id],
		queryFn: async () => {
			const response = await eventService.adminGetEventById(id);
			return response;
		},
		enabled,
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
export const useAdminCreateEventMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: eventService.adminCreateEvent,
		onSuccess: () => {
			queryClient.invalidateQueries(["adminEvents"]);
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
 * @param {Object} variables.data - Data event baru
 * @invalidates ["events"]
 */
export const useAdminUpdateEventMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => eventService.adminUpdateEvent(id, data),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries(["adminEvents"]);
			queryClient.invalidateQueries(["adminEvents", id]);
			// query key publik
			queryClient.invalidateQueries(["events"]);
			queryClient.invalidateQueries(["detailEvent", id]);
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
export const useAdminDeleteEventMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: eventService.adminDeleteEvent,
		onSuccess: (_, id) => {
			queryClient.setQueryData(["adminEvents"], (oldData) =>
				oldData.filter((event) => event.id !== id)
			);
			queryClient.invalidateQueries(["adminEvents"]);
			queryClient.invalidateQueries(["events"]);
		},
	});
};

// === ORGANIZATION HOOKS ===
/**
 * Hook untuk mengambil data events (organization)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useOrgEvents = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "organization";

	return useQuery({
		queryKey: ["orgEvents"],
		queryFn: async () => {
			const response = await eventService.orgGetEvents();
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Hapus event (organization).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["mentorEvents"]
 * @optimisticUpdate Cache ["orgEvents"] langsung difilter
 */
export const useOrgDeleteEventMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: eventService.orgDeleteEvent,
		onSuccess: (_, id) => {
			queryClient.setQueryData(["orgEvents"], (oldData) =>
				oldData.filter((event) => event.id !== id)
			);
			queryClient.invalidateQueries(["orgEvents"]);
			queryClient.invalidateQueries(["events"]);
		},
	});
};
