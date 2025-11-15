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

// VOLUNTEER SERVICES
/** * Join event sebagai participant
 *
 * @async
 * @function volunteerJoinEvent
 * @endpoint POST /volunteer/events/join
 * @param {Object} data - Data participant baru
 * @returns {Promise<any>} Data participant baru
 */
export const volunteerJoinEvent = async (data) => {
	try {
		const response = await api.post(`/volunteer/events/join`, data);
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error joining event:", error);
		throw error;
	}
};

/** * Batalkan Join event untuk participant
 *
 * @async
 * @function volunteerCancelJoin
 * @endpoint POST /volunteer/events/cancel
 * @param {Object} data - Data participant baru
 * @returns {Promise<any>} Data participant baru
 */
export const volunteerCancelJoin = async (data) => {
	try {
		const response = await api.post(`/volunteer/events/cancel`, data);
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error canceling join event:", error);
		throw error;
	}
};

/** * Buat generate QR Code untuk absen
 *
 * @async
 * @function volunteerGenerateQrCode
 * @endpoint POST /volunteer/event-participants/generate-qr
 * @returns {Promise<any>} QR Code untuk check-in
 */
export const volunteerGenerateQrCode = async (data) => {
	try {
		// backend expects event_id in the request body
		const response = await api.post(
			"/volunteer/event-participations/generate-qr",
			data
		);
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error creating QR Code:", error);
		throw error;
	}
};

/** * Volunteer lihat histori aktivitas mereka
 *
 * @async
 * @function volunteerGetHistory
 * @endpoint GET /volunteer/event-participations/history
 * @param {Object} data - Data participant baru
 * @returns {Promise<any>} Data participant baru
 */
export const volunteerGetHistory = async () => {
	try {
		const response = await api.get("/volunteer/event-participations/history");
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error getting volunteer history:", error);
		throw error;
	}
};

/** Volunteer lihat detail aktivitas berdasarkan ID event participant.
 *
 * @async
 * @function volunteerGetHistoryById
 * @endpoint GET /volunteer/event-participations/history/{id}
 * @param {string|number} id - ID event participant
 * @returns {Promise<any>} Data detail participant
 */
export const volunteerGetHistoryById = async (id) => {
	const response = await api.get(
		`/volunteer/event-participations/history/${id}`
	);
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
	const response = await api.get("/admin/event-participants", { params });
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
	const response = await api.get(`/admin/event-participants/${id}`);
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
	try {
		const response = await api.post("/admin/event-participants", data);
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
	try {
		const response = await api.post(`/admin/event-participants/${id}`, data);
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
	try {
		const response = await api.delete(`/admin/event-participants/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error deleting participant:", error);
		throw error;
	}
};

// ORGANIZATION SERVICES
/** Mengambil semua event participants dengan optional filtering
 *
 * @async
 * @function orgGetParticipants
 * @endpoint GET /organization/event-participants
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Promise} Promise dengan data participants
 */
export const orgGetParticipants = async () => {
	const response = await api.get("/organization/event-participants");
	return response.data.data || response.data;
};

/** * Konfirmasi status pendaftaran partisipan
 *
 * @async
 * @function orgConfirmParticipant
 * @endpoint POST /organization/confirm-participants/{participantId}
 * @param {string|number} id - ID participant
 * @returns {Promise<any>} Data participant baru
 */
export const orgConfirmParticipant = async (id) => {
	try {
		const response = await api.post(`/organization/confirm-participants/${id}`);
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error confirming participant:", error);
		throw error;
	}
};

/** * Tolak status pendaftaran partisipan
 *
 * @async
 * @function orgRejectParticipant
 * @endpoint POST /organization/reject-participants/{participantId}
 * @param {string|number} id - ID participant
 * @returns {Promise<any>} Data participant baru
 */
export const orgRejectParticipant = async (id) => {
	try {
		const response = await api.post(`/organization/reject-participants/${id}`);
		return response.data.data || response.data;
	} catch (error) {
		console.log("Error rejecting participant:", error);
		throw error;
	}
};
/** Mengambil attendance statistics untuk event
 *
 * @async
 * @function orgGetAttendanceStats
 * @endpoint GET /organization/events/{event}/attendance/statistics
 * @param {number|string} eventId - ID event
 * @returns {Promise} Promise dengan data statistics
 */
export const orgGetAttendanceStats = async (eventId) => {
	const response = await api.get(
		`/organization/events/${eventId}/attendance/statistics`
	);
	return response.data.data || response.data;
};

/** Scan QR Code volunteer untuk check-in
 *
 * @async
 * @function orgScanQrCheckIn
 * @endpoint POST /organization/events/{event_id}/scan-qr
 * @param {Object} payload - Data untuk scan
 * @param {number|string} payload.eventId - ID event
 * @param {string} payload.qr_data - Data QR Code yang di-scan
 * @returns {Promise} Promise dengan data volunteer yang check-in
 */
export const orgScanQrCheckIn = async ({ eventId, qr_data }) => {
	const response = await api.post(`/organization/events/${eventId}/scan-qr`, {
		qr_data,
	});
	return response.data;
};

/** Mendapatkan daftar recent check-ins
 *
 * @async
 * @function orgGetRecentCheckIns
 * @endpoint GET /organization/events/{event_id}/attendance/recent
 * @param {number|string} eventId - ID event
 * @returns {Promise} Promise dengan data recent check-ins
 */
export const orgGetRecentCheckIns = async (eventId) => {
	const response = await api.get(
		`/organization/events/${eventId}/attendance/recent`
	);
	return response.data.data || response.data;
};

/** Mendapatkan QR Code untuk participant tertentu
 *
 * @async
 * @function orgGetParticipantQR
 * @endpoint GET /organization/event-participants/{participantId}/qr-code
 * @param {number|string} participantId - ID participant
 * @returns {Promise} Promise dengan data QR code
 */
export const orgGetParticipantQR = async (participantId) => {
	const response = await api.get(
		`/organization/event-participants/${participantId}/qr-code`
	);
	return response.data;
};

/** Update status participant menjadi "no_show" untuk yang tidak hadir
 *
 * @async
 * @function orgUpdateNoShowParticipants
 * @endpoint POST /organization/events/{eventId}/update-no-show
 * @param {number|string} eventId - ID event
 * @returns {Promise} Promise dengan data hasil update
 */
export const orgUpdateNoShowParticipants = async (eventId) => {
	const response = await api.post(
		`/organization/events/${eventId}/update-no-show`
	);
	return response.data;
};
