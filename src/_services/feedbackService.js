import api from "@/_api";

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
	return response.data.data || response.data;
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
