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
	const token = localStorage.getItem("authToken");
	const response = await api.get("/admin/locations", {
		params,
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data.data || response.data;
};
