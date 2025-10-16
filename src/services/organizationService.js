import api from "../api/api";

/**
 * Mengambil semua organizations
 */
export const getOrganizations = async (params = {}) => {
	const response = await api.get("/organizations", { params });
	return response.data.data || response.data;
};

/**
 * Mengambil detail organization berdasarkan ID
 */
export const getOrganizationById = async (id) => {
	const response = await api.get(`/organizations/${id}`);
	return response.data.data || response.data;
};

/**
 * Membuat organization baru
 */
export const createOrganization = async (orgData) => {
	const response = await api.post("/organizations", orgData);
	return response.data.data || response.data;
};

/**
 * Update organization
 */
export const updateOrganization = async (id, orgData) => {
	const response = await api.put(`/organizations/${id}`, orgData);
	return response.data.data || response.data;
};

/**
 * Hapus organization
 */
export const deleteOrganization = async (id) => {
	const response = await api.delete(`/organizations/${id}`);
	return response.data;
};
