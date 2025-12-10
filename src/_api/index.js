import axios from "axios";

// Base API URL - menggunakan Laravel backend yang sudah ada
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://peladen.my.id/api";

/**
 * Instance axios yang sudah dikonfigurasi untuk API calls
 */
const api = axios.create({
	baseURL: BASE_URL,
});
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) reject(error);
		else resolve(token);
	});
	failedQueue = [];
};

/**
 * Request interceptor untuk menambahkan auth token
 */
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("authToken");
		if (token) {
			config.headers = config.headers || {};
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

/**
 * Response interceptor untuk handle errors + refresh flow
 */
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		// Handle timeout / network logs
		if (error.code === "ECONNABORTED") {
			console.error("Request timeout - Server/Database mungkin bermasalah");
		}
		if (error.message === "Network Error") {
			console.error("Network Error - Periksa koneksi atau server");
		}

		const originalRequest = error.config;
		if (!originalRequest) return Promise.reject(error);

		// Cek apakah error 401 Unauthorized
		const is401Error = error.response?.status === 401;
		const alreadyRetried = originalRequest._retry;

		if (!is401Error || alreadyRetried) {
			return Promise.reject(error);
		}

		// Tandai bahwa request ini sudah pernah di-retry
		originalRequest._retry = true;

		// Cek apakah ada token
		const oldToken = localStorage.getItem("authToken");

		// Jika tidak ada token, langsung reject (user belum login)
		if (!oldToken) {
			return Promise.reject(error);
		}

		// Jika ada request lain yang sedang refresh, masukkan ke queue
		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				failedQueue.push({ resolve, reject });
			})
				.then((token) => {
					originalRequest.headers = originalRequest.headers || {};
					originalRequest.headers.Authorization = `Bearer ${token}`;
					return api(originalRequest);
				})
				.catch((err) => Promise.reject(err));
		}

		// Mulai proses refresh token
		isRefreshing = true;

		try {
			// Refresh token menggunakan axios client tanpa interceptor
			const refreshClient = axios.create({ baseURL: BASE_URL });
			const res = await refreshClient.post(
				"/refresh-token",
				{},
				{ headers: { Authorization: `Bearer ${oldToken}` } }
			);

			const newToken = res.data?.data?.token;
			if (!newToken) {
				throw new Error("No token returned from refresh endpoint");
			}

			// Simpan token baru
			localStorage.setItem("authToken", newToken);
			processQueue(null, newToken);
			isRefreshing = false;

			// Retry request dengan token baru
			originalRequest.headers = originalRequest.headers || {};
			originalRequest.headers.Authorization = `Bearer ${newToken}`;
			return api(originalRequest);
		} catch (refreshError) {
			// Refresh token gagal
			processQueue(refreshError, null);
			isRefreshing = false;

			// Clear token
			localStorage.removeItem("authToken");

			// Redirect ke login KECUALI untuk endpoint verify email atau resend verification
			const isVerifyEmail =
				originalRequest.url?.includes("/email/verify") ||
				originalRequest.url?.includes("/email/resend");

			if (!isVerifyEmail) {
				window.location.href = "/login";
			}

			return Promise.reject(refreshError);
		}
	}
);

export default api;
