import api, { mockApiResponse } from "../api/api";

// Import mock data untuk development
import organizationsData from "../mock/organizations.json";

/**
 * Service untuk mengelola Organizations API
 * Sementara menggunakan mock data, nanti akan diganti dengan real API calls
 */

/**
 * Mengambil semua organizations
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Promise} Promise dengan data organizations
 */
export const getOrganizations = async (params = {}) => {
	// TODO: Nanti ganti jadi real API call
	// const response = await api.get('/organizations', { params });
	// return response.data;

	const response = await mockApiResponse(organizationsData);
	return response.data;
};

/**
 * Mengambil detail organization berdasarkan ID
 * @param {string|number} id - ID organization
 * @returns {Promise} Promise dengan data organization
 */
export const getOrganizationById = async (id) => {
	// TODO: Nanti ganti jadi real API call
	// return api.get(`/organizations/${id}`);

	const organization = organizationsData.find((o) => o.id === parseInt(id));
	return mockApiResponse(organization);
};

/**
 * Membuat organization baru
 * @param {Object} orgData - Data organization yang akan dibuat
 * @returns {Promise} Promise dengan data organization yang dibuat
 */
export const createOrganization = async (orgData) => {
	// TODO: Nanti ganti jadi real API call
	// return api.post('/organizations', orgData);

	const newOrganization = {
		...orgData,
		id: Date.now(),
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	};
	return mockApiResponse(newOrganization);
};

/**
 * Update organization berdasarkan ID
 * @param {string|number} id - ID organization yang akan diupdate
 * @param {Object} orgData - Data organization yang akan diupdate
 * @returns {Promise} Promise dengan data organization yang diupdate
 */
export const updateOrganization = async (id, orgData) => {
	// TODO: Nanti ganti jadi real API call
	// return api.put(`/organizations/${id}`, orgData);

	const updatedOrganization = {
		...orgData,
		id: parseInt(id),
		updated_at: new Date().toISOString(),
	};
	return mockApiResponse(updatedOrganization);
};
