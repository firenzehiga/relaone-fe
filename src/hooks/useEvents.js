import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as eventService from "../services/eventService";

/**
 * Custom hooks untuk Events menggunakan TanStack Query
 * Pattern yang sama dengan useCourse.js, useMentors.js
 */

/**
 * Hook untuk mengambil list events
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useEvents = (params = {}) => {
	return useQuery({
		queryKey: ["events", params],
		queryFn: () => eventService.getEvents(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
	});
};

/**
 * Hook untuk mengambil detail event berdasarkan ID
 * @param {string|number} id - ID event
 * @returns {Object} Query result dengan data event
 */
export const useEvent = (id) => {
	return useQuery({
		queryKey: ["events", id],
		queryFn: () => eventService.getEventById(id),
		enabled: !!id, // Hanya jalankan query jika ID ada
		staleTime: 5 * 60 * 1000,
		retry: 2,
	});
};

/**
 * Hook untuk membuat event baru
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useCreateEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: eventService.createEvent,
		onSuccess: () => {
			// Invalidate dan refetch events list
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
		onError: (error) => {
			console.error("Failed to create event:", error);
		},
	});
};

/**
 * Hook untuk update event
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useUpdateEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => eventService.updateEvent(id, data),
		onSuccess: (data, variables) => {
			// Invalidate events list dan specific event
			queryClient.invalidateQueries({ queryKey: ["events"] });
			queryClient.invalidateQueries({ queryKey: ["events", variables.id] });
		},
		onError: (error) => {
			console.error("Failed to update event:", error);
		},
	});
};

/**
 * Hook untuk delete event
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useDeleteEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: eventService.deleteEvent,
		onSuccess: () => {
			// Invalidate events list
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
		onError: (error) => {
			console.error("Failed to delete event:", error);
		},
	});
};

/**
 * Hook untuk join event sebagai volunteer
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useJoinEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ eventId, userData }) =>
			eventService.joinEvent(eventId, userData),
		onSuccess: (data, variables) => {
			// Invalidate events untuk update participant count
			queryClient.invalidateQueries({ queryKey: ["events"] });
			queryClient.invalidateQueries({
				queryKey: ["events", variables.eventId],
			});
			// Invalidate user registrations
			queryClient.invalidateQueries({ queryKey: ["user", "registrations"] });
		},
		onError: (error) => {
			console.error("Failed to join event:", error);
		},
	});
};
