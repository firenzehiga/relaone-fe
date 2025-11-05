import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import toast from "react-hot-toast";
import * as authService from "@/_services/authService";
import * as userService from "@/_services/userService";
import { showToast, toastSuccess } from "@/components/ui/Toast";

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

		// jika tidak ada token, pastikan kita tidak menampilkan data user yang kadaluarsa
		if (!token) {
			try {
				localStorage.removeItem("authUser");
			} catch (e) {
				// ignore storage errors
			}

			// set state untuk memastikan UI tidak menggunakan role/user lama
			set({
				initialized: true,
				user: null,
				token: null,
				isAuthenticated: false,
			});
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
				const res = await userService.getUserProfile();
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

// usage: const userRole = useUserRole();
export const useUserRole = () =>
	useAuthStore((state) => state.user?.role ?? "guest");

export const useLogin = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setAuth, setLoading, setError, clearError } = useAuthStore();

	return useMutation({
		mutationKey: ["login"],
		mutationFn: authService.login,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: (data) => {
			setAuth(data.data.user, data.data.token);
			setLoading(false);

			// Show success toast
			showToast({
				type: "success",
				title: "Login Successful",
				message: `Welcome back, ${data.data.user.nama}!`,
				duration: 2000,
				position: "top-center",
			});

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
			toast.error(errorMessage, { duration: 2000 });
		},
	});
};

export const useRegister = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setAuth, setLoading, setError, clearError } = useAuthStore();

	return useMutation({
		mutationKey: ["register"],
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
				`Selamat datang di RelaOne, ${data.data.user.nama}! ${data.message}`,
				{ duration: 2000 }
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
			showToast({
				type: "success",
				title: "Logout Successful",
				message: `You have been logged out successfully`,
				duration: 2000,
				position: "top-center",
			});

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
			toast.error(errorMessage, { duration: 2000 });

			// Clear all cached data
			queryClient.clear();

			// Ensure we land on home (and not intercepted by guard)
			setTimeout(() => navigate("/home", { replace: true }), 0);
		},
	});
};

export { useAuthStore };