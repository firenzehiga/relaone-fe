import { useQuery } from "@tanstack/react-query";
import * as userService from "../_services/userService";
import { useUserRole } from "./useAuth";

// === PUBLIC HOOKS ===
/**
 *
 * Hook untuk mengambil data profile user saat ini
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
// export const useUserProfile = () => {
// 	return useQuery({
// 		queryKey: ["user", "profile"],
// 		queryFn: async () => {
// 			const response = await userService.getUserProfile();
// 			return response;
// 		},
// 		staleTime: 5 * 60 * 1000,
// 		retry: 1,
// 	});
// };

/**
 * Hook untuk mengambil data pendaftaran user saat ini
 */
// export const useUserRegistrations = () => {
// 	return useQuery({
// 		queryKey: ["user", "registrations"],
// 		queryFn: async () => {
// 			const response = await userService.getUserRegistrations();
// 			return response;
// 		},
// 		staleTime: 3 * 60 * 1000,
// 		retry: 1,
// 	});
// };

// === ADMIN HOOKS ===
/**
 * Hook untuk mengambil data semua users (khusus admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminUsers = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";

	return useQuery({
		queryKey: ["adminUsers"],
		queryFn: async () => {
			const response = await userService.adminGetUsers();
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};
