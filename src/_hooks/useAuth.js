import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import toast from "react-hot-toast";
import * as authService from "@/_services/authService";
import * as userService from "@/_services/userService";
import { showToast } from "@/components/ui/Toast";
import { parseApiError } from "@/utils";

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

// Helper untuk mengambil token dari localStorage dengan sanitasi
const getStoredToken = () => {
	try {
		const t = localStorage.getItem("authToken");
		if (!t) return null;
		// localStorage bisa berisi string "undefined" atau "null" jika
		// sesuatu menulis nilai tidak valid — anggap itu sebagai tidak ada token
		if (t === "undefined" || t === "null") return null;
		return t;
	} catch (e) {
		return null;
	}
};

/**
 * Helper untuk mengambil status verifikasi organisasi tanpa memodifikasi objek user.
 * Mengcover beberapa kemungkinan shape yang dikembalikan backend.
 */
export function getOrgVerificationStatus(user) {
	return (
		user?.role_data?.status_verifikasi ??
		user?.organization?.status_verifikasi ??
		user?.role_data?.status ??
		user?.organization?.status ??
		null
	);
}

/**
 * Zustand store untuk auth
 * - Menyimpan user dan token
 * - Mendukung re-hydrate dari localStorage (authUser, authToken)
 * - Menyediakan `initializeAuth()` untuk dipanggil sekali saat app startup
 */
const useAuthStore = create((set, get) => ({
	// data yang diisi dari localStorage apabila ada (rehydrated pada startup)
	user: rehydratedUser,
	token: getStoredToken(),
	isAuthenticated: !!getStoredToken(),
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
		const token = getStoredToken();

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

		// TIDAK perlu panggil getUserProfile() di sini!
		// Biar component yang butuh (ProtectedRoute, Dashboard, dll) yang panggil sendiri.
		// initializeAuth() cukup restore state dari localStorage saja.
	},
}));

// usage: const userRole = useUserRole();
export const useUserRole = () => useAuthStore((state) => state.user?.role ?? "guest");

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
				position: "top-right",
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
			const msg = parseApiError(error) || "Login failed";
			setError(msg);
			toast.dismiss();
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Pastikan Email dan Password Anda benar.",
				message: msg,
				duration: 4000,
				position: "top-center",
			});
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
			setLoading(false);

			// Cek apakah memerlukan verifikasi email
			if (data.data.requires_verification) {
				// Simpan user data tapi tidak set auth (belum terverifikasi)
				try {
					localStorage.setItem("pendingUser", JSON.stringify(data.data.user));
				} catch (e) {
					// ignore storage errors
				}

				showToast({
					type: "success",
					title: "Registrasi Berhasil!",
					message: data.message,
					duration: 5000,
					position: "top-center",
				});

				// Navigate ke halaman email verification pending
				navigate("/email-verification-pending", {
					state: {
						email: data.data.user.email,
						userName: data.data.user.nama,
					},
				});
			} else {
				// Flow lama: langsung login (jika backend tidak require verification)
				setAuth(data.data.user, data.data.token);

				if (data.data.user.role === "organization") {
					showToast({
						type: "success",
						title: `Selamat datang di RelaOne, ${data.data.user.nama}!`,
						message: `${data.message}, akun Anda sedang dalam proses verifikasi oleh admin.`,
						duration: 3000,
						position: "top-right",
					});
				} else {
					showToast({
						type: "success",
						title: `Selamat datang di RelaOne, ${data.data.user.nama}!`,
						message: `${data.message}`,
						duration: 3000,
						position: "top-center",
					});
				}

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

export const useForgotPassword = () => {
	const { setLoading, setError, clearError } = useAuthStore();

	return useMutation({
		mutationKey: ["forgotPassword"],
		mutationFn: authService.forgotPassword,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: (data) => {
			setLoading(false);
			showToast({
				type: "success",
				title: "Email Terkirim!",
				message: data.message || "Cek email Anda untuk instruksi reset password.",
				duration: 4000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Failed to send reset email";
			// Handle Laravel validation errors
			setError(msg);
			toast.error(msg, { duration: 2000 });
		},
	});
};

export const useResetPassword = () => {
	const navigate = useNavigate();
	const { setLoading, setError, clearError } = useAuthStore();

	return useMutation({
		mutationKey: ["resetPassword"],
		mutationFn: ({ token, email, newPassword, confirmPassword }) =>
			authService.resetPassword(token, email, newPassword, confirmPassword),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: (data) => {
			setLoading(false);
			showToast({
				type: "success",
				title: "Password Reset Berhasil!",
				message: "Password Anda telah berhasil direset. Silakan login dengan password baru.",
				duration: 4000,
				position: "top-center",
			});

			// Navigate to login page
			navigate("/login");
		},
		onError: (error) => {
			setLoading(false);
			// Handle Laravel validation errors
			const errorMessage = error.errors || error.message || "Password reset failed";
			setError(errorMessage);
			toast.error(errorMessage, { duration: 2000 });
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
				position: "top-right",
			});

			// Clear all cached data
			queryClient.clear();

			// Navigate ke home page
			navigate("/login");
		},
		onError: (error) => {
			// walau logout gagal, kita tetap clear auth di client
			clearAuth();
			setLoading(false);
			const msg = parseApiError(error) || "Logout failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali atau Coba lagi.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Logout error:", error);

			// Clear all cached data
			queryClient.clear();

			// Ensure we land on home (and not intercepted by guard)
			setTimeout(() => navigate("/", { replace: true }), 0);
		},
	});
};

export const useChangePassword = () => {
	const navigate = useNavigate();
	const { setLoading, setError, clearError } = useAuthStore();

	return useMutation({
		mutationKey: ["changePassword"],
		mutationFn: ({ currentPassword, newPassword }) =>
			authService.changePassword(currentPassword, newPassword),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: (data) => {
			setLoading(false);
			showToast({
				type: "success",
				title: "Password Change Berhasil!",
				message: "Password Anda telah berhasil diubah.",
				duration: 4000,
				position: "top-center",
			});

			// Navigate to previous page
			navigate(-1);
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Change password failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali atau Coba lagi.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Change password error:", error);
		},
	});
};

export const useVerifyEmail = () => {
	const { setLoading, setError, clearError } = useAuthStore();

	return useMutation({
		mutationKey: ["verifyEmail"],
		mutationFn: ({ id, hash, expires, signature }) =>
			authService.verifyEmail(id, hash, expires, signature),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: (data) => {
			setLoading(false);

			// Hapus pending user dari localStorage
			try {
				localStorage.removeItem("pendingUser");
			} catch (e) {
				// ignore storage errors
			}
			// Toast dihapus karena sudah ditampilkan di UI success state
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Email verification failed";
			setError(msg);
		},
	});
};

export const useResendVerification = () => {
	const { setLoading, setError, clearError } = useAuthStore();

	return useMutation({
		mutationKey: ["resendVerification"],
		mutationFn: (email) => authService.resendVerification(email),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: (data) => {
			setLoading(false);
			showToast({
				type: "success",
				title: "Email Terkirim!",
				message: data.message || "Email verifikasi telah dikirim ulang. Cek inbox Anda.",
				duration: 4000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Failed to resend verification email";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Pastikan email yang Anda masukkan benar dan belum terverifikasi.",
				message: msg,
				duration: 4000,
				position: "top-center",
			});
			console.error("Resend verification error:", error);
		},
	});
};

export { useAuthStore };
