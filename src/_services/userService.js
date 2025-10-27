import api from "@/_api";

// ALL USER SERVICES
/**
 * Mengambil profile user yang sedang login
 */
export const getUserProfile = async () => {
	const response = await api.get("/user/profile");
	return response.data.data || response.data;
};

/**
 * Update profile user
 */
export const updateUserProfile = async (userData) => {
	const response = await api.put("/user/profile", userData);
	return response.data.data || response.data;
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
	const token = localStorage.getItem("authToken");
	const response = await api.get("/admin/users", {
		params,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data.data || response.data;
};

/** Mengambil semua users.

 * @async
 * @function adminGetUsers
 * @endpoint GET /admin/users
 * @returns {Promise<any>} Data semua users.
 */
export const adminGetOrganizationUsers = async (params = {}) => {
	const token = localStorage.getItem("authToken");
	const response = await api.get("/admin/organization-users", {
		params,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data.data || response.data;
};
