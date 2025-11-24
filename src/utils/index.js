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

/**
 * Mengembalikan URL gambar dari path yang diberikan
 * Untuk menampilkan gambar dari storage backend
 * @param {string} path - Path gambar yang akan digabungkan
 * @returns {string} URL gambar yang sudah digabungkan
 * Menggunakan import.meta.env.VITE_IMG_STORAGE_URL untuk menggabungkan URL basis
 * Jika path kosong, maka akan mengembalikan string kosong
 * Digunakan di berbagai tempat untuk menggabungkan URL gambar
 */
export const getImageUrl = (path) => {
	const baseUrl =
		import.meta.env.VITE_IMG_STORAGE_URL || "https://be-yuliadi.karyakreasi.id/volunteer-be/storage/";
	if (!path) return "";
	return `${baseUrl}${path}`;
};

/*
 * Parse error response dari API menjadi string pesan yang mudah dibaca
 * Karena biasanya response error dari backend bisa dalam bentuk object
 * jadi kalau lgsg ditampilkan suka error
 * @param {Object} err - Error object dari axios atau fetch
 * @returns {string} Pesan error yang sudah diformat
 * Dipakai di Handle Submit onError di banyak tempat atau HandleDelete
 */
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

// GOOGLE MAPS UTILITIES
/**
 * Generate URL Google Maps untuk melihat lokasi event
 * Prioritas menggunakan koordinat lat/lng, jika tidak ada fallback ke alamat
 *
 * @returns {string} URL Google Maps untuk melihat lokasi
 */
export const getGoogleMapsUrl = (event = {}, { preferAddress = true } = {}) => {
	// prefer address when available (default)
	const address =
		event.location?.alamat ||
		event.address ||
		(typeof event.location === "string" ? event.location : "");
	if (preferAddress && address) {
		return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
			address
		)}`;
	}

	// fallback to coordinates if present
	const lat = event.location?.latitude ?? event.latitude;
	const lng = event.location?.longitude ?? event.longitude;
	if (lat && lng) {
		return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
	}

	// final fallback to any address string (could be empty)
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		address
	)}`;
};
/**
 * Generate URL Google Maps untuk mendapatkan petunjuk arah ke lokasi event
 * Prioritas menggunakan koordinat lat/lng, jika tidak ada fallback ke alamat
 *
 * @returns {string} URL Google Maps untuk mendapatkan petunjuk arah
 */
export const getDirectionsUrl = (event = {}, { preferAddress = true } = {}) => {
	// prefer address when available (default)
	const address =
		event.location?.alamat ||
		event.address ||
		(typeof event.location === "string" ? event.location : "");
	if (preferAddress && address) {
		return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
			address
		)}`;
	}

	// fallback to coordinates if present
	const lat = event.location?.latitude ?? event.latitude;
	const lng = event.location?.longitude ?? event.longitude;
	if (lat && lng) {
		return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
	}

	// final fallback to any address string (could be empty)
	return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
		address
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

/*
 * Parse Google Maps URL untuk mengekstrak latitude, longitude, zoom level, dan place name
 * Mendukung berbagai format URL Google Maps
 * @param {string} url - URL Google Maps yang akan diparsing
 * @returns {object|null
 * Helper Untuk Form Create/Edit data Locations di Admin maupun Organizers
 */
export const parseGoogleMapsUrl = (url) => {
	try {
		if (!url || typeof url !== "string") return null;
		const u = url.trim();

		// Ini untuk mengambil koordinat dari pola @lat,lng,zoomz
		const atMatch = u.match(/@(-?\d+\.\d+),(-?\d+\.\d+),(\d+(?:\.\d+)?)z/);
		if (atMatch) {
			return {
				latitude: atMatch[1],
				longitude: atMatch[2],
				zoom_level: Math.round(Number(atMatch[3])),
				place: extractPlaceFromPath(u),
			};
		}

		// Ini untuk mengambil koordinat dari pola !3dlat!4dlng
		const dMatch = u.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
		if (dMatch) {
			return {
				latitude: dMatch[1],
				longitude: dMatch[2],
				zoom_level: 15,
				place: extractPlaceFromPath(u),
			};
		}

		// Ini untuk mengambil koordinat dari parameter q=
		const qMatch = u.match(/[?&]q=\s*(-?\d+\.\d+),(-?\d+\.\d+)/);
		if (qMatch) {
			return {
				latitude: qMatch[1],
				longitude: qMatch[2],
				zoom_level: 15,
				place: extractPlaceFromPath(u),
			};
		}

		// Ini untuk mengambil koordinat dari URL Google Maps
		const llMatch = u.match(/[?&]ll=\s*(-?\d+\.\d+),(-?\d+\.\d+)/);
		if (llMatch) {
			return {
				latitude: llMatch[1],
				longitude: llMatch[2],
				zoom_level: 15,
				place: extractPlaceFromPath(u),
			};
		}

		// Ini untuk mengambil koordinat langsung dari URL jika ada
		const anyMatch = u.match(/(-?\d+\.\d+),(-?\d+\.\d+)/);
		if (anyMatch) {
			return {
				latitude: anyMatch[1],
				longitude: anyMatch[2],
				zoom_level: 15,
				place: extractPlaceFromPath(u),
			};
		}

		return null;
	} catch (err) {
		console.error("parseGoogleMapsUrl error", err);
		return null;
	}
};

export const extractPlaceFromPath = (url) => {
	try {
		const m = url.match(/\/place\/([^\/]+)/);
		if (m && m[1]) {
			return decodeURIComponent(m[1].replace(/\+/g, " "));
		}
		// Jika tidak ada, coba pola lain
		const m2 = url.match(/\/maps\/(?:place\/)?([^@\/]*)/);
		if (m2 && m2[1]) {
			return decodeURIComponent(m2[1].replace(/\+/g, " "));
		}
	} catch (e) {
		// ignore
	}
	return "";
};

// Export volunteer badge utilities
export {
	getVolunteerEventBadge,
	getAllVolunteerBadgeLevels,
	getVolunteerProgress,
	checkLevelUp,
} from "./profile/volunteerBadges";

// Export organization badge utilities
export {
	getOrganizationEventBadge,
	getOrganizationVerificationBadge,
	getAllOrganizationBadgeLevels,
	getOrganizationProgress,
	checkOrganizationLevelUp,
} from "./profile/organizationBadges";

// Export skills helper utilities
export {
	parseSkillsArray,
	addSkill,
	updateSkill,
	removeSkill,
	validateSkill,
	formatSkillsForDisplay,
	formatSkillsForBackend,
	getSkillsStats,
} from "./profile/skillsHelpers";
