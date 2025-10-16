import { useQuery } from "@tanstack/react-query";
import * as organizationService from "../services/organizationService";

/**
 * Hook untuk mengambil list organizations
 */
export const useOrganizations = (params = {}) => {
	return useQuery({
		queryKey: ["organizations", params],
		queryFn: async () => {
			const response = await organizationService.getOrganizations(params);
			return response;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 1,
	});
};

/**
 * Hook untuk mengambil detail organization berdasarkan ID
 */
export const useOrganization = (id) => {
	return useQuery({
		queryKey: ["organizations", id],
		queryFn: () => organizationService.getOrganizationById(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});
};
