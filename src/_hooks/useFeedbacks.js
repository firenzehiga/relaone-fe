import * as feedbackService from "@/_services/feedbackService";
import { useUserRole } from "./useAuth";
import { useQuery } from "@tanstack/react-query";

export const useAdminFeedbacks = (params = {}) => {
    const currentRole = useUserRole();
    const enabled = currentRole === "admin"; // agar jika admin login, tidak fetch feedbacks

    return useQuery({
        queryKey: ["adminFeedbacks", params],
        queryFn: async () => {
            const response = await feedbackService.adminGetFeedbacks(params);
            return response;
        },
        enabled,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
    })
}