import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import toast from "react-hot-toast";
import * as authService from "@/services/authService";

/**
 * Baca user yang tersimpan di localStorage (jika ada) saat file dimuat.
 * Nama `rehydratedUser` menandakan bahwa ini adalah data yang di-"rehydrate"
 * kembali ke store pada startup aplikasi.
 *
 * Dibungkus dalam try/catch karena localStorage bisa saja tidak tersedia
 * (private mode / quota / error), sehingga kita aman jika operasi gagal.
 */
const rehydratedUser = (() => {
	try {
		const raw = localStorage.getItem("authUser");
		return raw ? JSON.parse(raw) : null;
	} catch (e) {
		return null;
	}
})();

/**
 * Zustand store untuk auth
 * - Menyimpan user dan token
 * - Mendukung re-hydrate dari localStorage (authUser, authToken)
 * - Menyediakan `initializeAuth()` untuk dipanggil sekali saat app startup
 */
const useAuthStore = create((set, get) => ({
	// data yang diisi dari localStorage apabila ada (rehydrated pada startup)
	user: rehydratedUser,
	token: localStorage.getItem("authToken"),
	isAuthenticated: !!localStorage.getItem("authToken"),
	isLoading: false,
	error: null,
	// flag untuk menandakan inisialisasi store selesai (dipakai oleh AuthInitializer)
	initialized: false,

	// setAuth: persist ke localStorage juga supaya header/UX tidak nge-flash setelah refresh
	setAuth: (userData, token) => {
		try {
			if (token) localStorage.setItem("authToken", token);
			if (userData) localStorage.setItem("authUser", JSON.stringify(userData));
		} catch (e) {
			// ignore storage errors
		}

		set({
			user: userData,
			token,
			isAuthenticated: true,
			error: null,
		});
	},

	// clearAuth: hapus dari localStorage juga
	clearAuth: () => {
		try {
			localStorage.removeItem("authToken");
			localStorage.removeItem("authUser");
		} catch (e) {
			// ignore
		}

		set({
			user: null,
			token: null,
			isAuthenticated: false,
			error: null,
		});
	},

	updateUser: (userData) => {
		set((state) => {
			const merged = { ...(state.user || {}), ...userData };
			try {
				localStorage.setItem("authUser", JSON.stringify(merged));
			} catch (e) {}
			return { user: merged };
		});
	},

	setLoading: (loading) => set({ isLoading: loading }),

	setError: (error) => set({ error }),

	clearError: () => set({ error: null }),

	/**
	 * initializeAuth: inisialisasi auth saat aplikasi diload
	 * - Membaca token + user dari localStorage secara sinkron sehingga UI (header) punya data
	 * - Melakukan verifikasi token di background dengan memanggil API profile
	 * - Jika verifikasi gagal, akan meng-clear auth
	 *
	 * Fungsi ini bisa dipanggil sekali di entrypoint (mis. main.jsx) untuk menghindari "flash"
	 */
	initializeAuth: async () => {
		const token = localStorage.getItem("authToken");

		// jika tidak ada token, tandai initialized dan selesai
		if (!token) {
			set({ initialized: true });
			return;
		}

		// jika token ada, set state dari localStorage (synchronous)
		const rawUser = (() => {
			try {
				return localStorage.getItem("authUser");
			} catch (e) {
				return null;
			}
		})();

		const parsedUser = rawUser ? JSON.parse(rawUser) : null;
		// set initialized langsung agar UI (header dll) tidak ter-block
		set({ token, isAuthenticated: true, user: parsedUser, initialized: true });

		// Jalankan verifikasi profil di background tanpa menunggu.
		// Jika verifikasi gagal, kita bersihkan auth lokal.
		(async () => {
			try {
				const res = await authService.getCurrentUser();
				const remoteUser = res.data;
				if (remoteUser) {
					set({ user: remoteUser });
					try {
						localStorage.setItem("authUser", JSON.stringify(remoteUser));
					} catch (e) {}
				} else {
					// jika respons tidak valid, hapus data lokal
					set({ user: null, token: null, isAuthenticated: false });
					try {
						localStorage.removeItem("authToken");
						localStorage.removeItem("authUser");
					} catch (e) {}
				}
			} catch (err) {
				set({ user: null, token: null, isAuthenticated: false });
				try {
					localStorage.removeItem("authToken");
					localStorage.removeItem("authUser");
				} catch (e) {}
			}
		})();
	},
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

			// Navigate to home AFTER auth state cleared to avoid ProtectedRoute race
			setTimeout(() => navigate("/home", { replace: true }), 0);
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

			// Ensure we land on home (and not intercepted by guard)
			setTimeout(() => navigate("/home", { replace: true }), 0);
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
	admin: ["/admin/"],
	organization: ["/organization/"],
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
