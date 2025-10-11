import axios from "axios";

// Import mock data
import eventsData from "../mock/events.json";
import categoriesData from "../mock/categories.json";
import organizationsData from "../mock/organizations.json";
import usersData from "../mock/users.json";

// Base API URL - akan dipakai nanti ketika backend ready
const BASE_URL = "http://localhost:8000/api";

/**
 * Instance axios yang sudah dikonfigurasi untuk API calls
 * Sementara menggunakan mock data, nanti ganti ke real API
 */
const api = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
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
 * Helper untuk simulasi API response dengan mock data
 * Nanti fungsi ini akan dihapus ketika backend ready
 */
const mockApiResponse = (data, delay = 300) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ data });
		}, delay);
	});
};

/**
 * API endpoints - sementara pakai mock, nanti ganti ke real API calls
 */
export const endpoints = {
	events: {
		getAll: (params) => {
			// TODO: Nanti ganti jadi real API call: return api.get("/events", { params });
			let filteredEvents = eventsData;
			if (params?.status) {
				filteredEvents = eventsData.filter(
					(event) => event.status === params.status
				);
			}
			return mockApiResponse(filteredEvents);
		},

		getById: (id) => {
			// TODO: Nanti ganti jadi: return api.get(`/events/${id}`);
			const event = eventsData.find((e) => e.id === parseInt(id));
			return mockApiResponse(event);
		},

		create: (data) => {
			// TODO: Nanti ganti jadi: return api.post("/events", data);
			const newEvent = { ...data, id: Date.now() };
			return mockApiResponse(newEvent);
		},

		update: (id, data) => {
			// TODO: Nanti ganti jadi: return api.put(`/events/${id}`, data);
			return mockApiResponse({ ...data, id });
		},

		delete: (id) => {
			// TODO: Nanti ganti jadi: return api.delete(`/events/${id}`);
			return mockApiResponse({ success: true });
		},

		join: (id, data) => {
			// TODO: Nanti ganti jadi: return api.post(`/events/${id}/join`, data);
			return mockApiResponse({
				success: true,
				message: "Successfully joined event",
				eventId: id,
				userData: data,
			});
		},
	},

	categories: {
		getAll: () => {
			// TODO: Nanti ganti jadi: return api.get("/categories");
			return mockApiResponse(categoriesData);
		},

		getById: (id) => {
			// TODO: Nanti ganti jadi: return api.get(`/categories/${id}`);
			const category = categoriesData.find((c) => c.id === parseInt(id));
			return mockApiResponse(category);
		},
	},

	organizations: {
		getAll: (params) => {
			// TODO: Nanti ganti jadi: return api.get("/organizations", { params });
			return mockApiResponse(organizationsData);
		},

		getById: (id) => {
			// TODO: Nanti ganti jadi: return api.get(`/organizations/${id}`);
			const org = organizationsData.find((o) => o.id === parseInt(id));
			return mockApiResponse(org);
		},
	},

	auth: {
		login: (credentials) => {
			// TODO: Nanti ganti jadi: return api.post("/auth/login", credentials);
			return mockApiResponse({
				user: usersData[0],
				token: "mock-token-" + Date.now(),
			});
		},

		register: (userData) => {
			// TODO: Nanti ganti jadi: return api.post("/auth/register", userData);
			return mockApiResponse({
				user: { ...userData, id: Date.now() },
				token: "mock-token-" + Date.now(),
			});
		},

		logout: () => {
			// TODO: Nanti ganti jadi: return api.post("/auth/logout");
			return mockApiResponse({ success: true });
		},
	},

	users: {
		getProfile: () => {
			// TODO: Nanti ganti jadi: return api.get("/users/profile");
			return mockApiResponse(usersData[0]);
		},

		updateProfile: (data) => {
			// TODO: Nanti ganti jadi: return api.put("/users/profile", data);
			return mockApiResponse({ ...usersData[0], ...data });
		},

		getRegistrations: () => {
			// TODO: Nanti ganti jadi: return api.get("/users/registrations");
			return mockApiResponse(eventsData.slice(0, 3));
		},
	},
};

export default api;
export { mockApiResponse };
