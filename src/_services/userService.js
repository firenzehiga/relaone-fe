import api from "@/_api";

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
