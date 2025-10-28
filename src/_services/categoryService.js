import api from "@/_api";

// PUBLIC SERVICES
/** Mengambil semua categories.
 *
 * @async
 * @function getCategories
 * @endpoint GET /categories
 * @returns {Promise<any>} Data semua categories.
 */
export const getCategories = async () => {
	const response = await api.get("/categories");
	return response.data.data || response.data;
};

/** Mengambil detail category berdasarkan ID.
 *
 * @async
 * @function getCategoryById
 * @endpoint GET /categories/{categoryId}
 * @param {string|number} id - ID category
 * @returns {Promise<any>} Data detail category
 */
export const getCategoryById = async (id) => {
	const response = await api.get(`/categories/${id}`);
	return response.data.data || response.data;
};

// ADMIN SERVICES
/** Mengambil semua categories.
 *
 * @async
 * @function adminGetCategories
 * @endpoint GET /admin/categories
 * @returns {Promise<any>} Data semua categories.
 */
export const adminGetCategories = async () => {
	const token = localStorage.getItem("authToken");
	const response = await api.get("/admin/categories", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data.data || response.data;
};

/** Mengambil detail category berdasarkan ID.
 *
 * @async
 * @function adminGetCategoryById
 * @endpoint GET /admin/categories/{categoryId}
 * @param {string|number} id - ID category
 * @returns {Promise<any>} Data detail category
 */
export const adminGetCategoryById = async (id) => {
	const token = localStorage.getItem("authToken");
	const response = await api.get(`/admin/categories/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data.data || response.data;
};

/** Buat category baru
 *
 * @async
 * @function adminCreateCategory
 * @endpoint POST /admin/categories
 * @param {Object} categoryData - Data category baru
 * @returns {Promise<any>} Data category baru
 */
export const adminCreateCategory = async (data) => {
	const token = localStorage.getItem("authToken");
	try {
		const response = await api.post("/admin/categories", data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error creating category:", error);
		throw error;
	}
};

/** Update category berdasarkan ID
 *
 * @async
 * @function adminUpdateCategory
 * @endpoint POST /admin/categories/{categoryId}
 * @param {string|number} id - ID category
 * @param {Object} categoryData - Data category baru
 * @returns {Promise<any>} Data category baru
 */
export const adminUpdateCategory = async (id, data) => {
	const token = localStorage.getItem("authToken");
	try {
		const response = await api.post(`/admin/categories/${id}`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error updating category:", error);
		throw error;
	}
};

/** Hapus category berdasarkan ID
 *
 * @async
 * @function adminDeleteCategory
 * @endpoint DELETE /admin/categories/{categoryId}
 * @param {string|number} id - ID category
 * @returns {Promise<any>} Data category baru
 */
export const adminDeleteCategory = async (id) => {
	const token = localStorage.getItem("authToken");
	const response = await api.delete(`/admin/categories/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data.data || response.data;
};
