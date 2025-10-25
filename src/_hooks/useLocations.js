import * as locationService from "@/_services/locationService";
import { useUserRole } from "./useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// === ADMIN HOOKS ===
/**
 * Hook untuk mengambil data locations (admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminLocations = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin"; // agar jika admin login, tidak fetch locations

	return useQuery({
		queryKey: ["adminLocations"],
		queryFn: async () => {
			const response = await locationService.adminGetLocations();
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Hapus location (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["adminLocations"]
 * @optimisticUpdate Cache ["adminLocations"] langsung difilter
 */
export const useAdminDeleteLocationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: locationService.adminDeleteLocation,
		onSuccess: (_, id) => {
			queryClient.setQueryData(["adminLocations"], (oldData) =>
				oldData.filter((location) => location.id !== id)
			);
			queryClient.invalidateQueries(["adminLocations"]);
		},
	});
};
