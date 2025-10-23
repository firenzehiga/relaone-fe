import api from "@/_api";

/**
 * Mengambil semua organizations.
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

/** * Buat organization baru
 *
 * @async
 * @function createOrganization
 * @endpoint POST /organizations
 * @param {Object} orgData - Data organization baru
 * @returns {Promise<any>} Data organization baru
 */
export const createOrganization = async (orgData) => {
	const response = await api.post("/organizations", orgData);
	return response.data.data || response.data;
};

/** * Update organization
 *
 * @async
 * @function updateOrganization
 * @endpoint POST method PUT /organizations/{organizationId}
 * @param {string|number} id - ID organization
 * @param {Object} orgData - Data organization baru
 * @returns {Promise<any>} Data organization baru
 */

export const updateOrganization = async (id, orgData) => {
	const response = await api.post(`/organizations/${id}`, orgData);
	return response.data.data || response.data;
};

/** * Hapus organization
 *
 * @async
 * @function deleteOrganization
 * @endpoint DELETE /organizations/{organizationId}
 * @param {string|number} id - ID organization
 * @returns {Promise<any>} Data organization baru
 */
export const deleteOrganization = async (id) => {
	const response = await api.delete(`/organizations/${id}`);
	return response.data;
};
