import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as eventService from "@/_services/eventService";
import { useAuthStore, useUserRole } from "./useAuth";
import { useNavigate } from "react-router-dom";
import { parseApiError, toQueryBuilderParams } from "@/utils";
import { showToast } from "@/components/ui/Toast";

// === PUBLIC HOOKS ===
/**
 * Hook untuk mengambil data events
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useEvents = (params = {}) => {
	const currentRole = useUserRole();
	const enabled = currentRole !== "admin" && currentRole !== "organization"; // supaya kalo admin login, ga fetch events

	return useQuery({
		queryKey: ["events"],
		queryFn: async () => {
			const response = await eventService.getEvents(params);
			return response;
		},
		enabled,
		// staleTime: 1 * 60 * 1000,
		// cacheTime: 5 * 60 * 1000,
		// retry: 1,
	});
};

/**
 * Ambil detail event berdasarkan ID.
 *
 * @param {string|number} eventId - ID event
 * @param {Object} options - Additional query options
 * @returns {UseQueryResult<Object>} Data detail event
 */
export const useEventById = (id) => {
	const currentRole = useUserRole();
	const enabled = currentRole !== "admin" && currentRole !== "organization" && !!id; // supaya kalo admin login, ga fetch events

	return useQuery({
		queryKey: ["detailEvent", id],
		queryFn: async () => {
			const response = await eventService.getEventById(id);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
		refetchOnWindowFocus: false, // Default tidak refetch saat focus
		refetchOnMount: true,
	});
};

// === ADMIN HOOKS ===
/**
 * Hook untuk mengambil data events (admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminEvents = (page = 1, limit = 10, search = "") => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin"; // supaya kalo admin login, ga fetch events

	const query = useQuery({
		queryKey: ["adminEvents", page, limit, search],
		queryFn: async () => {
			const params = toQueryBuilderParams({ page, limit, search });

			const response = await eventService.adminGetEvents(params);
			return response;
		},
		enabled,
		keepPreviousData: true, // Menjaga data sebelumnya saat fetching
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});

	return {
		events: query.data?.data || [],
		pagination: query.data?.pagination || {},
		isLoading: query.isLoading,
		error: query.error,
		isFetching: query.isFetching,
	};
};

/**
 * Hook untuk mengambil data events berdasarkan ID (admin)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminEventById = (id) => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin" && !!id;

	return useQuery({
		queryKey: ["adminEvents", id],
		queryFn: async () => {
			const response = await eventService.adminGetEventById(id);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Buat event baru (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["events"]
 */
export const useAdminCreateEventMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["adminEvents", "create"],
		mutationFn: eventService.adminCreateEvent,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries(["adminEvents"]);
			navigate("/admin/events");

			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Event berhasil dibuat",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Create event failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali atau Coba lagi.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
		},
	});
};

/**
 * Update event (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @param {Object} variables - Parameter update
 * @param {string|number} variables.eventId - ID event
 * @param {Object} variables.data - Data event baru
 * @invalidates ["events"]
 */
export const useAdminUpdateEventMutation = () => {
	const navigate = useNavigate();

	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["adminEvents", "update"],
		mutationFn: ({ id, data }) => eventService.adminUpdateEvent(id, data),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async (_, id) => {
			await queryClient.invalidateQueries(["adminEvents"]);
			queryClient.invalidateQueries(["adminEvents", id]);
			// query key publik
			queryClient.invalidateQueries(["detailEvent", id]);
			navigate("/admin/events");

			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Event berhasil diperbarui",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Update event failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali atau Coba lagi.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
		},
	});
};

/**
 * Hapus event (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["mentorEvents"]
 * @optimisticUpdate Cache ["adminEvents"] langsung difilter
 */
export const useAdminDeleteEventMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: eventService.adminDeleteEvent,
		onSuccess: (_, id) => {
			queryClient.invalidateQueries(["adminEvents"]);
			queryClient.invalidateQueries(["orgEvents"]);
		},
	});
};

// === ORGANIZATION HOOKS ===
/**
 * Hook untuk mengambil data events (organization)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useOrgEvents = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "organization";

	return useQuery({
		queryKey: ["orgEvents"],
		queryFn: async () => {
			const response = await eventService.orgGetEvents();
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Hook untuk mengambil data events berdasarkan ID (organization)
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useOrgEventById = (id) => {
	const currentRole = useUserRole();
	const enabled = currentRole === "organization" && !!id;

	return useQuery({
		queryKey: ["orgEvents", id],
		queryFn: async () => {
			const response = await eventService.orgGetEventById(id);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Buat event baru (organization).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["events"]
 */
export const useOrgCreateEventMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["orgEvents", "create"],
		mutationFn: eventService.orgCreateEvent,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries(["orgEvents"]);
			navigate("/organization/events");

			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Event berhasil dibuat",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Create event failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali atau Coba lagi.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
		},
	});
};

/**
 * Update event (organization).
 *
 * @returns {UseMutationResult} Mutation hook
 * @param {Object} variables - Parameter update
 * @param {string|number} variables.eventId - ID event
 * @param {Object} variables.data - Data event baru
 * @invalidates ["events"]
 */
export const useOrgUpdateEventMutation = () => {
	const navigate = useNavigate();

	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["orgEvents", "update"],
		mutationFn: ({ id, data }) => eventService.orgUpdateEvent(id, data),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async (_, id) => {
			await queryClient.invalidateQueries(["orgEvents"]);
			queryClient.invalidateQueries(["orgEvents", id]);
			// query key publik
			queryClient.invalidateQueries(["detailEvent", id]);
			navigate("/organization/events");

			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Event berhasil diperbarui",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Update event failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali atau Coba lagi.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
		},
	});
};

/**
 * Hapus event (organization).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["mentorEvents"]
 * @optimisticUpdate Cache ["orgEvents"] langsung difilter
 */
export const useOrgDeleteEventMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: eventService.orgDeleteEvent,
		onSuccess: (_, id) => {
			queryClient.setQueryData(["orgEvents"], (oldData) =>
				oldData.filter((event) => event.id !== id)
			);
			queryClient.invalidateQueries(["orgEvents"]);
			queryClient.invalidateQueries(["events"]);
		},
	});
};

/**
 * Start event (organization) mutation
 */
export const useOrgStartEventMutation = () => {
	const queryClient = useQueryClient();
	const { setLoading } = useAuthStore();

	return useMutation({
		mutationFn: eventService.orgStartEvent,
		onMutate: () => setLoading(true),
		onSuccess: (data, id) => {
			// invalidate relevant queries
			queryClient.invalidateQueries(["orgEvents"]);
			queryClient.invalidateQueries(["orgEvents", id]);
			queryClient.invalidateQueries(["events"]);
			queryClient.invalidateQueries(["detailEvent", id]);
			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil",
				message: data?.message,
				tipText: `Sekarang: ${data?.now}`,
			});
		},
		onError: (error) => {
			setLoading(false);

			const msg = parseApiError(error); // tetap gunakan untuk teks pesan
			const data = error?.response?.data ?? {};
			const { starts_at: startsAt, now, app_timezone: appTz } = data;

			let tipText = "Periksa kembali atau Coba lagi.";
			if (startsAt) {
				tipText = `Event seharusnya dimulai pada: ${startsAt}`;
				if (now) tipText += `\nSekarang: ${now}`;
				if (appTz) tipText += ` (${appTz})`;
			}

			showToast({ type: "error", message: msg, tipText });
		},
	});
};

/**
 * Complete event (organization) mutation
 */
export const useOrgCompleteEventMutation = () => {
	const queryClient = useQueryClient();
	const { setLoading } = useAuthStore();

	return useMutation({
		mutationFn: eventService.orgCompleteEvent,
		onMutate: () => setLoading(true),
		onSuccess: (data, id) => {
			queryClient.invalidateQueries(["orgEvents"]);
			queryClient.invalidateQueries(["orgEvents", id]);
			queryClient.invalidateQueries(["events"]);
			queryClient.invalidateQueries(["detailEvent", id]);
			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil",
				message: "Event selesai.",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Gagal menyelesaikan event.";
			showToast({ type: "error", message: msg });
		},
	});
};

/**
 * Cancel event (organization) mutation
 * Expects variables: { id, data }
 */
export const useOrgCancelEventMutation = () => {
	const queryClient = useQueryClient();
	const { setLoading } = useAuthStore();

	return useMutation({
		mutationFn: ({ id, data }) => eventService.orgCancelEvent(id, data),
		onMutate: () => setLoading(true),
		onSuccess: (data, vars) => {
			const id = vars?.id;
			queryClient.invalidateQueries(["orgEvents"]);
			if (id) queryClient.invalidateQueries(["orgEvents", id]);
			queryClient.invalidateQueries(["events"]);
			if (id) queryClient.invalidateQueries(["detailEvent", id]);
			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil",
				message: "Event dibatalkan.",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Gagal membatalkan event.";
			showToast({ type: "error", message: msg });
		},
	});
};
