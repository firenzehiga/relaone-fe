import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as categoryService from "@/_services/categoryService";
import { useAuthStore, useUserRole } from "./useAuth";
import { parseApiError, toQueryBuilderParams } from "@/utils";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/components/ui/Toast";

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
export const useAdminCategory = (page = 1, limit = 10, search = "") => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";
	const query = useQuery({
		queryKey: ["adminCategories", page, limit, search],
		queryFn: async () => {
			const params = toQueryBuilderParams({ page, limit, search });

			const response = await categoryService.adminGetCategories(params);
			return response;
		},
		enabled,
		keepPreviousData: true, // Menjaga data sebelumnya saat fetching
		staleTime: 10 * 60 * 1000, // 10 minutes (categories jarang berubah)
		retry: 1,
	});

	return {
		categories: query.data?.data || [],
		pagination: query.data?.pagination || {},
		isLoading: query.isLoading,
		error: query.error,
		isFetching: query.isFetching,
	};
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
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["adminCategories", "create"],
		mutationFn: categoryService.adminCreateCategory,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
			navigate("/admin/categories");

			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Kategori berhasil dibuat",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Create kategori failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali atau Coba lagi.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Create kategori error:", error);
		},
	});
};

/**
 * Hook untuk update category
 * @returns {Object} Mutation object dengan mutate, isLoading, error, etc
 */
export const useAdminUpdateCategoryMutation = () => {
	const navigate = useNavigate();

	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["adminCategories", "update"],
		mutationFn: ({ id, data }) => categoryService.adminUpdateCategory(id, data),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async (_, id) => {
			// Invalidate categories list dan specific category
			await queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
			await queryClient.invalidateQueries({
				queryKey: ["adminCategories", id],
			});
			navigate("/admin/categories");

			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Kategori berhasil diperbarui",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Update Kategori failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali atau Coba lagi.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Update Kategori error:", error);
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
			queryClient.invalidateQueries(["adminCategories"]);
			queryClient.invalidateQueries(["categories"]);
		},
		onError: (error) => {
			console.error("Failed to delete category:", error);
		},
	});
};
