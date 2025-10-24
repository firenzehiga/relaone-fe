import { useQuery } from "@tanstack/react-query";
import * as eventParticipantService from "@/_services/eventParticipantService";
import { useUserRole } from "./useAuth"

/**
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
            const response = 
                await eventParticipantService.getParticipants(params);
            return response;
        },
        enabled,
        staleTime: 1 * 60 * 100,
        cacheTime: 5 * 60 * 1000,
		retry: 1,
    });
};

export const useAdminParticipants = (params = {}) => {
    const currentRole = useUserRole();
    const enabled = currentRole === "admin"; // agar jika admin login, tidak fetch event participants

    return useQuery({
        queryKey: ["adminParticipants", params],
        queryFn: async () => {
            const response = await eventParticipantService.adminGetParticipants(params);
            return response;
        },
        enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
    })
}