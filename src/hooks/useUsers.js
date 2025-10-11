import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as userService from "../services/userService";

/**
 * Custom hooks untuk Users menggunakan TanStack Query
 * Pattern yang sama dengan struktur hooks yang Anda gunakan
 */

/**
 * Hook untuk mengambil list users (admin only)
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Object} Query result dengan data users
 */
export const useUsers = (params = {}) => {
	return useQuery({
		queryKey: ["users", params],
		queryFn: () => userService.getUsers(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
	});
};

/**
 * Hook untuk mengambil detail user berdasarkan ID
 * @param {string|number} id - ID user
 * @returns {Object} Query result dengan data user
 */
export const useUser = (id) => {
	return useQuery({
		queryKey: ["users", id],
		queryFn: () => userService.getUserById(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
		retry: 2,
	});
};

/**
 * Hook untuk mengambil user registrations (events yang diikuti)
 * @param {string|number} userId - ID user
 * @returns {Object} Query result dengan data registrations
 */
export const useUserRegistrations = (userId) => {
	return useQuery({
		queryKey: ["users", userId, "registrations"],
		queryFn: () => userService.getUserRegistrations(userId),
		enabled: !!userId,
		staleTime: 3 * 60 * 1000, // 3 minutes
		retry: 2,
	});
};

/**
 * Hook untuk mengambil user activity history
 * @param {string|number} userId - ID user
 * @returns {Object} Query result dengan data activity history
 */
export const useUserActivity = (userId) => {
	return useQuery({
		queryKey: ["users", userId, "activity"],
		queryFn: () => userService.getUserActivity(userId),
		enabled: !!userId,
		staleTime: 5 * 60 * 1000,
		retry: 2,
	});
};

/**
 * Hook untuk update user (admin only)
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => userService.updateUser(id, data),
		onSuccess: (data, variables) => {
			// Invalidate users list dan specific user
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
		},
		onError: (error) => {
			console.error("Failed to update user:", error);
		},
	});
};

/**
 * Hook untuk delete user (admin only)
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: userService.deleteUser,
		onSuccess: () => {
			// Invalidate users list
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (error) => {
			console.error("Failed to delete user:", error);
		},
	});
};

/**
 * Hook untuk verify user (admin only)
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useVerifyUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: userService.verifyUser,
		onSuccess: (data, variables) => {
			// Invalidate users list dan specific user
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["users", variables] });
		},
		onError: (error) => {
			console.error("Failed to verify user:", error);
		},
	});
};

/**
 * Hook untuk ban/unban user (admin only)
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useBanUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, action }) => userService.banUser(userId, action),
		onSuccess: (data, variables) => {
			// Invalidate users list dan specific user
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
		},
		onError: (error) => {
			console.error("Failed to ban/unban user:", error);
		},
	});
};
