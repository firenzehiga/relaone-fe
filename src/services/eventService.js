import api from "@/api/api";

/**
 * Service untuk mengelola Events API
 * Menggunakan backend Laravel yang sudah tersedia
 */

/** Mengambil semua events dengan optional filtering
 *
 * @async
 * @function getEvents
 * @endpoint GET /events
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Promise} Promise dengan data events
 */
export const getEvents = async (params = {}) => {
	const response = await api.get("/events", { params });
	// Laravel API mengembalikan format {success: true, data: [...]}
	return response.data.data || response.data;
};

/** Mengambil detail event berdasarkan ID.
 *
 * @async
 * @function getEventById
 * @endpoint GET /events/{eventId}
 * @param {string|number} id - ID event
 * @returns {Promise<any>} Data detail event
 */
export const getEventById = async (id) => {
	const response = await api.get(`/events/${id}`);
	return response.data.data || response.data;
};

/** * Buat event baru
 *
 * @async
 * @function createEvent
 * @endpoint POST /events
 * @param {Object} eventData - Data event baru
 * @returns {Promise<any>} Data event baru
 */
export const createEvent = async (eventData) => {
	const response = await api.post("/events", eventData);
	return response.data.data || response.data;
};

/** * Update event
 *
 * @async
 * @function updateEvent
 * @endpoint POST method PUT /events/{eventId}
 * @param {string|number} id - ID event
 * @param {Object} eventData - Data event baru
 * @returns {Promise<any>} Data event baru
 */
export const updateEvent = async (id, eventData) => {
	const response = await api.put(`/events/${id}`, eventData);
	return response.data.data || response.data;
};

/** * Hapus event
 *
 * @async
 * @function deleteEvent
 * @endpoint DELETE /events/{eventId}
 * @param {string|number} id - ID event
 * @returns {Promise<any>} Data event yang dihapus
 */
export const deleteEvent = async (id) => {
	const response = await api.delete(`/events/${id}`);
	return response.data;
};
