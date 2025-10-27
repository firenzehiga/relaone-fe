/**
 * Utility function untuk menggabungkan class names CSS dengan aman
 * Menghilangkan class yang falsy (null, undefined, false, empty string)
 * Berguna untuk conditional styling dan menggabungkan multiple class
 *
 * @param {...(string|null|undefined|boolean)} classes - Class names yang akan digabungkan
 * @returns {string} String class names yang sudah digabungkan dan difilter
 *
 * @example
 * cn("btn", "btn-primary", isDisabled && "btn-disabled", "")
 * // returns: "btn btn-primary btn-disabled" (jika isDisabled = true)
 *
 * @example
 * cn("text-red-500", null, undefined, "font-bold")
 * // returns: "text-red-500 font-bold"
 */
export const cn = (...classes) => {
	return classes.filter(Boolean).join(" ");
};

export const parseApiError = (err) => {
	const data = err?.response?.data ?? err;
	if (!data) return "Terjadi kesalahan";
	if (typeof data === "string") return data;
	const flatten = (v) =>
		(Array.isArray(v)
			? v.flat(Infinity)
			: typeof v === "object"
			? Object.values(v).flat(Infinity)
			: [v]
		)
			.filter(Boolean)
			.join(" ");
	return (
		flatten(data.message) ||
		flatten(data.errors) ||
		flatten(data) ||
		JSON.stringify(data)
	);
};

export const getImageUrl = (path) => {
	const baseUrl =
		import.meta.env.VITE_IMG_STORAGE_URL || "http://localhost:8000/storage/";
	if (!path) return "";
	return `${baseUrl}${path}`;
};

/**
 * Memformat string tanggal menjadi format Indonesia yang lebih ringkas
 *
 * @param {string} dateString - String tanggal dalam format apapun yang bisa di-parse Date
 * @returns {string} Tanggal dalam format "DD MMM YYYY"
 */
export const formatDate = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

/**
 * Memformat string waktu dengan mengambil jam dan menit saja
 * Menangani case dimana timeString bisa undefined/null
 *
 * @param {string} timeString - String waktu dalam format HH:MM:SS atau HH:MM
 * @returns {string} Waktu dalam format HH:MM
 */
export const formatTime = (timeString) => {
	if (!timeString) return "00:00";
	return timeString.slice(0, 5);
};

// GOOGLE MAPS UTILITIES
/**
 * Generate URL Google Maps untuk melihat lokasi event
 * Prioritas menggunakan koordinat lat/lng, jika tidak ada fallback ke alamat
 *
 * @returns {string} URL Google Maps untuk melihat lokasi
 */
export const getGoogleMapsUrl = (event = {}) => {
	if (event.location?.latitude && event.location?.longitude) {
		return `https://www.google.com/maps/search/?api=1&query=${event.location.latitude},${event.location.longitude}`;
	}
	if (event.latitude && event.longitude) {
		return `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`;
	}
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		event.location?.alamat || event.address || event.location || ""
	)}`;
};

/**
 * Generate URL Google Maps untuk mendapatkan petunjuk arah ke lokasi event
 * Prioritas menggunakan koordinat lat/lng, jika tidak ada fallback ke alamat
 *
 * @returns {string} URL Google Maps untuk mendapatkan petunjuk arah
 */
export const getDirectionsUrl = (event = {}) => {
	if (event.location?.latitude && event.location?.longitude) {
		return `https://www.google.com/maps/dir/?api=1&destination=${event.location.latitude},${event.location.longitude}`;
	}
	if (event.latitude && event.longitude) {
		return `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`;
	}
	return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
		event.location?.alamat || event.address || event.location || ""
	)}`;
};

/**
 * Helper: build a Google Static Maps URL when coordinates are available.
 * Returns null if no coords.
 * @param {object} event
 * @returns {string|null}
 */
export const getStaticMapUrl = (event = {}) => {
	const lat = event.location?.latitude || event.latitude;
	const lng = event.location?.longitude || event.longitude;
	if (!lat || !lng) return null;
	const zoom = event.map_zoom_level || 15;
	return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=400x200&maptype=roadmap&markers=color:red%7Clabel:E%7C${lat},${lng}&key=YOUR_GOOGLE_MAPS_API_KEY`;
};
