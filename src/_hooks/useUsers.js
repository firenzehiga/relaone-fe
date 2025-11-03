import * as userService from "@/_services/userService";
import { useAuthStore, useUserRole } from "@/_hooks/useAuth";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { parseApiError } from "@/utils";

// === PUBLIC HOOKS ===
// Ambil profile (sebelumnya useProfile)
export const useUserProfile = () => {
	const { isAuthenticated } = useAuthStore();

	return useQuery({
		queryKey: ["userProfile"],
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
			navigate("/profile");

			setLoading(false);

			toast.success(response.message, { duration: 2000 });
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
 * Hook untuk mengambil data semua users (khusus admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminUsers = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";

	return useQuery({
		queryKey: ["adminUsers"],
		queryFn: async () => {
			const response = await userService.adminGetUsers();
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
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
