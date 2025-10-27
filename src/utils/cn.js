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
