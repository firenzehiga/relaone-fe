/**
 * role pengguna ke daftar route yang diizinkan.
 *
 * Objek ini digunakan untuk menentukan path (route) yang boleh diakses
 * oleh setiap role aplikasi.
 *
 * @constant
 * @type {{admin: string[], organization: string[], volunteer: string[]}}
 * @property {string[]} admin - Array route yang diizinkan untuk role "admin".
 *   (Kosong berarti tidak ada route spesifik yang didefinisikan di sini.)
 * @property {string[]} organization - Array route yang diizinkan untuk role "organization".
 * @property {string[]} volunteer - Array route yang diizinkan untuk role "volunteer".
 */
export const pageAllowed = {
	admin: ["/admin/profile", "/admin/profile/edit"],
	organization: [
		"/organization/dashboard",
		"/organization/events",
		"/organization/event-participants",
		"/organization/locations",
		"/organization/feedbacks",
		"/organization/profile",
	],
	volunteer: ["/", "/events", "/organizations", "/profile", "/profile/edit"],
};

// Helper function untuk mengecek apakah path diizinkan untuk role tertentu
export function isPathAllowedForRole(role, path) {
	// Use the exported `pageAllowed` map. `roleAllowed` is undefined and
	// would throw at runtime.
	const allowed = pageAllowed[role] || [];
	if (allowed.length === 0) return false;

	const normalized = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;

	return allowed.some((p) => {
		if (p === normalized) return true;
		return normalized.startsWith(p.endsWith("/") ? p.slice(0, -1) : p);
	});
}
