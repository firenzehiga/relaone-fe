import api from "@/api";

/**
 * Login user dengan credentials
 */
export const login = async (credentials) => {
	try {
		const response = await api.post("/login", credentials);

		if (response.data.success) {
			// Store token in localStorage
			localStorage.setItem("authToken", response.data.data.token);
			return response.data;
		} else {
			throw new Error(response.data.message || "Login failed");
		}
	} catch (error) {
		if (error.response?.data) {
			throw new Error(error.response.data.message || "Login failed");
		}
		throw error;
	}
};

/**
 * Register user baru
 */
export const register = async (userData) => {
	try {
		const response = await api.post("/register", userData);

		if (response.data.success) {
			// Store token in localStorage
			localStorage.setItem("authToken", response.data.data.token);
			return response.data;
		} else {
			throw new Error(response.data.message || "Registration failed");
		}
	} catch (error) {
		if (error.response?.data) {
			throw new Error(error.response.data.message || "Registration failed");
		}
		throw error;
	}
};

/**
 * Logout user
 */
export const logout = async () => {
	try {
		const response = await api.post("/logout");
		// Remove token from localStorage
		localStorage.removeItem("authToken");
		return response.data;
	} catch (error) {
		// Even if logout fails on server, clear local token
		localStorage.removeItem("authToken");
		throw error;
	}
};

/**
 * Mendapatkan informasi user yang sedang login
 */
export const getCurrentUser = async () => {
	try {
		const response = await api.get("/user/myProfile");

		if (response.data.success) {
			return response.data;
		} else {
			throw new Error(response.data.message || "Failed to get user profile");
		}
	} catch (error) {
		if (error.response?.data) {
			throw new Error(
				error.response.data.message || "Failed to get user profile"
			);
		}
		throw error;
	}
};

/**
 * Refresh authentication token
 */
export const refreshToken = async () => {
	try {
		const response = await api.post("/refresh");

		if (response.data.success) {
			// Update token in localStorage
			localStorage.setItem("authToken", response.data.data.token);
			return response.data;
		} else {
			throw new Error(response.data.message || "Token refresh failed");
		}
	} catch (error) {
		if (error.response?.data) {
			throw new Error(error.response.data.message || "Token refresh failed");
		}
		throw error;
	}
};
