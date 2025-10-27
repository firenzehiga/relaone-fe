import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as organizationService from "@/_services/organizationService";
import { useUserRole } from "./useAuth";

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
 * Ambil semua data organisasi (khusus admin).
 *
 * @returns {UseQueryResult<Array>} List organisasi
 * @features Auto-refetch setiap 1 menit, cache 5 menit
 */
export const useAdminOrganizations = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";
	return useQuery({
		queryKey: ["adminOrganizations"],
		queryFn: async () => {
			const response = await organizationService.adminGetOrganizations();
			return response;
		},
		enabled,
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
export const useAdminOrganizationById = (id) => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin" && !!id;
	return useQuery({
		queryKey: ["adminOrganizations", id],
		queryFn: async () => {
			const response = await organizationService.getOrganizationById(id);
			return response;
		},
		enabled,
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
export const useAdminCreateOrganizationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: organizationService.adminCreateOrganization,
		onSuccess: () => {
			queryClient.invalidateQueries(["adminOrganizations"]);
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
export const useAdminUpdateOrganizationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ organizationId, payload }) =>
			updateOrganization(organizationId, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries(["formOrganizationPackages"]);
			queryClient.invalidateQueries(["adminOrganizations"]);
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
export const useAdminDeleteOrganizationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: organizationService.adminDeleteOrganization,
		onSuccess: (_, id) => {
			queryClient.setQueryData(["adminOrganizations"], (oldData) =>
				oldData.filter((organization) => organization.id !== id)
			);
			queryClient.invalidateQueries(["adminOrganizations"]);
		},
	});
};
