import * as userService from "@/_services/userService";
import { useAuthStore, useUserRole } from "@/_hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { parseApiError, toQueryBuilderParams } from "@/utils";
import { showToast } from "@/components/ui/Toast";

// === PUBLIC HOOKS ===
// Ambil profile (sebelumnya useProfile)
export const useUserProfile = () => {
	const { isAuthenticated } = useAuthStore();
	const currentRole = useUserRole();

	return useQuery({
		queryKey: ["userProfile", currentRole],
		queryFn: async () => {
			const res = await userService.getUserProfile();
			return res.data;
		},
		enabled: isAuthenticated,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

// Update profile -> panggil updateUser dari auth store untuk sinkron ke localStorage/state
export const useUpdateUserMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { updateUser, setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["users", "updateProfile"],
		mutationFn: ({ userData }) => userService.updateUserProfile(userData),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async (response) => {
			// Extract user data dari response
			const userData = response.data?.user;
			if (userData) {
				updateUser(userData); // Update user di localStorage dan auth store
			}
			await queryClient.invalidateQueries(["userProfile"]); // Invalidate queries untuk refresh cache

			const userRole = userData?.role;
			switch (userRole) {
				case "admin":
					navigate("/admin/profile");
					break;
				case "organization":
					navigate("/organization/profile");
					break;
				case "volunteer":
				default:
					navigate("/volunteer/profile");
					break;
			}

			setLoading(false);

			showToast({
				type: "success",
				title: "Berhasil!",
				message: response.message,
				duration: 2000,
				position: "top-right",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Update profile failed";
			setError(msg);
			toast.error(msg, { duration: 4000 });
			console.error("Update profile error:", error);
		},
	});
};
// === ADMIN HOOKS ===
/**
 * Hook untuk mengambil data semua users dengan pagination (khusus admin)
 * @param {number} page - Halaman yang diminta
 * @param {number} limit - Jumlah data per halaman
 * @param {string} search - Kata kunci pencarian
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminUsers = (page = 1, limit = 10, search = "") => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";

	const query = useQuery({
		queryKey: ["adminUsers", page, limit, search],
		queryFn: async () => {
			const params = toQueryBuilderParams({ page, limit, search });

			const response = await userService.adminGetUsers(params);
			return response;
		},
		enabled,
		keepPreviousData: true, // Menjaga data sebelumnya saat fetching
		staleTime: 30000, // 30 detik
		retry: 1,
	});

	return {
		users: query.data?.data || [],
		pagination: query.data?.pagination || {},
		isLoading: query.isLoading,
		error: query.error,
		isFetching: query.isFetching,
	};
};

/**
 * Hook untuk mengambil data semua organisasi users (khusus admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminOrganizationUsers = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";

	return useQuery({
		queryKey: ["adminOrganizationUsers"],
		queryFn: async () => {
			const response = await userService.adminGetOrganizationUsers();
			return response;
		},
		enabled,
		// staleTime: 1 * 60 * 1000,
		// cacheTime: 5 * 60 * 1000,
		// retry: 1,
	});
};

/**
 * Hook untuk mengambil data semua volunteer users (khusus admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminVolunteerUsers = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";

	return useQuery({
		queryKey: ["adminVolunteerUsers"],
		queryFn: async () => {
			const response = await userService.adminGetVolunteerUsers();
			return response;
		},
		enabled,
		// staleTime: 1 * 60 * 1000,
		// cacheTime: 5 * 60 * 1000,
		// retry: 1,
	});
};

/**
 * Hapus user (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["adminUsers"]
 * @optimisticUpdate Cache ["adminUsers"] langsung difilter
 */
export const useAdminDeleteUserMutation = () => {
	const queryClient = useQueryClient();

	const { setLoading } = useAuthStore();

	return useMutation({
		mutationFn: userService.adminDeleteUser,
		onMutate: () => setLoading(true),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries(["adminUsers"]);
			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil",
				message: "User berhasil dihapus.",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Gagal menghapus user.";
			showToast({ type: "error", message: msg });
		},
	});
};

/**
 * ubah status user (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["adminUsers"]
 * @optimisticUpdate Cache ["adminUsers"] langsung difilter
 */
export const useAdminChangeStatusUserMutation = () => {
	const queryClient = useQueryClient();

	const { setLoading } = useAuthStore();

	return useMutation({
		mutationFn: ({ id, status }) => userService.adminChangeStatusUser(id, { status }),
		onMutate: () => setLoading(true),
		onSuccess: (response) => {
			queryClient.invalidateQueries(["adminUsers"]);
			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil",
				message: response?.message || "Status user berhasil diubah.",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Gagal mengubah status user.";
			showToast({ type: "error", message: msg });
		},
	});
};

/**
 * Hook untuk mengambil data semua analytics dashboard (khusus admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminAnalytics = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";

	return useQuery({
		queryKey: ["adminAnalytics"],
		queryFn: async () => {
			const response = await userService.adminGetDashboardAnalytics();
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/** Update rating organisasi beserta eventnya secara massal dengan opsional kirim data id organisasi *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["adminUsers"]
 * @optimisticUpdate Cache ["adminUsers"] langsung difilter
 */
/**
 * Update organisasi (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @param {Object} variables - Parameter update
 * @param {string|number} variables.organizationId - ID organisasi
 * @param {Object} variables.payload - Data organisasi baru
 * @invalidates ["organizations"]
 */
export const useAdminUpdateOrganizationRatingsMutation = () => {
	const queryClient = useQueryClient();
	const { setLoading, setError } = useAuthStore(); // tambahkan setError

	return useMutation({
		mutationKey: ["admin", "updateRatings"],
		// gunakan userService (bukan organizationService) dan kirim payload sesuai backend
		mutationFn: ({ organizationId } = {}) =>
			userService.adminUpdateOrganizationRatings(
				organizationId ? { organization_id: organizationId } : {}
			),
		onMutate: () => {
			setLoading(true);
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries(["adminOrganizations"]);
			queryClient.invalidateQueries(["adminEvents"]);

			setLoading(false);
			const msg = parseApiError(response);

			showToast({
				type: "success",
				title: "Berhasil!",
				message: msg,
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
// === ORGANIZATIONS HOOKS ===
/**
 * Hook untuk mengambil data semua analytics dashboard (khusus organisasi)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useOrgAnalytics = (params = {}) => {
	const currentRole = useUserRole();
	const enabled = currentRole === "organization";

	return useQuery({
		queryKey: ["orgAnalytics", params],
		queryFn: async () => {
			const response = await userService.orgGetDashboardAnalytics(params);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};
