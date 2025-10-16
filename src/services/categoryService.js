import api from "../api/api";

/**
 * Service untuk mengelola Categories API
 * Menggunakan backend Laravel yang sudah tersedia
 */

/**
 * Mengambil semua categories
 * @returns {Promise} Promise dengan data categories
 */
export const getCategories = async () => {
	const response = await api.get("/categories");
	// Laravel API mengembalikan format {success: true, data: [...]}
	return response.data.data || response.data;
};

/**
 * Mengambil detail category berdasarkan ID
 * @param {string|number} id - ID category
 * @returns {Promise} Promise dengan data category
 */
export const getCategoryById = async (id) => {
	const response = await api.get(`/categories/${id}`);
	// Laravel API mengembalikan format {success: true, data: {...}}
	return response.data.data || response.data;
};
