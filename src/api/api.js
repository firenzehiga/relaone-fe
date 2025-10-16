import axios from "axios";

// Base API URL - menggunakan Laravel backend yang sudah ada
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Instance axios yang sudah dikonfigurasi untuk API calls
 */
const api = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

/**
 * Request interceptor untuk menambahkan auth token
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
		if (error.response?.status === 401) {
			localStorage.removeItem("authToken");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

/**
 * API endpoints - menggunakan backend Laravel yang sudah ada
 */
export const endpoints = {
	events: {
		getAll: (params) => {
			return api.get("/events", { params });
		},

		getById: (id) => {
			return api.get(`/events/${id}`);
		},

		create: (data) => {
			return api.post("/events", data);
		},

		update: (id, data) => {
			return api.put(`/events/${id}`, data);
		},

		delete: (id) => {
			return api.delete(`/events/${id}`);
		},

		join: (id, data) => {
			return api.post(`/event-participants`, {
				event_id: id,
				...data,
			});
		},
	},

	categories: {
		getAll: () => {
			return api.get("/categories");
		},

		getById: (id) => {
			return api.get(`/categories/${id}`);
		},
	},

	organizations: {
		getAll: (params) => {
			return api.get("/organizations", { params });
		},

		getById: (id) => {
			return api.get(`/organizations/${id}`);
		},
	},

	locations: {
		getAll: () => {
			return api.get("/locations");
		},

		getById: (id) => {
			return api.get(`/locations/${id}`);
		},
	},

	feedbacks: {
		getAll: () => {
			return api.get("/feedbacks");
		},

		create: (data) => {
			return api.post("/feedbacks", data);
		},
	},

	auth: {
		login: (credentials) => {
			// Note: Auth belum ada di backend, masih mock untuk sekarang
			return Promise.resolve({
				data: {
					user: { id: 1, name: "Test User", email: credentials.email },
					token: "mock-token-" + Date.now(),
				},
			});
		},

		register: (userData) => {
			// Note: Auth belum ada di backend, masih mock untuk sekarang
			return Promise.resolve({
				data: {
					user: { ...userData, id: Date.now() },
					token: "mock-token-" + Date.now(),
				},
			});
		},

		logout: () => {
			// Note: Auth belum ada di backend, masih mock untuk sekarang
			return Promise.resolve({ data: { success: true } });
		},
	},

	users: {
		getProfile: () => {
			// Note: User management belum ada di backend, masih mock untuk sekarang
			return Promise.resolve({
				data: { id: 1, name: "Test User", email: "test@example.com" },
			});
		},

		updateProfile: (data) => {
			// Note: User management belum ada di backend, masih mock untuk sekarang
			return Promise.resolve({
				data: { id: 1, ...data },
			});
		},

		getRegistrations: () => {
			// Note: User registrations belum ada di backend, akan menggunakan events untuk sekarang
			return api.get("/events?limit=3");
		},
	},
};

export default api;
