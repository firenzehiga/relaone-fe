import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as organizationService from "../services/organizationService";

/**
 * Custom hooks untuk Organizations menggunakan TanStack Query
 * Pattern yang sama dengan struktur hooks yang Anda gunakan
 */

/**
 * Hook untuk mengambil list organizations
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Object} Query result dengan data organizations
 */
export const useOrganizations = (params = {}) => {
	return useQuery({
		queryKey: ["organizations", params],
		queryFn: () => organizationService.getOrganizations(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
	});
};

/**
 * Hook untuk mengambil detail organization berdasarkan ID
 * @param {string|number} id - ID organization
 * @returns {Object} Query result dengan data organization
 */
export const useOrganization = (id) => {
	return useQuery({
		queryKey: ["organizations", id],
		queryFn: () => organizationService.getOrganizationById(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
		retry: 2,
	});
};

/**
 * Hook untuk mengambil events yang dimiliki oleh organization
 * @param {string|number} organizationId - ID organization
 * @returns {Object} Query result dengan data events dari organization
 */
export const useOrganizationEvents = (organizationId) => {
	return useQuery({
		queryKey: ["organizations", organizationId, "events"],
		queryFn: () => organizationService.getOrganizationEvents(organizationId),
		enabled: !!organizationId,
		staleTime: 5 * 60 * 1000,
		retry: 2,
	});
};

/**
 * Hook untuk membuat organization baru
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useCreateOrganization = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: organizationService.createOrganization,
		onSuccess: () => {
			// Invalidate dan refetch organizations list
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
		onError: (error) => {
			console.error("Failed to create organization:", error);
		},
	});
};

/**
 * Hook untuk update organization
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useUpdateOrganization = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) =>
			organizationService.updateOrganization(id, data),
		onSuccess: (data, variables) => {
			// Invalidate organizations list dan specific organization
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
			queryClient.invalidateQueries({
				queryKey: ["organizations", variables.id],
			});
		},
		onError: (error) => {
			console.error("Failed to update organization:", error);
		},
	});
};

/**
 * Hook untuk delete organization
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useDeleteOrganization = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: organizationService.deleteOrganization,
		onSuccess: () => {
			// Invalidate organizations list
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
		onError: (error) => {
			console.error("Failed to delete organization:", error);
		},
	});
};
