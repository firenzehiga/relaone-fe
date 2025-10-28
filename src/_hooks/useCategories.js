import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as categoryService from "../_services/categoryService";
import { useUserRole } from "./useAuth";

// === PUBLIC HOOKS ===
/**
 * Hook untuk mengambil data categories
 * @returns {Object} Query result dengan data categories
 */
export const useCategory = () => {
	return useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const response = await categoryService.getCategories();
			return response;
		},
		// staleTime: 10 * 60 * 1000, // 10 minutes (categories jarang berubah)
		retry: 1,
	});
};

/**
 * Hook untuk mengambil detail category berdasarkan ID
 * @param {string|number} id - ID category
 * @returns {Object} Query result dengan data category
 */
export const useCategoryById = (id) => {
	return useQuery({
		queryKey: ["categories", id],
		queryFn: () => categoryService.getCategoryById(id),
		enabled: !!id,
		staleTime: 10 * 60 * 1000,
		retry: 2,
	});
};

// === ADMIN HOOKS ===
export const useAdminCategory = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";
	return useQuery({
		queryKey: ["adminCategories"],
		queryFn: async () => {
			const response = await categoryService.adminGetCategories();
			return response;
		},
		enabled,
		staleTime: 10 * 60 * 1000, // 10 minutes (categories jarang berubah)
		retry: 1,
	});
};

export const useAdminCategoryById = (id) => {
	return useQuery({
		queryKey: ["adminCategories", id],
		queryFn: () => categoryService.adminGetCategoryById(id),
		enabled: !!id,
		staleTime: 10 * 60 * 1000,
		retry: 2,
	});
};

/**
 * Hook untuk membuat category baru
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useAdminCreateCategoryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: categoryService.adminCreateCategory,
		onSuccess: () => {
			// Invalidate dan refetch categories list
			queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
		},
		onError: (error) => {
			console.error("Failed to create category:", error);
		},
	});
};

/**
 * Hook untuk update category
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useAdminUpdateCategoryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => categoryService.adminUpdateCategory(id, data),
		onSuccess: (_, id) => {
			// Invalidate categories list dan specific category
			queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
			queryClient.invalidateQueries({ queryKey: ["adminCategories", id] });
		},
		onError: (error) => {
			console.error("Failed to update category:", error);
		},
	});
};

/**
 * Hook untuk delete category
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useAdminDeleteCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: categoryService.adminDeleteCategory,
		onSuccess: () => {
			// Invalidate categories list
			queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
		onError: (error) => {
			console.error("Failed to delete category:", error);
		},
	});
};
