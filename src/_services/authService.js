import api from "@/_api";
import { useJwt } from "react-jwt";

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
		// Jika ada response dari server, lempar data (mengandung message & errors)
		if (error.response?.data) {
			throw error.response.data;
		}
		// Jika tidak ada response (network/CORS), lempar error asli
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
		// Jika ada response dari server, lempar data (mengandung message & errors)
		if (error.response?.data) {
			throw error.response.data;
		}
		// Jika tidak ada response (network/CORS), lempar error asli
		throw error;
	}
};

/**
 * Logout user
 */
export const logout = async () => {
	try {
		const response = await api.post("/logout"); // Remove token from localStorage
		localStorage.removeItem("authToken");
		return response.data;
	} catch (error) {
		// Even if logout fails on server, clear local token
		localStorage.removeItem("authToken");
		// Jika ada response dari server, lempar data (mengandung message & errors)
		if (error.response?.data) {
			throw error.response.data;
		}
		// Jika tidak ada response (network/CORS), lempar error asli
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
		// Jika ada response dari server, lempar data (mengandung message & errors)
		if (error.response?.data) {
			throw error.response.data;
		}
		// Jika tidak ada response (network/CORS), lempar error asli
		throw error;
	}
};

/**
 * Send forgot password email
 */
export const forgotPassword = async (email) => {
	try {
		const response = await api.post("/forgot-password", { email });

		if (response.data.success) {
			return response.data;
		} else {
			throw new Error(response.data.message || "Failed to send reset email");
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
 * Reset password dengan token
 */
export const resetPassword = async (
	token,
	email,
	newPassword,
	confirmPassword
) => {
	try {
		const response = await api.post("/reset-password", {
			token,
			email,
			password: newPassword,
			password_confirmation: confirmPassword,
		});

		if (response.data.success) {
			return response.data;
		} else {
			throw new Error(response.data.message || "Password reset failed");
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

export const useDecodeToken = (token) => {
	const { decodeToken, isExpired } = useJwt(token);

	try {
		if (isExpired) {
			return {
				success: false,
				message: "Token expired",
				data: null,
			};
		}

		return {
			success: true,
			message: "Token valid",
			data: decodeToken,
		};
	} catch (error) {
		return {
			success: false,
			message: error.message,
			data: null,
		};
	}
};
