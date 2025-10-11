import api, { mockApiResponse } from "../api/api";

// Import mock data untuk development
import categoriesData from "../mock/categories.json";

/**
 * Service untuk mengelola Categories API
 * Sementara menggunakan mock data, nanti akan diganti dengan real API calls
 */

/**
 * Mengambil semua categories
 * @returns {Promise} Promise dengan data categories
 */
export const getCategories = async () => {
	// TODO: Nanti ganti jadi real API call
	// const response = await api.get('/categories');
	// return response.data;

	const response = await mockApiResponse(categoriesData);
	return response.data;
};

/**
 * Mengambil detail category berdasarkan ID
 * @param {string|number} id - ID category
 * @returns {Promise} Promise dengan data category
 */
export const getCategoryById = async (id) => {
	// TODO: Nanti ganti jadi real API call
	// const response = await api.get(`/categories/${id}`);
	// return response.data;

	const category = categoriesData.find((c) => c.id === parseInt(id));
	const response = await mockApiResponse(category);
	return response.data;
};
