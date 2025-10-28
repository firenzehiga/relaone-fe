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
 * Ambil detail lokasi berdasarkan ID.
 *
 * @param {string|number} locationId - ID lokasi
 * @returns {UseQueryResult<Object>} Data detail lokasi
 */
export const useAdminLocationById = (id) => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin" && !!id;
	return useQuery({
		queryKey: ["adminLocations", id],
		queryFn: async () => {
			const response = await locationService.adminGetLocationById(id);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Buat location baru (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["locations"]
 */
export const useAdminCreateLocationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: locationService.adminCreateLocation,
		onSuccess: () => {
			queryClient.invalidateQueries(["adminLocations"]);
		},
	});
};

/**
 * Update lokasi (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @param {Object} variables - Parameter update
 * @param {string|number} variables.locationId - ID lokasi
 * @param {Object} variables.payload - Data lokasi baru
 */
export const useAdminUpdateLocationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => locationService.adminUpdateLocation(id, data),
		onSuccess: async (_, id) => {
			await queryClient.invalidateQueries(["adminLocations"]);
			await queryClient.invalidateQueries(["adminLocations", id]);
		},
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
