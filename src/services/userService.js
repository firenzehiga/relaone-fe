import api, { mockApiResponse } from "../api/api";

// Import mock data untuk development
import usersData from "../mock/users.json";
import eventsData from "../mock/events.json";

/**
 * Service untuk mengelola Users API
 * Sementara menggunakan mock data, nanti akan diganti dengan real API calls
 */

/**
 * Mengambil profile user yang sedang login
 * @returns {Promise} Promise dengan data profile user
 */
export const getUserProfile = async () => {
	// TODO: Nanti ganti jadi real API call
	// return api.get('/users/profile');

	return mockApiResponse(usersData[0]);
};

/**
 * Update profile user
 * @param {Object} userData - Data profile yang akan diupdate
 * @returns {Promise} Promise dengan data profile yang diupdate
 */
export const updateUserProfile = async (userData) => {
	// TODO: Nanti ganti jadi real API call
	// return api.put('/users/profile', userData);

	const updatedProfile = {
		...usersData[0],
		...userData,
		updated_at: new Date().toISOString(),
	};

	return mockApiResponse(updatedProfile);
};

/**
 * Mengambil daftar event registrations user
 * @returns {Promise} Promise dengan data registrations
 */
export const getUserRegistrations = async () => {
	// TODO: Nanti ganti jadi real API call
	// return api.get('/users/registrations');

	// Mock: return 3 events pertama sebagai registered events
	const mockRegistrations = eventsData.slice(0, 3).map((event) => ({
		...event,
		registration_date: new Date().toISOString(),
		status: "confirmed",
	}));

	return mockApiResponse(mockRegistrations);
};
