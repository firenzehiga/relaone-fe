import axios from "axios";

// Base API URL - menggunakan Laravel backend yang sudah ada
const BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://peladen.my.id/api";

/**
 * Instance axios yang sudah dikonfigurasi untuk API calls
 */
const api = axios.create({
	baseURL: BASE_URL,
});

/**
 * Request interceptor untuk menambahkan auth token
 * Jadi tidak perlu menambahkan header Authorization di setiap request manual
 */
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("authToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

/**
 * Response interceptor untuk handle errors
 */
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Handle timeout errors
		if (error.code === "ECONNABORTED") {
			console.error("Request timeout - Server/Database mungkin bermasalah");
		}

		// Handle network errors
		if (error.message === "Network Error") {
			console.error("Network Error - Periksa koneksi atau server");
		}

		// Handle auth errors
		if (error.response?.status === 401) {
			localStorage.removeItem("authToken");
			// Only redirect if not already on auth pages
			if (
				!window.location.pathname.includes("/login") &&
				!window.location.pathname.includes("/register")
			) {
				window.location.href = "/login";
			}
		}

		return Promise.reject(error);
	}
);

export default api;
