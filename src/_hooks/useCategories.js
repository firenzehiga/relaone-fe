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
		staleTime: 10 * 60 * 1000, // 10 minutes (categories jarang berubah)
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

/**
 * Hook untuk membuat category baru
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: categoryService.createCategory,
		onSuccess: () => {
			// Invalidate dan refetch categories list
			queryClient.invalidateQueries({ queryKey: ["categories"] });
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
export const useUpdateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
		onSuccess: (data, variables) => {
			// Invalidate categories list dan specific category
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			queryClient.invalidateQueries({ queryKey: ["categories", variables.id] });
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
		},
		onError: (error) => {
			console.error("Failed to delete category:", error);
		},
	});
};
