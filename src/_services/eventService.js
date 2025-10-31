import api from "@/_api";

/**
 * Service untuk mengelola Events API
 * Menggunakan backend Laravel yang sudah tersedia
 */

// PUBLIC SERVICES
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

// ADMIN SERVICES
/** Mengambil semua events dengan optional filtering
 *
 * @async
 * @function adminGetEvents
 * @endpoint GET /admin/events
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Promise} Promise dengan data events
 */
export const adminGetEvents = async (params = {}) => {
	const response = await api.get("/admin/events", { params });
	return response.data.data || response.data;
};

/** Mengambil detail event berdasarkan ID.
 *
 * @async
 * @function adminGetEventById
 * @endpoint GET /admin/events/{eventId}
 * @param {string|number} id - ID event
 * @returns {Promise<any>} Data detail event
 */
export const adminGetEventById = async (id) => {
	const response = await api.get(`/admin/events/${id}`);
	return response.data.data || response.data;
};

/** * Buat event baru
 *
 * @async
 * @function adminCreateEvent
 * @endpoint POST /admin/events
 * @param {Object} data - Data event baru
 * @returns {Promise<any>} Data event baru
 */
export const adminCreateEvent = async (data) => {
	try {
		const response = await api.post("/admin/events", data);
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error creating event:", error);
		throw error;
	}
};

/** * Update event
 *
 * @async
 * @function adminUpdateEvent
 * @endpoint POST method PUT /admin/events/{eventId}
 * @param {string|number} id - ID event
 * @param {Object} data - Data event baru
 * @returns {Promise<any>} Data event baru
 */
export const adminUpdateEvent = async (id, data) => {
	try {
		const response = await api.post(`/admin/events/${id}`, data);
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error updating event:", error);
		throw error;
	}
};

/** * Hapus event
 *
 * @async
 * @function adminDeleteEvent
 * @endpoint DELETE /admin/events/{eventId}
 * @param {string|number} id - ID event
 * @returns {Promise<any>} Data event yang dihapus
 */
export const adminDeleteEvent = async (id) => {
	try {
		await api.delete(`/admin/events/${id}`);
	} catch (error) {
		console.log("Error deleting event:", error);
		throw error;
	}
};

// ORGANIZATION SERVICES
/** Mengambil semua events dengan optional filtering
 *
 * @async
 * @function orgGetEvents
 * @endpoint GET /organization/events
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Promise} Promise dengan data events
 */
export const orgGetEvents = async (params = {}) => {
	const response = await api.get("/organization/events", { params });
	return response.data.data || response.data;
};

/** * Hapus event
 *
 * @async
 * @function orgDeleteEvent
 * @endpoint DELETE /organization/events/{eventId}
 * @param {string|number} id - ID event
 * @returns {Promise<any>} Data event yang dihapus
 */
export const orgDeleteEvent = async (id) => {
	try {
		await api.delete(`/organization/events/${id}`);
	} catch (error) {
		console.log("Error deleting event:", error);
		throw error;
	}
};
