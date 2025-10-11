import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import * as authService from "../services/authService";

/**
 * Zustand store untuk menyimpan user state secara global
 * Pattern sama dengan yang biasa Anda gunakan untuk auth
 */
const useAuthStore = create((set, get) => ({
	user: null,
	token: localStorage.getItem("token"),
	isAuthenticated: !!localStorage.getItem("token"),

	setAuth: (user, token) => {
		localStorage.setItem("token", token);
		set({ user, token, isAuthenticated: true });
	},

	clearAuth: () => {
		localStorage.removeItem("token");
		set({ user: null, token: null, isAuthenticated: false });
	},

	updateUser: (userData) => {
		set((state) => ({ user: { ...state.user, ...userData } }));
	},
}));

/**
 * Custom hooks untuk Authentication menggunakan TanStack Query
 * Pattern yang sama dengan struktur hooks yang Anda gunakan
 */

/**
 * Hook untuk mendapatkan user profile saat ini
 * @returns {Object} Query result dengan data user profile
 */
export const useProfile = () => {
	const { isAuthenticated } = useAuthStore();

	return useQuery({
		queryKey: ["auth", "profile"],
		queryFn: authService.getProfile,
		enabled: isAuthenticated,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 1,
		onError: (error) => {
			// Jika token invalid, logout user
			if (error.response?.status === 401) {
				useAuthStore.getState().clearAuth();
			}
		},
	});
};

/**
 * Hook untuk login user
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useLogin = () => {
	const queryClient = useQueryClient();
	const setAuth = useAuthStore((state) => state.setAuth);

	return useMutation({
		mutationFn: authService.login,
		onSuccess: (data) => {
			// Set auth state
			setAuth(data.user, data.token);

			// Invalidate dan fetch user profile
			queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
		},
		onError: (error) => {
			console.error("Login failed:", error);
		},
	});
};

/**
 * Hook untuk register user baru
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useRegister = () => {
	const queryClient = useQueryClient();
	const setAuth = useAuthStore((state) => state.setAuth);

	return useMutation({
		mutationFn: authService.register,
		onSuccess: (data) => {
			// Set auth state
			setAuth(data.user, data.token);

			// Invalidate dan fetch user profile
			queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
		},
		onError: (error) => {
			console.error("Registration failed:", error);
		},
	});
};

/**
 * Hook untuk logout user
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useLogout = () => {
	const queryClient = useQueryClient();
	const clearAuth = useAuthStore((state) => state.clearAuth);

	return useMutation({
		mutationFn: authService.logout,
		onSuccess: () => {
			// Clear auth state
			clearAuth();

			// Clear semua cached data
			queryClient.clear();
		},
		onError: (error) => {
			console.error("Logout failed:", error);
			// Tetap clear auth state meskipun error
			clearAuth();
			queryClient.clear();
		},
	});
};

/**
 * Hook untuk update user profile
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useUpdateProfile = () => {
	const queryClient = useQueryClient();
	const updateUser = useAuthStore((state) => state.updateUser);

	return useMutation({
		mutationFn: authService.updateProfile,
		onSuccess: (data) => {
			// Update user state
			updateUser(data);

			// Invalidate user profile
			queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
		},
		onError: (error) => {
			console.error("Failed to update profile:", error);
		},
	});
};

/**
 * Hook untuk forgot password
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useForgotPassword = () => {
	return useMutation({
		mutationFn: authService.forgotPassword,
		onError: (error) => {
			console.error("Failed to send reset password email:", error);
		},
	});
};

/**
 * Hook untuk reset password
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useResetPassword = () => {
	return useMutation({
		mutationFn: authService.resetPassword,
		onError: (error) => {
			console.error("Failed to reset password:", error);
		},
	});
};

// Export store untuk digunakan di komponen
export { useAuthStore };
