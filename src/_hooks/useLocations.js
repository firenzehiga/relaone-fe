import * as locationService from "@/_services/locationService";
import { useAuthStore, useUserRole } from "./useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { parseApiError, toQueryBuilderParams } from "@/utils";
import { showToast } from "@/components/ui/Toast";

// === ADMIN HOOKS ===
/**
 * Hook untuk mengambil data locations (admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminLocations = (page = 1, limit = 10, search = "") => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";

	const query = useQuery({
		queryKey: ["adminLocations", page, limit, search],
		queryFn: async () => {
			const params = toQueryBuilderParams({ page, limit, search });

			const response = await locationService.adminGetLocations(params);
			return response;
		},
		enabled,
		keepPreviousData: true, // Menjaga data sebelumnya saat fetching
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});

	return {
		locations: query.data?.data || [],
		pagination: query.data?.pagination || {},
		isLoading: query.isLoading,
		error: query.error,
		isFetching: query.isFetching,
	};
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
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["adminLocations", "create"],
		mutationFn: locationService.adminCreateLocation,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries(["adminLocations"]);
			navigate("/admin/locations");

			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Lokasi berhasil dibuat",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Create location failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali atau Coba lagi.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Create location error:", error);
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
	const navigate = useNavigate();

	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["adminLocations", "update"],
		mutationFn: ({ id, data }) => locationService.adminUpdateLocation(id, data),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async (_, id) => {
			await queryClient.invalidateQueries(["adminLocations"]);
			navigate("/admin/locations");

			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Lokasi berhasil diperbarui",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Update location failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali atau Coba lagi.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Update location error:", error);
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
			queryClient.invalidateQueries(["adminLocations"]);
		},
	});
};

// === ORGANIZATION HOOKS ===
/**
 * Hook untuk mengambil data locations (organization)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useOrgLocations = (page = 1, limit = 10, search = "") => {
	const currentRole = useUserRole();
	const enabled = currentRole === "organization";

	const query = useQuery({
		queryKey: ["orgLocations", page, limit, search],
		queryFn: async () => {
			const params = toQueryBuilderParams({ page, limit, search });

			const response = await locationService.orgGetLocations(params);
			return response;
		},
		enabled,
		keepPreviousData: true, // Menjaga data sebelumnya saat fetching
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});

	return {
		locations: query.data?.data || [],
		pagination: query.data?.pagination || {},
		isLoading: query.isLoading,
		error: query.error,
		isFetching: query.isFetching,
	};
};

/**
 * Ambil detail lokasi berdasarkan ID.
 *
 * @param {string|number} locationId - ID lokasi
 * @returns {UseQueryResult<Object>} Data detail lokasi
 */
export const useOrgLocationById = (id) => {
	const currentRole = useUserRole();
	const enabled = currentRole === "organization" && !!id;
	return useQuery({
		queryKey: ["orgLocations", id],
		queryFn: async () => {
			const response = await locationService.orgGetLocationById(id);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Buat location baru (organization).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["locations"]
 */
export const useOrgCreateLocationMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["orgLocations", "create"],
		mutationFn: locationService.orgCreateLocation,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries(["orgLocations"]);
			navigate("/organization/locations");

			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Lokasi berhasil dibuat",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Create location failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali atau Coba lagi.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Create location error:", error);
		},
	});
};

/**
 * Update lokasi (organization).
 *
 * @returns {UseMutationResult} Mutation hook
 * @param {Object} variables - Parameter update
 * @param {string|number} variables.locationId - ID lokasi
 * @param {Object} variables.payload - Data lokasi baru
 */
export const useOrgUpdateLocationMutation = () => {
	const navigate = useNavigate();

	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["orgLocations", "update"],
		mutationFn: ({ id, data }) => locationService.orgUpdateLocation(id, data),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async (_, id) => {
			await queryClient.invalidateQueries(["orgLocations"]);
			navigate("/organization/locations");

			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Lokasi berhasil diperbarui",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Update location failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali atau Coba lagi.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Update location error:", error);
		},
	});
};

/**
 * Hapus location (Organization).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["OrgLocations"]
 * @optimisticUpdate Cache ["orgLocations"] langsung difilter
 */
export const useOrgDeleteLocationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: locationService.orgDeleteLocation,
		onSuccess: (_, id) => {
			queryClient.setQueryData(["orgLocations"], (oldData) =>
				oldData.filter((location) => location.id !== id)
			);
			queryClient.invalidateQueries(["orgLocations"]);
		},
	});
};
