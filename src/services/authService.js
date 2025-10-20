import api from "@/api/api";

/**
 * Login user dengan credentials
 */
export const login = async (credentials) => {
	const response = await api.post("/login", credentials);
	return response.data.data || response.data;
};

/**
 * Register user baru
 */
export const register = async (userData) => {
	const response = await api.post("/register", userData);
	return response.data.data || response.data;
};

/**
 * Logout user
 */
export const logout = async () => {
	const response = await api.post("/logout");
	return response.data;
};

/**
 * Mendapatkan informasi user yang sedang login
 */
export const getCurrentUser = async () => {
	const response = await api.get("/user/profile");
	return response.data.data || response.data;
};

/**
 * Refresh authentication token
 */
export const refreshToken = async () => {
	const response = await api.post("/refresh");
	return response.data.data || response.data;
};
