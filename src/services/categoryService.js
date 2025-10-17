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
	return response.data.data || response.data;
};

/**
 * Mengambil detail category berdasarkan ID
 * @param {string|number} id - ID category
 * @returns {Promise} Promise dengan data category
 */
export const getCategoryById = async (id) => {
	const response = await api.get(`/categories/${id}`);
	return response.data.data || response.data;
};

/**
 * Membuat category baru
 * @param {Object} data - Data category baru
 * @returns {Promise} Promise dengan data category baru
 */
export const createCategory = async (data) => {
	const response = await api.post("/categories", data);
	return response.data.data || response.data;
};

/**
 * Update category berdasarkan ID
 * @param {string|number} id - ID category yang akan diupdate
 * @param {Object} data - Data category yang akan diupdate
 * @returns {Promise} Promise dengan data category yang telah diupdate
 */
export const updateCategory = async (id, data) => {
	const response = await api.put(`/categories/${id}`, data);
	return response.data.data || response.data;
};

/**
 * Hapus category berdasarkan ID
 * @param {string|number} id - ID category yang akan dihapus
 * @returns {Promise} Promise dengan data category yang telah dihapus
 */
export const deleteCategory = async (id) => {
	const response = await api.delete(`/categories/${id}`);
	return response.data.data || response.data;
};
