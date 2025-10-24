import api from "@/_api";

/**
 * Service untuk mengelola Categories API
 * Menggunakan backend Laravel yang sudah tersedia
 */

// PUBLIC SERVICES
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

// ADMIN SERVICES
/**
 * Membuat category baru
 * @param {Object} data - Data category baru
 * @returns {Promise} Promise dengan data category baru
 */

/**
 * Mengambil semua categories
 * @returns {Promise} Promise dengan data categories
 */
export const adminGetCategories = async () => {
	const response = await api.get("/admin/categories");
	return response.data.data || response.data;
};

/**
 * Mengambil detail category berdasarkan ID
 * @param {string|number} id - ID category
 * @returns {Promise} Promise dengan data category
 */
export const adminGetCategoryById = async (id) => {
	const response = await api.get(`/admin/categories/${id}`);
	return response.data.data || response.data;
};
export const adminCreateCategory = async (data) => {
	const response = await api.post("/admin/categories", data);
	return response.data.data || response.data;
};

/**
 * Update category berdasarkan ID
 * @param {string|number} id - ID category yang akan diupdate
 * @param {Object} data - Data category yang akan diupdate
 * @returns {Promise} Promise dengan data category yang telah diupdate
 */
export const adminUpdateCategory = async (id, data) => {
	const response = await api.put(`/admin/categories/${id}`, data);
	return response.data.data || response.data;
};

/**
 * Hapus category berdasarkan ID
 * @param {string|number} id - ID category yang akan dihapus
 * @returns {Promise} Promise dengan data category yang telah dihapus
 */
export const adminDeleteCategory = async (id) => {
	const response = await api.delete(`/admin/categories/${id}`);
	return response.data.data || response.data;
};
