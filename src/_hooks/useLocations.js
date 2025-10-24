import * as locationService from "@/_services/locationService";
import { useUserRole } from "./useAuth";
import { useQuery } from "@tanstack/react-query";

// === ADMIN HOOKS ===
/**
 * Hook untuk mengambil data locations (admin)
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminLocations = (params = {}) => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin"; // agar jika admin login, tidak fetch locations

	return useQuery({
		queryKey: ["adminLocations", params],
		queryFn: async () => {
			const response = await locationService.adminGetLocations(params);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};
