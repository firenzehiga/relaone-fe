import api, { mockApiResponse } from "../api/api";

// Import mock data untuk development
import usersData from "../mock/users.json";

/**
 * Service untuk mengelola Authentication API
 * Sementara menggunakan mock data, nanti akan diganti dengan real API calls
 */

/**
 * Login user dengan credentials
 * @param {Object} credentials - Email/username dan password
 * @returns {Promise} Promise dengan data authentication
 */
export const login = async (credentials) => {
	// TODO: Nanti ganti jadi real API call
	// return api.post('/auth/login', credentials);

	// Mock: assume login successful dengan user pertama
	const mockUser = usersData[0];
	const response = {
		user: mockUser,
		token: `mock-jwt-token-${Date.now()}`,
		expires_in: 3600,
		message: "Login successful",
	};

	return mockApiResponse(response);
};

/**
 * Register user baru
 * @param {Object} userData - Data user untuk registrasi
 * @returns {Promise} Promise dengan data user yang dibuat
 */
export const register = async (userData) => {
	// TODO: Nanti ganti jadi real API call
	// return api.post('/auth/register', userData);

	const newUser = {
		...userData,
		id: Date.now(),
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	};

	const response = {
		user: newUser,
		token: `mock-jwt-token-${Date.now()}`,
		expires_in: 3600,
		message: "Registration successful",
	};

	return mockApiResponse(response);
};

/**
 * Logout user
 * @returns {Promise} Promise dengan response success
 */
export const logout = async () => {
	// TODO: Nanti ganti jadi real API call
	// return api.post('/auth/logout');

	return mockApiResponse({
		success: true,
		message: "Logout successful",
	});
};

/**
 * Mendapatkan informasi user yang sedang login
 * @returns {Promise} Promise dengan data user
 */
export const getCurrentUser = async () => {
	// TODO: Nanti ganti jadi real API call
	// return api.get('/auth/me');

	return mockApiResponse(usersData[0]);
};

/**
 * Refresh authentication token
 * @returns {Promise} Promise dengan token baru
 */
export const refreshToken = async () => {
	// TODO: Nanti ganti jadi real API call
	// return api.post('/auth/refresh');

	return mockApiResponse({
		token: `mock-refreshed-token-${Date.now()}`,
		expires_in: 3600,
	});
};
