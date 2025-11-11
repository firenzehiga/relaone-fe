import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as eventParticipantService from "@/_services/eventParticipantService";
import { useAuthStore, useUserRole } from "./useAuth";
import { useNavigate } from "react-router-dom";
import { parseApiError } from "@/utils";
import { showToast } from "@/components/ui/Toast";

/** PUBLIC HOOKS
 *
 * Hook untuk mengambil data event participants
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useParticipants = (params = {}) => {
	const currentRole = useUserRole();
	const enabled = currentRole !== "admin" && currentRole !== "organization"; // supaya kalo admin login, ga fetch events

	return useQuery({
		queryKey: ["participants", params],
		queryFn: async () => {
			const response = await eventParticipantService.getParticipants(params);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 100,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/** VOLUNTEER HOOKS
 * Join event sebagai participant.
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["participants", "detailEvent", "events"]
 */
export const useVolunteerJoinEventMutation = () => {
	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["participants", "join"],
		mutationFn: eventParticipantService.volunteerJoinEvent,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async (_data, variables) => {
			const eventId = variables?.event_id || variables?.id;

			console.log("Join event success:", eventId);

			// Hanya invalidate query yang benar-benar perlu
			if (eventId) {
				// Invalidate detail event spesifik (bukan await, biar tidak blocking)
				queryClient.invalidateQueries({
					queryKey: ["detailEvent", eventId],
					refetchType: "active", // Hanya refetch yang sedang active/mounted
				});
			}

			// Invalidate list events untuk update counter peserta
			queryClient.invalidateQueries({
				queryKey: ["events"],
				refetchType: "none", // Jangan auto refetch, tunggu manual
			});

			// Loading akan di-handle di component setelah animation selesai
			// setLoading akan dipanggil manual di component
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Gagal mendaftar event";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Join event error:", error);
		},
	});
};

/** ADMIN HOOKS
 *
 * Hook untuk mengambil data event participants hanya untuk admin
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useAdminParticipants = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin";

	return useQuery({
		queryKey: ["adminParticipants"],
		queryFn: async () => {
			const response = await eventParticipantService.adminGetParticipants();
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Ambil detail participant berdasarkan ID.
 *
 * @param {string|number} participantId - ID participant
 * @returns {UseQueryResult<Object>} Data detail participant
 */
export const useAdminParticipantById = (id) => {
	const currentRole = useUserRole();
	const enabled = currentRole === "admin" && !!id;
	return useQuery({
		queryKey: ["adminParticipants", id],
		queryFn: async () => {
			const response = await eventParticipantService.adminGetParticipantById(
				id
			);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Buat participant baru (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["participants"]
 */
export const useAdminCreateParticipantMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["adminParticipants", "create"],
		mutationFn: eventParticipantService.adminCreateParticipant,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries(["adminParticipants"]);
			navigate("/admin/event-participants");
			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Participant berhasil dibuat",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Create participant failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali logic yang Anda buat.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Create participant error:", error);
		},
	});
};

/**
 * Update participant (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @param {Object} variables - Parameter update
 * @param {string|number} variables.participantId - ID participant
 * @param {Object} variables.payload - Data participant baru
 */
export const useAdminUpdateParticipantMutation = () => {
	const navigate = useNavigate();

	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["adminParticipants", "update"],
		mutationFn: ({ id, data }) =>
			eventParticipantService.adminUpdateParticipant(id, data),
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async (_, id) => {
			await queryClient.invalidateQueries(["adminParticipants"]);
			queryClient.invalidateQueries(["adminParticipants", id]);
			navigate("/admin/event-participants");

			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Participant berhasil diperbarui",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Update participant failed";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali logic yang Anda buat.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Update participant error:", error);
		},
	});
};

/**
 * Hapus participant (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["adminParticipants"]
 * @optimisticUpdate Cache ["adminParticipants"] langsung difilter
 */
export const useAdminDeleteParticipantMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: eventParticipantService.adminDeleteParticipant,
		onSuccess: (_, id) => {
			queryClient.setQueryData(["adminParticipants"], (oldData) =>
				oldData.filter((participant) => participant.id !== id)
			);
			queryClient.invalidateQueries(["adminParticipants"]);
		},
	});
};

/** ORGANIZATION HOOKS
 *
 * Hook untuk mengambil data event participants hanya untuk organization
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useOrgParticipants = () => {
	const currentRole = useUserRole();
	const enabled = currentRole === "organization";

	return useQuery({
		queryKey: ["orgParticipants"],
		queryFn: async () => {
			const response = await eventParticipantService.orgGetParticipants();
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Konfirmasi status participant baru.
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["participants"]
 */
export const useOrgConfirmParticipantMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["orgParticipants", "confirm"],
		mutationFn: eventParticipantService.orgConfirmParticipant,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries(["orgParticipants"]);
			navigate("/organization/event-participants");
			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Participant berhasil dikonfirmasi",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Konfirmasi participant gagal";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali logic yang Anda buat.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Confirm participant error:", error);
		},
	});
};

/**
 * Tolak status participant baru.
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["participants"]
 */
export const useOrgRejectParticipantMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setLoading, clearError, setError } = useAuthStore();

	return useMutation({
		mutationKey: ["orgParticipants", "reject"],
		mutationFn: eventParticipantService.orgRejectParticipant,
		onMutate: () => {
			setLoading(true);
			clearError();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries(["orgParticipants"]);
			navigate("/organization/event-participants");
			setLoading(false);
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Participant berhasil ditolak",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			setLoading(false);
			const msg = parseApiError(error) || "Tolak participant gagal";
			setError(msg);
			showToast({
				type: "error",
				tipIcon: "💡",
				tipText: "Periksa kembali logic yang Anda buat.",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Reject participant error:", error);
		},
	});
};

/**
 * Hook untuk mengambil statistics attendance untuk organization
 * @param {string|number} eventId - ID event
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useOrgAttendanceStats = (eventId) => {
	const currentRole = useUserRole();
	const enabled = currentRole === "organization" && !!eventId;

	return useQuery({
		queryKey: ["orgAttendanceStats", eventId],
		queryFn: async () => {
			const response = await eventParticipantService.orgGetAttendanceStats(
				eventId
			);
			return response;
		},
		enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Hook untuk mengambil recent check-ins untuk organization
 * @param {string|number} eventId - ID event
 * @returns {Object} Query result dengan data, isLoading, error, etc
 */
export const useOrgRecentCheckIns = (eventId) => {
	const currentRole = useUserRole();
	const enabled = currentRole === "organization" && !!eventId;

	return useQuery({
		queryKey: ["orgRecentCheckIns", eventId],
		queryFn: async () => {
			const response = await eventParticipantService.orgGetRecentCheckIns(
				eventId
			);
			return response;
		},
		enabled,
		staleTime: 30 * 1000, // 30 detik - lebih fresh karena realtime
		cacheTime: 5 * 60 * 1000,
		retry: 1,
		refetchInterval: 30000, // Auto refetch tiap 30 detik
	});
};

/**
 * Scan QR code untuk check-in participant (organization).
 *
 * @returns {UseMutationResult} Mutation hook
 * @param {Object} variables - Parameter scan QR
 * @param {string|number} variables.eventId - ID event
 * @param {string} variables.qr_data - Data QR code yang di-scan
 * @invalidates ["orgParticipants", "orgRecentCheckIns", "orgAttendanceStats"]
 */
export const useOrgScanQrMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: eventParticipantService.orgScanQrCheckIn,
		onSuccess: async (_, variables) => {
			const eventId = variables?.eventId;
			await queryClient.invalidateQueries(["orgParticipants"]);
			if (eventId) {
				await queryClient.invalidateQueries(["orgRecentCheckIns", eventId]);
				await queryClient.invalidateQueries(["orgAttendanceStats", eventId]);
			}
			showToast({
				type: "success",
				title: "Berhasil!",
				message: "Participant berhasil check-in",
				duration: 3000,
				position: "top-center",
			});
		},
		onError: (error) => {
			const msg = parseApiError(error) || "Check-in gagal";
			showToast({
				type: "error",
				title: "Gagal!",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Check-in error:", error);
		},
	});
};

/**
 * Download QR code untuk participant (organization).
 *
 * @returns {UseMutationResult} Mutation hook
 * @param {string|number} participantId - ID participant
 */
export const useOrgDownloadQrMutation = () => {
	return useMutation({
		mutationFn: eventParticipantService.orgGetParticipantQR,
		onError: (error) => {
			const msg = parseApiError(error) || "Gagal mengambil QR code";
			showToast({
				type: "error",
				title: "Gagal!",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Download QR error:", error);
		},
	});
};

/**
 * Update status participant menjadi "no_show" untuk yang tidak hadir (organization).
 *
 * @returns {UseMutationResult} Mutation hook
 * @param {string|number} eventId - ID event
 * @invalidates ["orgParticipants"]
 */
export const useOrgUpdateNoShowMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: eventParticipantService.orgUpdateNoShowParticipants,
		onSuccess: async (response) => {
			await queryClient.invalidateQueries(["orgParticipants"]);
			const msg = parseApiError(response);

			showToast({
				type: "success",
				title: "Berhasil!",
				message: msg,
				duration: 4000,
				position: "top-center",
			});
		},
		onError: (error) => {
			const msg = parseApiError(error) || "Gagal update status no show";
			showToast({
				type: "error",
				title: "Gagal!",
				message: msg,
				duration: 3000,
				position: "top-center",
			});
			console.error("Update no show error:", error);
		},
	});
};
