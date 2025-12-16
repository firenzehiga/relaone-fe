import api from "@/_api";

// ADMIN SERVICES
/** Mengambil semua locations dengan optional filtering
 *
 * @async
 * @function adminGetLocations
 * @endpoint GET /admin/locations
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Promise} Promise dengan data locations
 */
export const adminGetLocations = async (params = {}) => {
	const response = await api.get("/admin/locations", { params });
	return response.data;
};

/** Mengambil detail lokasi berdasarkan ID.
 *
 * @async
 * @function adminGetLocationById
 * @endpoint GET /admin/locations/{locationId}
 * @param {string|number} id - ID lokasi
 */
export const adminGetLocationById = async (id) => {
	const response = await api.get(`/admin/locations/${id}`);
	return response.data.data || response.data;
};

/** * Buat location baru
 *
 * @async
 * @function adminCreateLocation
 * @endpoint POST /admin/locations
 * @param {Object} data - Data location baru
 * @returns {Promise<any>} Data location baru
 */
export const adminCreateLocation = async (data) => {
	const response = await api.post("/admin/locations", data);
	return response.data.data || response.data;
};

/** * Update location
 *
 * @async
 * @function adminUpdateLocation
 * @endpoint POST method PUT /admin/locations/{locationId}
 * @param {string|number} id - ID location
 * @param {Object} data - Data location baru
 * @returns {Promise<any>} Data location baru
 */
export const adminUpdateLocation = async (id, data) => {
	try {
		const response = await api.post(`/admin/locations/${id}`, data);
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error updating event:", error);
		throw error;
	}
};

/** Hapus location
 *
 * @async
 * @function adminDeleteLocation
 * @endpoint DELETE /admin/locations/{locationId}
 * @param {string|number} id - ID location
 * @returns {Promise<any>} Data location yang dihapus
 */
export const adminDeleteLocation = async (id) => {
	try {
		const response = await api.delete(`/admin/locations/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error deleting location:", error);
		throw error;
	}
};

// ORGANIZATION SERVICES
/** Mengambil semua locations dengan optional filtering
 *
 * @async
 * @function orgGetLocations
 * @endpoint GET /organization/locations
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Promise} Promise dengan data locations
 */
export const orgGetLocations = async (params = {}) => {
	const response = await api.get("/organization/locations", { params });
	return response.data;
};

/** Mengambil detail lokasi berdasarkan ID.
 *
 * @async
 * @function orgGetLocationById
 * @endpoint GET /organization/locations/{locationId}
 * @param {string|number} id - ID lokasi
 */
export const orgGetLocationById = async (id) => {
	const response = await api.get(`/organization/locations/${id}`);
	return response.data.data || response.data;
};

/** * Buat location baru
 *
 * @async
 * @function orgCreateLocation
 * @endpoint POST /organization/locations
 * @param {Object} data - Data location baru
 * @returns {Promise<any>} Data location baru
 */
export const orgCreateLocation = async (data) => {
	const response = await api.post("/organization/locations", data);
	return response.data.data || response.data;
};

/** * Update location
 *
 * @async
 * @function orgUpdateLocation
 * @endpoint POST method PUT /organization/locations/{locationId}
 * @param {string|number} id - ID location
 * @param {Object} data - Data location baru
 * @returns {Promise<any>} Data location baru
 */
export const orgUpdateLocation = async (id, data) => {
	try {
		const response = await api.post(`/organization/locations/${id}`, data);
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error updating event:", error);
		throw error;
	}
};

/** Hapus location
 *
 * @async
 * @function orgDeleteLocation
 * @endpoint DELETE /organization/locations/{locationId}
 * @param {string|number} id - ID location
 * @returns {Promise<any>} Data location yang dihapus
 */
export const orgDeleteLocation = async (id) => {
	try {
		const response = await api.delete(`/organization/locations/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error deleting location:", error);
		throw error;
	}
};
