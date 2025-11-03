import * as locationService from "@/_services/locationService";
import { useAuthStore, useUserRole } from "./useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { parseApiError } from "@/utils";
import toast from "react-hot-toast";

// === ADMIN HOOKS ===
/**
 * Hook untuk mengambil data locations (admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminLocations = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";

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
			toast.success("Lokasi berhasil dibuat", { duration: 2000 });
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Create location failed";
			setError(msg);
			toast.error(msg, { duration: 4000 });
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
			toast.success("Lokasi berhasil diperbarui", {
				duration: 2000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Update location failed";
			setError(msg);
			toast.error(msg, { duration: 4000 });
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
			queryClient.setQueryData(["adminLocations"], (oldData) =>
				oldData.filter((location) => location.id !== id)
			);
			queryClient.invalidateQueries(["adminLocations"]);
		},
	});
};

// === ORGANIZATION HOOKS ===
/**
 * Hook untuk mengambil data locations (organization)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useOrgLocations = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "organization";

	return useQuery({
		queryKey: ["orgLocations"],
		queryFn: async () => {
			const response = await locationService.orgGetLocations();
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};
