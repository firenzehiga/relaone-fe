import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

const queueFailedRequest = (originalRequest) => {
	return new Promise((resolve, reject) => {
		failedQueue.push({ resolve, reject });
	})
		.then(() => api(originalRequest))
		.catch((err) => Promise.reject(err));
};

// ============================================================================
// 401 UNAUTHORIZED HANDLER
// ============================================================================

/**
 * Handle 401 Unauthorized dengan refresh token flow
 * Improvements:
 * - Better guards for public pages
 * - Proper error handling
 * - Cookie-based refresh support
 */
async function handleUnauthorizedError(error) {
	const originalRequest = error.config;

	// Guard 1: Skip refresh on public/guest pages
	const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
	const currentPath = window.location.pathname;
	const isPublicPage = publicPaths.some(path => currentPath.startsWith(path));

	if (isPublicPage) {
		return Promise.reject(error);
	}

	// Guard 2: Skip if already retried
	if (!originalRequest || originalRequest._retry) {
		handleRefreshTokenFailure();
		return Promise.reject(error);
	}

	// Guard 3: Skip if refresh endpoint itself failed
	if (originalRequest.url?.includes('/refresh')) {
		handleRefreshTokenFailure();
		return Promise.reject(error);
	}

	// Mark as retried
	originalRequest._retry = true;

	// If already refreshing, queue this request
	if (isRefreshing) {
		return queueFailedRequest(originalRequest);
	}

	// Start refresh flow
	return refreshTokenAndRetry(originalRequest);
}

/**
 * Refresh token and retry failed request
 */
async function refreshTokenAndRetry(originalRequest) {
	isRefreshing = true;

	try {
		// Call refresh endpoint - new token will be set in cookie by backend
		const response = await api.post('/refresh');

		if (response.data.success) {
			// Process queued requests
			processQueue(null);

			// Retry original request
			// Cookie with new token automatically sent by browser
			return api(originalRequest);
		} else {
			throw new Error('Refresh failed');
		}
	} catch (refreshError) {
		// Clear queue with error
		processQueue(refreshError, null);

		// Handle failure
		handleRefreshTokenFailure();

		return Promise.reject(refreshError);
	} finally {
		isRefreshing = false;
	}
}

/**
 * Handle ketika refresh token gagal
 * Improvements:
 * - Only redirect if not already on login
 * - Clear auth state
 * - Show user-friendly message
 */
function handleRefreshTokenFailure() {
	// Clear any stored user data
	try {
		localStorage.removeItem('authUser');
	} catch (e) {
		// ignore
	}

	// Only redirect if not already on login page
	if (window.location.pathname !== '/login') {
		// Optional: Show toast message
		console.log('Session expired. Please login again.');

		// Redirect to login
		window.location.href = '/login';
	}
}

// ============================================================================
// AXIOS INSTANCE
// ============================================================================
const api = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,  // Enable cookies for CORS requests
});

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================
api.interceptors.request.use(
	(config) => {
		// Cookie automatically sent by browser with withCredentials: true
		// No need to manually add Authorization header
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

		// Handle 429 Rate Limit
		if (error.response?.status === 429) {
			handleRateLimitError(error);
		}

		// Log errors untuk debugging
		logError(error);

		return Promise.reject(error);
	}
);

// ============================================================================
// RATE LIMIT HANDLER
// ============================================================================
function handleRateLimitError(error) {
	const retryAfter = error.response?.headers['retry-after'] || 60;
	const message = error.response?.data?.message || `Terlalu banyak permintaan. Coba lagi dalam ${retryAfter} detik.`;

	// Dispatch custom event untuk UI feedback
	window.dispatchEvent(
		new CustomEvent('rate-limit-error', {
			detail: {
				retryAfter: parseInt(retryAfter),
				message: message,
			},
		})
	);

	// Show toast (react-hot-toast)
	if (typeof toast !== 'undefined') {
		toast.error(message, { duration: 5000 });
	}
}

// ============================================================================
// ERROR LOGGER
// ============================================================================
function logError(error) {
	if (import.meta.env.DEV) {
		console.group('🔴 API Error');
		console.error('URL:', error.config?.url);
		console.error('Method:', error.config?.method?.toUpperCase());
		console.error('Status:', error.response?.status);
		console.error('Message:', error.response?.data?.message || error.message);
		console.groupEnd();
	}
}

export default api;
