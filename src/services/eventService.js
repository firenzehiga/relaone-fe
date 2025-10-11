import api, { mockApiResponse } from "../api/api";

// Import mock data untuk development
import eventsData from "../mock/events.json";

/**
 * Service untuk mengelola Events API
 * Sementara menggunakan mock data, nanti akan diganti dengan real API calls
 */

/**
 * Mengambil semua events dengan optional filtering
 * @param {Object} params - Query parameters untuk filtering
 * @returns {Promise} Promise dengan data events
 */
export const getEvents = async (params = {}) => {
	// TODO: Nanti ganti jadi real API call
	// const response = await api.get('/events', { params });
	// return response.data;

	let filteredEvents = eventsData;
	if (params.status) {
		filteredEvents = eventsData.filter(
			(event) => event.status === params.status
		);
	}
	if (params.category) {
		filteredEvents = filteredEvents.filter(
			(event) => event.category_id === parseInt(params.category)
		);
	}

	const response = await mockApiResponse(filteredEvents);
	return response.data; // Extract data from mock response
};

/**
 * Mengambil detail event berdasarkan ID
 * @param {string|number} id - ID event
 * @returns {Promise} Promise dengan data event
 */
export const getEventById = async (id) => {
	// TODO: Nanti ganti jadi real API call
	// const response = await api.get(`/events/${id}`);
	// return response.data;

	const event = eventsData.find((e) => e.id === parseInt(id));
	const response = await mockApiResponse(event);
	return response.data; // Extract data from mock response
};

/**
 * Membuat event baru
 * @param {Object} eventData - Data event yang akan dibuat
 * @returns {Promise} Promise dengan data event yang dibuat
 */
export const createEvent = async (eventData) => {
	// TODO: Nanti ganti jadi real API call
	// const response = await api.post('/events', eventData);
	// return response.data;

	const newEvent = {
		...eventData,
		id: Date.now(),
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	};
	const response = await mockApiResponse(newEvent);
	return response.data;
};

/**
 * Update event berdasarkan ID
 * @param {string|number} id - ID event yang akan diupdate
 * @param {Object} eventData - Data event yang akan diupdate
 * @returns {Promise} Promise dengan data event yang diupdate
 */
export const updateEvent = async (id, eventData) => {
	// TODO: Nanti ganti jadi real API call
	// const response = await api.put(`/events/${id}`, eventData);
	// return response.data;

	const updatedEvent = {
		...eventData,
		id: parseInt(id),
		updated_at: new Date().toISOString(),
	};
	const response = await mockApiResponse(updatedEvent);
	return response.data;
};

/**
 * Hapus event berdasarkan ID
 * @param {string|number} id - ID event yang akan dihapus
 * @returns {Promise} Promise dengan response success
 */
export const deleteEvent = async (id) => {
	// TODO: Nanti ganti jadi real API call
	// const response = await api.delete(`/events/${id}`);
	// return response.data;

	const response = await mockApiResponse({
		success: true,
		message: "Event deleted successfully",
		id: parseInt(id),
	});
	return response.data;
};

/**
 * Join event sebagai volunteer
 * @param {string|number} id - ID event yang akan diikuti
 * @param {Object} userData - Data pendaftaran volunteer
 * @returns {Promise} Promise dengan response success
 */
export const joinEvent = async (id, userData) => {
	// TODO: Nanti ganti jadi real API call
	// const response = await api.post(`/events/${id}/join`, userData);
	// return response.data;

	// Delay yang lebih lama untuk simulasi proses pendaftaran
	const response = await mockApiResponse(
		{
			success: true,
			message: "Successfully joined event",
			event_id: parseInt(id),
			user_data: userData,
			joined_at: new Date().toISOString(),
		},
		1500
	); // 1.5 detik untuk better UX
	return response.data;
};
