import api from "@/_api";

// PUBLIC SERVICES
/** Mengambil semua organizations.
 *
 * @async
 * @function getOrganizations
 * @endpoint GET /organizations
 * @returns {Promise<any>} Data semua organizations.
 */
export const getOrganizations = async (params = {}) => {
	const response = await api.get("/organizations", { params });
	return response.data.data || response.data;
};

/** Mengambil detail organization berdasarkan ID.
 *
 * @async
 * @function getOrganizationById
 * @endpoint GET /organizations/{organizationId}
 * @param {string|number} id - ID organization
 * @returns {Promise<any>} Data detail organization
 */
export const getOrganizationById = async (id) => {
	const response = await api.get(`/organizations/${id}`);
	return response.data.data || response.data;
};

// ADMIN SERVICES
/** Mengambil semua organizations.
 *
 * @async
 * @function adminGetOrganizations
 * @endpoint GET /admin/organizations
 * @returns {Promise<any>} Data semua organizations.
 */
export const adminGetOrganizations = async (params = {}) => {
	const response = await api.get("/admin/organizations", {
		params,
	});
	return response.data;
};

/** Mengambil detail organization berdasarkan ID.
 *
 * @async
 * @function adminGetOrganizationById
 * @endpoint GET /admin/organizations/{organizationId}
 * @param {string|number} id - ID organization
 * @returns {Promise<any>} Data detail organization
 */
export const adminGetOrganizationById = async (id) => {
	const response = await api.get(`/admin/organizations/${id}`);
	return response.data.data || response.data;
};

/** Buat organization baru
 *
 * @async
 * @function adminCreateOrganization
 * @endpoint POST /admin/organizations
 * @param {Object} data - Data organization baru
 * @returns {Promise<any>} Data organization baru
 */
export const adminCreateOrganization = async (data) => {
	try {
		const response = await api.post("/admin/organizations", data);
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error creating organization:", error);
		throw error;
	}
};

/** Update organization
 *
 * @async
 * @function adminUpdateOrganization
 * @endpoint POST /admin/organizations/{organizationId}
 * @param {string|number} id - ID organization
 * @param {Object} data - Data organization baru
 * @returns {Promise<any>} Data organization baru
 */
export const adminUpdateOrganization = async (id, data) => {
	try {
		const response = await api.post(`/admin/organizations/${id}`, data);
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error updating organization:", error);
		throw error;
	}
};

/** Hapus organization
 *
 * @async
 * @function adminDeleteOrganization
 * @endpoint DELETE /admin/organizations/{organizationId}
 * @param {string|number} id - ID organization
 * @returns {Promise<any>} Data organization baru
 */
export const adminDeleteOrganization = async (id) => {
	try {
		const response = await api.delete(`/admin/organizations/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error deleting organization:", error);
		throw error;
	}
};
