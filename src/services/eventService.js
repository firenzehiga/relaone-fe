import api from "@/api/api";

/**
 * Service untuk mengelola Events API
 * Menggunakan backend Laravel yang sudah tersedia
 */

/**
 * Mengambil semua events dengan optional filtering
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Promise} Promise dengan data events
 */
export const getEvents = async (params = {}) => {
	const response = await api.get("/events", { params });
	// Laravel API mengembalikan format {success: true, data: [...]}
	return response.data.data || response.data;
};
