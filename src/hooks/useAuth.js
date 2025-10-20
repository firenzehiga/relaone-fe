import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import toast from "react-hot-toast";
import * as authService from "@/services/authService";

const useAuthStore = create((set, get) => ({
	user: null,
	token: localStorage.getItem("authToken"),
	isAuthenticated: !!localStorage.getItem("authToken"),
	isLoading: false,
	error: null,

	setAuth: (userData, token) => {
		localStorage.setItem("authToken", token);
		set({
			user: userData,
			token,
			isAuthenticated: true,
			error: null,
		});
	},

	clearAuth: () => {
		localStorage.removeItem("authToken");
		set({
			user: null,
			token: null,
			isAuthenticated: false,
			error: null,
		});
	},

	updateUser: (userData) => {
		set((state) => ({
			user: { ...state.user, ...userData },
		}));
	},

	setLoading: (loading) => set({ isLoading: loading }),

	setError: (error) => set({ error }),

	clearError: () => set({ error: null }),
}));

export const useProfile = () => {
	const { isAuthenticated } = useAuthStore();

	return useQuery({
		queryKey: ["auth", "profile"],
		queryFn: async () => {
			const response = await authService.getCurrentUser();
			return response.data;
		},
		enabled: isAuthenticated,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

export const useLogin = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setAuth, setLoading, setError, clearError } = useAuthStore();

	return useMutation({
		mutationFn: authService.login,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: (data) => {
			setAuth(data.data.user, data.data.token);
			setLoading(false);

			// Show success toast
			toast.success(`Welcome back, ${data.data.user.nama}!`);

			// Invalidate and refetch user profile
			queryClient.invalidateQueries(["auth", "profile"]);

			// Navigate based on user role
			const userRole = data.data.user.role;
			switch (userRole) {
				case "admin":
					navigate("/admin/dashboard");
					break;
				case "organization":
					navigate("/organization/dashboard");
					break;
				case "volunteer":
				default:
					navigate("/");
					break;
			}
		},
		onError: (error) => {
			setLoading(false);
			const errorMessage = error.message || "Login failed";
			setError(errorMessage);
			toast.error(errorMessage);
		},
	});
};

export const useRegister = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setAuth, setLoading, setError, clearError } = useAuthStore();

	return useMutation({
		mutationFn: authService.register,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: (data) => {
			setAuth(data.data.user, data.data.token);
			setLoading(false);

			// Show success toast
			toast.success(
				`Welcome to RelaOne, ${data.data.user.nama}! Your account has been created successfully.`
			);

			// Invalidate and refetch user profile
			queryClient.invalidateQueries(["auth", "profile"]);

			// Navigate based on user role
			const userRole = data.data.user.role;
			switch (userRole) {
				case "admin":
					navigate("/admin/dashboard");
					break;
				case "organization":
					navigate("/organization/dashboard");
					break;
				case "volunteer":
				default:
					navigate("/");
					break;
			}
		},
		onError: (error) => {
			setLoading(false);
			const errorMessage = error.message || "Registration failed";
			setError(errorMessage);
			toast.error(errorMessage);
		},
	});
};

export const useLogout = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { clearAuth, setLoading, setError, clearError } = useAuthStore();

	return useMutation({
		mutationFn: authService.logout,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: () => {
			clearAuth();
			setLoading(false);

			// Show success toast
			toast.success("You have been logged out successfully");

			// Clear all cached data
			queryClient.clear();

			// Navigate to home
			navigate("/");
		},
		onError: (error) => {
			// Even if logout fails on server, clear local data
			clearAuth();
			setLoading(false);
			const errorMessage = error.message || "Logout failed";
			setError(errorMessage);
			toast.error(errorMessage);

			// Clear all cached data
			queryClient.clear();

			// Navigate to home
			navigate("/");
		},
	});
};

export { useAuthStore };

/**
 * role pengguna ke daftar route yang diizinkan.
 *
 * Objek ini digunakan untuk menentukan path (route) yang boleh diakses
 * oleh setiap role aplikasi.
 *
 * @constant
 * @type {{admin: string[], organization: string[], volunteer: string[]}}
 * @property {string[]} admin - Array route yang diizinkan untuk role "admin".
 *   (Kosong berarti tidak ada route spesifik yang didefinisikan di sini.)
 * @property {string[]} organization - Array route yang diizinkan untuk role "organization".
 * @property {string[]} volunteer - Array route yang diizinkan untuk role "volunteer".
 */
export const roleAllowed = {
	admin: ["/admin/dashboard"],
	organization: ["/organization/dashboard"],
	volunteer: ["/home", "/events", "/organizations"],
};

// Helper function untuk mendapatkan dashboard URL berdasarkan user role
export function getUserDashboard(role) {
	switch (role) {
		case "admin":
			return "/admin/dashboard";
		case "organization":
			return "/organization/dashboard";
		case "volunteer":
		default:
			return "/home";
	}
}

// Helper function untuk mengecek apakah path diizinkan untuk role tertentu
export function isPathAllowedForRole(role, path) {
	const allowed = roleAllowed[role] || [];
	if (allowed.length === 0) return false;

	const normalized =
		path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;

	return allowed.some((p) => {
		if (p === normalized) return true;
		return normalized.startsWith(p.endsWith("/") ? p.slice(0, -1) : p);
	});
}
