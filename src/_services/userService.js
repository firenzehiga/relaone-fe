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
