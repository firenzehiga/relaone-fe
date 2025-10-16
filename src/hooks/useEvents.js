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
		queryFn: async () => {
			const response = await eventService.getEvents(params);
			return response;
		},
		staleTime: 1 * 60 * 1000, // 1 minute
		retry: 1,
	});
};
