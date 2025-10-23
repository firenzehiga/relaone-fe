import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as organizationService from "@/_services/organizationService";

/**
 * Ambil semua data organisasi (khusus admin).
 *
 * @returns {UseQueryResult<Array>} List organisasi
 * @features Auto-refetch setiap 1 menit, cache 5 menit
 */
export const useOrganizations = (params = {}) => {
	return useQuery({
		queryKey: ["organizations", params],
		queryFn: async () => {
			const response = await organizationService.getOrganizations(params);
			return response;
		},
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Ambil detail organization berdasarkan ID.
 *
 * @param {string|number} organizationId - ID organization
 * @returns {UseQueryResult<Object>} Data detail organization
 */
export const useOrganizationById = (id) => {
	return useQuery({
		queryKey: ["organizations", id],
		queryFn: async () => {
			const response = await organizationService.getOrganizationById(id);
			return response;
		},
		enabled: !!id,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Buat organisasi baru (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["organizations"]
 */
export const useCreateOrganizationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createOrganization,
		onSuccess: () => {
			queryClient.invalidateQueries(["organizations"]);
		},
	});
};

/**
 * Update organisasi (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @param {Object} variables - Parameter update
 * @param {string|number} variables.organizationId - ID organisasi
 * @param {Object} variables.payload - Data organisasi baru
 * @invalidates ["organizations"]
 */
export const useUpdateOrganizationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ organizationId, payload }) =>
			updateOrganization(organizationId, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries(["formOrganizationPackages"]);
			queryClient.invalidateQueries(["organizations"]);
		},
	});
};

/**
 * Hapus organisasi (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["mentorOrganizations"]
 * @optimisticUpdate Cache ["adminOrganizations"] langsung difilter
 */
export const useDeleteOrganizationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteOrganization,
		onSuccess: (_, id) => {
			queryClient.setQueryData(["adminOrganizations"], (oldData) =>
				oldData.filter((organization) => organization.id !== id)
			);
			queryClient.invalidateQueries(["mentorOrganizations"]);
		},
	});
};
