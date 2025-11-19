import api from "@/_api";

// ALL USER SERVICES
/**
 * Mengambil profile user yang sedang login
 */
export const getUserProfile = async () => {
	try {
		const response = await api.get("/user/profile");

		if (response.data.success) {
			return response.data;
		} else {
			throw new Error(response.data.message || "Failed to get user profile");
		}
	} catch (error) {
		// Jika ada response dari server, lempar data (mengandung message & errors)
		if (error.response?.data) {
			throw error.response.data;
		}
		// Jika tidak ada response (network/CORS), lempar error asli
		throw error;
	}
};
/**
 * Update profile user
 */
export const updateUserProfile = async (userData) => {
	try {
		const response = await api.post("/user/profile", userData); // Tetap POST dengan _method: PUT di payload

		if (response.data.success) {
			return response.data;
		} else {
			throw new Error(response.data.message || "Failed to update user profile");
		}
	} catch (error) {
		// Jika ada response dari server, lempar data (mengandung message & errors)
		if (error.response?.data) {
			throw error.response.data;
		}
		console.log("Error updating profile:", error);
		throw error;
	}
};

/**
 * Mengambil daftar event registrations user
 */
export const getUserRegistrations = async () => {
	const response = await api.get("/user/registrations");
	return response.data.data || response.data;
};

// ADMIN SERVICES
/** Mengambil semua users.

 * @async
 * @function adminGetUsers
 * @endpoint GET /admin/users
 * @returns {Promise<any>} Data semua users.
 */
export const adminGetUsers = async (params = {}) => {
	const response = await api.get("/admin/users", { params });
	return response.data.data || response.data;
};

/** Mengambil semua users yang ada di organisasi.

 * @async
 * @function adminGetUsers
 * @endpoint GET /admin/users
 * @returns {Promise<any>} Data semua users.
 */
export const adminGetOrganizationUsers = async (params = {}) => {
	const response = await api.get("/admin/organization-users");
	return response.data.data || response.data;
};

/** Mengambil semua users yang volunteer.

 * @async
 * @function adminGetVolunteerUsers
 * @endpoint GET /admin/users
 * @returns {Promise<any>} Data semua users.
 */
export const adminGetVolunteerUsers = async (params = {}) => {
	const response = await api.get("/admin/volunteer-users");
	return response.data.data || response.data;
};

/** Hapus user
 *
 * @async
 * @function adminDeleteUser
 * @endpoint DELETE /admin/users/{id}
 * @param {string|number} id - ID user
 * @returns {Promise<any>} Data user yang dihapus.
 */
export const adminDeleteUser = async (id) => {
	try {
		const response = await api.delete(`/admin/users/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error deleting user:", error);
		throw error;
	}
};

/** Mengambil data analytics untuk dashboard.

 * @async
 * @function adminGetDashboardAnalytics
 * @endpoint GET /admin/dashboard/analytics
 * @returns {Promise<any>} Data analytics untuk dashboard.
 */
export const adminGetDashboardAnalytics = async (params = {}) => {
	const response = await api.get("/admin/analytics/dashboard", { params });
	return response.data.data || response.data;
};

/** Update rating organisasi beserta eventnya secara massal dengan opsional kirim data id organisasi

 * @async
 * @function adminUpdateOrganizationRatings
 * @endpoint GET /admin/dashboard/analytics
 * @returns {Promise<any>} Data analytics untuk dashboard.
 */
export const adminUpdateOrganizationRatings = async (data = {}) => {
	try {
		const response = await api.post("/admin/organizations/update-ratings", data);
		return response.data;
	} catch (error) {
		console.log("Error updating organization ratings:", error);
		throw error;
	}
};

// ORGANIZATIONS SERVICES

/** Mengambil data analytics untuk dashboard.

 * @async
 * @function orgGetDashboardAnalytics
 * @endpoint GET /organization/dashboard/analytics
 * @returns {Promise<any>} Data analytics untuk dashboard.
 */
export const orgGetDashboardAnalytics = async (params = {}) => {
	const response = await api.get("/organization/analytics/dashboard", {
		params,
	});
	return response.data.data || response.data;
};
