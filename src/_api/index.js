import axios from "axios";

// Base API URL - menggunakan Laravel backend yang sudah ada
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://be-yuliadi.karyakreasi.id/api";

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

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			const oldToken = localStorage.getItem("authToken");
			if (!oldToken) return Promise.reject(error);

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

			isRefreshing = true;

			try {
				// Gunakan axios tanpa interceptor untuk refresh agar tidak memicu loop
				const refreshClient = axios.create({ baseURL: BASE_URL });
				const res = await refreshClient.post(
					"/refresh-token",
					{},
					{ headers: { Authorization: `Bearer ${oldToken}` } }
				);
				console.debug("refresh response:", res.status, res.data);

				// Ambil token dari beberapa kemungkinan lokasi (sesuaikan dengan backend Anda)
				const newToken = res.data?.data?.token || null;
				if (!newToken) throw new Error("No token returned from refresh endpoint");

				localStorage.setItem("authToken", newToken);
				processQueue(null, newToken);
				isRefreshing = false;

				originalRequest.headers = originalRequest.headers || {};
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return api(originalRequest);
			} catch (err) {
				processQueue(err, null);
				isRefreshing = false;
				localStorage.removeItem("authToken");

				window.location.href = "/login"; // Redirect ke login page

				return Promise.reject(err);
			}
		}

		return Promise.reject(error);
	}
);

export default api;
