import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as organizationService from "@/_services/organizationService";
import { useAuthStore, useUserRole } from "@/_hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { parseApiError } from "@/utils";
import { showToast } from "@/components/ui/Toast";

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
export const useAdminOrganizations = (params = {}) => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";
	return useQuery({
		queryKey: ["adminOrganizations"],
		queryFn: async () => {
			const response = await organizationService.adminGetOrganizations(params);
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
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["adminOrganizations", "create"],
		mutationFn: organizationService.adminCreateOrganization,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries(["adminOrganizations"]);

			navigate("/admin/organizations");

			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Organisasi berhasil dibuat",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Create organization failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali logic yang Anda buat.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Create organization error:", error);
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
	const navigate = useNavigate();

	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["adminOrganizations", "update"],
		mutationFn: ({ id, data }) =>
			organizationService.adminUpdateOrganization(id, data),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async (_, id) => {
			await queryClient.invalidateQueries(["adminOrganizations"]);
			navigate("/admin/organizations");

			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Organisasi berhasil diperbarui",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Update organization failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali logic yang Anda buat.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Update organization error:", error);
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
