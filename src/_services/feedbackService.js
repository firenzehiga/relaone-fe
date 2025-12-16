import api from "@/_api";

// PUBLIC SERVICES
/** Mengambil Feedback user.
 *
 * @async
 * @function getFeedbacks
 * @endpoint GET /feedbacks
 * @returns {Promise<any>} Data semua feedbacks.
 */
export const getFeedbacks = async () => {
	const response = await api.get("/feedbacks");
	return response.data.data || response.data;
};

// VOLUNTEER SERVICES
/** * kirim feedback
 *
 * @async
 * @function volunteerSendFeedback
 * @endpoint POST /volunteer/event-participations/feedbacks
 * @param {Object} data - Data feedback baru
 */
export const volunteerSendFeedback = async (data) => {
	try {
		const response = await api.post(`/volunteer/event-participations/feedback`, data);
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error sending feedback:", error);
		throw error;
	}
};

// ADMIN SERVICES
/** Mengambil semua feedbacks dengan optional filtering
 *
 * @async
 * @function adminGetFeedbacks
 * @endpoint GET /admin/feedbacks
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Promise} Promise dengan data feedbacks
 */
export const adminGetFeedbacks = async (params = {}) => {
	const response = await api.get("/admin/feedbacks", { params });
	return response.data;
};

/** Mengambil detail feedback berdasarkan ID.
 *
 * @async
 * @function adminGetFeedbackById
 * @endpoint GET /admin/feedbacks/{feedbackId}
 * @param {string|number} id - ID feedback
 * @returns {Promise<any>} Data detail feedback
 */
export const adminGetFeedbackById = async (id) => {
	const response = await api.get(`/admin/feedbacks/${id}`);
	return response.data.data || response.data;
};

/** * Update feedback
 *
 * @async
 * @function adminUpdateFeedback
 * @endpoint POST method PUT /admin/feedbacks/{feedbackId}
 * @param {string|number} id - ID feedback
 * @param {Object} data - Data feedback baru
 * @returns {Promise<any>} Data feedback baru
 */
export const adminUpdateFeedback = async (id, data) => {
	try {
		const response = await api.post(`/admin/feedbacks/${id}`, data);
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error updating event:", error);
		throw error;
	}
};

/** Hapus feedback
 *
 * @async
 * @function adminDeleteFeedback
 * @endpoint DELETE /admin/feedbacks/{feedbackId}
 * @param {string|number} id - ID feedback
 * @returns {Promise<any>} Data feedback yang dihapus
 */
export const adminDeleteFeedback = async (id) => {
	try {
		const response = await api.delete(`/admin/feedbacks/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error deleting feedback:", error);
		throw error;
	}
};

// ORGANIZATION SERVICES
/** Mengambil semua feedbacks dengan optional filtering
 *
 * @async
 * @function orgGetFeedbacks
 * @endpoint GET /organization/feedbacks
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Promise} Promise dengan data feedbacks
 */
export const orgGetFeedbacks = async (params = {}) => {
	const response = await api.get("/organization/feedbacks", { params });
	return response.data;
};
