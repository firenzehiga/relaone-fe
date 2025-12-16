import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as organizationService from "@/_services/organizationService";
import { useAuthStore, useUserRole } from "@/_hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { parseApiError, toQueryBuilderParams } from "@/utils";
import { showToast } from "@/components/ui/Toast";

/**
 * Ambil semua data organisasi (khusus admin).
 *
 * @returns {UseQueryResult<Array>} List organisasi
 * @features Auto-refetch setiap 1 menit, cache 5 menit
 */
export const useOrganizations = (status_verifikasi = "") => {
	return useQuery({
		queryKey: ["organizations", status_verifikasi],
		queryFn: async () => {
			const params = toQueryBuilderParams({ status_verifikasi });

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
export const useOrganizationById = (id, page = 1, limit = 10) => {
	return useQuery({
		queryKey: ["organizations", id, page, limit],
		queryFn: async () => {
			const response = await organizationService.getOrganizationById(id, { page, limit });
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
export const useAdminOrganizations = (page = 1, limit = 10, search = "") => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";

	const query = useQuery({
		queryKey: ["adminOrganizations", page, limit, search],
		queryFn: async () => {
			const params = toQueryBuilderParams({ page, limit, search });

			const response = await organizationService.adminGetOrganizations(params);
			return response;
		},
		enabled,
		keepPreviousData: true, // Menjaga data sebelumnya saat fetching
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});

	return {
		organizations: query.data?.data || [],
		pagination: query.data?.pagination || {},
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		isFetching: query.isFetching,
	};
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
			const response = await organizationService.adminGetOrganizationById(id);
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
				tipText: "Periksa kembali atau Coba lagi.",
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
		mutationFn: ({ id, data }) => organizationService.adminUpdateOrganization(id, data),
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
				tipText: "Periksa kembali atau Coba lagi.",
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
			queryClient.invalidateQueries(["adminOrganizations"]);
		},
	});
};
