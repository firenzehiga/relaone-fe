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
	const token = localStorage.getItem("authToken");
	const response = await api.get("/admin/feedbacks", {
		params,
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data.data || response.data;
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
	const token = localStorage.getItem("authToken");
	try {
		const response = await api.delete(`/admin/feedbacks/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.log("Error deleting feedback:", error);
		throw error;
	}
};
