import api from "@/_api"

/**
 * Service untuk mengelola Events API
 * Menggunakan backend Laravel yang sudah tersedia
 */

// PUBLIC SERVICES
/** Mengambil semua event participants dengan optional filtering
 *
 * @async
 * @function getParticipants
 * @endpoint GET /event-participants
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Promise} Promise dengan data participants
 */
export const getParticipants = async (params = {}) => {
    const response = await api.get("/event-participants", { params });
    // Laravel API mengembalikan format {success: true, data: [...]}
    return response.data.data || response.data;
}

// ADMIN SERVICES
/** Mengambil semua event participants dengan optional filtering
 *
 * @async
 * @function adminGetParticipants
 * @endpoint GET /admin/event-participants
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Promise} Promise dengan data participants
 */

export const adminGetParticipants = async (params = {}) => {
    const token = localStorage.getItem("authToken");
    const response = await api.get("/admin/event-participants", {
        params, 
        headers: { Authorization: `Barier ${token}` },
    });
    return response.data.data || response.data;
}