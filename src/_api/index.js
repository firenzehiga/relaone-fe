import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://peladen.my.id/api";

// ============================================================================
// REFRESH TOKEN STATE MANAGEMENT
// ============================================================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) reject(error);
		else resolve(token);
	});
	failedQueue = [];
};

// ============================================================================
// AXIOS INSTANCE
// ============================================================================
const api = axios.create({
	baseURL: BASE_URL,
});

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================
api.interceptors.request.use(
	(config) => {
		// Skip Authorization header untuk public endpoints
		// Usage: api.get('/endpoint', { withoutAuth: true })
		if (config.withoutAuth) {
			return config;
		}

		const token = localStorage.getItem("authToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		// Handle 401 Unauthorized dengan refresh token flow
		if (error.response?.status === 401) {
			return handleUnauthorizedError(error);
		}

		// Log errors untuk debugging
		logError(error);

		return Promise.reject(error);
	}
);

// ============================================================================
// ERROR HANDLERS
// ============================================================================

/**
 * Log errors berdasarkan tipe error
 */
function logError(error) {
	if (error.response) {
		// Error dari server
		const { status, data } = error.response;
		const message = data?.message || "Unknown error";

		switch (status) {
			case 403:
				console.error("Forbidden access");
				break;
			case 500:
				console.error("Server error");
				break;
			default:
				console.error(`API Error: ${status} - ${message}`);
		}
	} else if (error.request) {
		// Request dibuat tapi tidak ada response
		if (error.code === "ECONNABORTED") {
			console.error("Request timeout");
		} else if (error.message === "Network Error") {
			console.error("Network error - periksa koneksi");
		} else {
			console.error("No response from server");
		}
	} else {
		// Error saat setup request
		console.error("Request setup error:", error.message);
	}
}

/**
 * Handle 401 Unauthorized dengan refresh token flow
 */
async function handleUnauthorizedError(error) {
	const originalRequest = error.config;
	const oldToken = localStorage.getItem("authToken");

	// Guard clauses
	if (!originalRequest || originalRequest._retry) {
		return Promise.reject(error);
	}

	if (!oldToken) {
		return Promise.reject(error);
	}

	// Tandai request sudah di-retry
	originalRequest._retry = true;

	// Queue request jika sedang refresh
	if (isRefreshing) {
		return queueFailedRequest(originalRequest);
	}

	// Mulai refresh token
	return refreshTokenAndRetry(originalRequest, oldToken);
}

/**
 * Queue request yang gagal saat refresh sedang berlangsung
 */
function queueFailedRequest(originalRequest) {
	return new Promise((resolve, reject) => {
		failedQueue.push({ resolve, reject });
	}).then((token) => {
		originalRequest.headers.Authorization = `Bearer ${token}`;
		return api(originalRequest);
	});
}

/**
 * Refresh token dan retry original request
 */
async function refreshTokenAndRetry(originalRequest, oldToken) {
	isRefreshing = true;

	try {
		const newToken = await refreshToken(oldToken);

		// Update token
		localStorage.setItem("authToken", newToken);
		processQueue(null, newToken);

		// Retry original request dengan token baru
		originalRequest.headers.Authorization = `Bearer ${newToken}`;
		return api(originalRequest);
	} catch (refreshError) {
		processQueue(refreshError, null);
		handleRefreshTokenFailure(originalRequest);
		return Promise.reject(refreshError);
	} finally {
		isRefreshing = false;
	}
}

/**
 * Call API refresh token
 */
async function refreshToken(oldToken) {
	const refreshClient = axios.create({ baseURL: BASE_URL });
	const response = await refreshClient.post(
		"/refresh-token",
		{},
		{ headers: { Authorization: `Bearer ${oldToken}` } }
	);

	const newToken = response.data?.data?.token;
	if (!newToken) {
		throw new Error("No token returned from refresh endpoint");
	}

	return newToken;
}

/**
 * Handle ketika refresh token gagal
 */
function handleRefreshTokenFailure() {
	localStorage.removeItem("authToken");
	window.location.href = "/login";
}

export default api;
