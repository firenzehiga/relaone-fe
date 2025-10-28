import api from "@/_api";

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
	return response.data.data || response.data;
};

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
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data.data || response.data;
};

/** Mengambil detail participant berdasarkan ID.
 *
 * @async
 * @function adminGetParticipantById
 * @endpoint GET /admin/event-participants/{participantId}
 * @param {string|number} id - ID participant
 * @returns {Promise<any>} Data detail participant
 */
export const adminGetParticipantById = async (id) => {
	const token = localStorage.getItem("authToken");
	const response = await api.get(`/admin/event-participants/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data.data || response.data;
};

/** * Buat participant baru
 *
 * @async
 * @function adminCreateParticipant
 * @endpoint POST /admin/event-participants
 * @param {Object} data - Data participant baru
 * @returns {Promise<any>} Data participant baru
 */
export const adminCreateParticipant = async (data) => {
	const token = localStorage.getItem("authToken");
	try {
		const response = await api.post("/admin/event-participants", data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error creating event:", error);
		throw error;
	}
};

/** * Update participant
 *
 * @async
 * @function adminUpdateParticipant
 * @endpoint POST method PUT /admin/event-participants/{participantId}
 * @param {string|number} id - ID participant
 * @param {Object} data - Data participant baru
 * @returns {Promise<any>} Data participant baru
 */
export const adminUpdateParticipant = async (id, data) => {
	const token = localStorage.getItem("authToken");
	try {
		const response = await api.post(`/admin/event-participants/${id}`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error updating event:", error);
		throw error;
	}
};

/** Hapus participant
 *
 * @async
 * @function adminDeleteParticipant
 * @endpoint DELETE /admin/event-participants/{participantId}
 * @param {string|number} id - ID participant
 * @returns {Promise<any>} Data participant baru
 */
export const adminDeleteParticipant = async (id) => {
	const token = localStorage.getItem("authToken");
	try {
		const response = await api.delete(`/admin/event-participants/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.log("Error deleting participant:", error);
		throw error;
	}
};
