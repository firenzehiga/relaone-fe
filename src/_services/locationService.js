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

/** Hapus location
 *
 * @async
 * @function adminDeleteLocation
 * @endpoint DELETE /admin/locations/{locationId}
 * @param {string|number} id - ID location
 * @returns {Promise<any>} Data location yang dihapus
 */
export const adminDeleteLocation = async (id) => {
	const token = localStorage.getItem("authToken");
	try {
		const response = await api.delete(`/admin/locations/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.log("Error deleting location:", error);
		throw error;
	}
};
