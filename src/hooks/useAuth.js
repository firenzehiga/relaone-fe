import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import * as authService from "@/services/authService";

const useAuthStore = create((set) => ({
	user: null,
	token: localStorage.getItem("token"),
	isAuthenticated: !!localStorage.getItem("token"),

	setAuth: (user, token) => {
		localStorage.setItem("token", token);
		set({ user, token, isAuthenticated: true });
	},

	clearAuth: () => {
		localStorage.removeItem("token");
		set({ user: null, token: null, isAuthenticated: false });
	},

	updateUser: (userData) => {
		set((state) => ({ user: { ...state.user, ...userData } }));
	},
}));

export const useProfile = () => {
	const { isAuthenticated } = useAuthStore();

	return useQuery({
		queryKey: ["auth", "profile"],
		queryFn: async () => {
			const response = await authService.getCurrentUser();
			return response;
		},
		enabled: isAuthenticated,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

export { useAuthStore };
